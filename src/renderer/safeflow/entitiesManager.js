'use strict'
/**
*  EntitiesManager
*
*
* @class EntitiesManager
* @package    safeFlow
* @copyright  Copyright (c) 2019 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
import Entity from './scienceEntities.js'
import TimeUtilities from './systems/timeUtility.js'
import CNRLmaster from './cnrl/cnrlMaster.js'
const util = require('util')
const events = require('events')

var EntitiesManager = function () {
  events.EventEmitter.call(this)
  this.liveTimeUtil = new TimeUtilities()
  this.liveCNRL = new CNRLmaster()
  this.liveSEntities = {}
}

/**
* inherits core emitter class within this class
* @method inherits
*/
util.inherits(EntitiesManager, events.EventEmitter)

/**
*  create new Science entity
* @method addScienceEntity
*
*/
EntitiesManager.prototype.addScienceEntity = async function (ecsIN, setIN) {
  console.log(ecsIN)
  let cid = ecsIN.cid
  let timePeriod = ecsIN.time // starting time ms
  let visID = ecsIN.visID[0]
  if (this.liveSEntities[cid]) {
    console.log('entity' + cid + 'already exists')
    // does the data exist for this visualisation and time?
    let checkDataExist = this.checkForVisualData(cid, timePeriod.startperiod, visID)
    // console.log('check')
    // console.log(checkDataExist)
    if (checkDataExist === true) {
      console.log('data already ready')
      this.liveSEntities[cid].liveDataC.setStartDate(timePeriod)
      this.liveSEntities[cid].liveDataC.setTimeList(timePeriod)
    } else if (ecsIN.timeperiod === true) {
      // toolbar select timerange mode
      console.log('toolbar select time range')
      await this.controlFlow(ecsIN).then(function (cFlow) {
        console.log('CONTROLFLOW--already-COMPLETE')
        // console.log(cFlow)
      })
    } else {
      // new data call required for this visualisation time
      console.log('need to prepare new visualisation data')
      // console.log(timePeriod)
      this.liveSEntities[cid].liveDataC.setStartDate(timePeriod)
      this.liveSEntities[cid].liveDataC.setTimeList(timePeriod.range)
      await this.controlFlow(ecsIN).then(function (cFlow) {
        console.log('CONTROLFLOW--already-COMPLETE')
        // console.log(cFlow)
      })
    }
  } else {
    console.log('entity' + cid + 'is new')
    // start workflow for setting up entity, compute and vis/sim etc.
    this.liveSEntities[cid] = new Entity(ecsIN, setIN)
    // set listener for recoveryHR
    if (cid === 'cnrl-2356388733') {
      this.listenRHRdataEvent()
    }
    // set the livestart time for the UI
    this.liveSEntities[cid].liveDataC.setStartDate(timePeriod)
    this.liveSEntities[cid].liveDataC.setTimeList(timePeriod.range)
    await this.controlFlow(ecsIN).then(function (cFlow) {
      console.log('CONTROLFLOW--new--COMPLETE')
      // console.log(cFlow)
    })
  }
  return true
}

/**
*  control the adding of data to the entity
*  KnowledgeSciptingLanguage(forth/stack)to give gurantees)
* @method controlFlow
*
*/
EntitiesManager.prototype.controlFlow = async function (cflowIN) {
  var localthis = this
  // console.log(cflowIN)
  let cid = cflowIN.cid
  // let timePeriod = cflowIN.time
  let range = cflowIN.time.range
  let wasmID = cflowIN.wasm
  let visID = cflowIN.visID[0]
  let cnrlInfo = cflowIN.science
  console.log('EMANAGER0-----beginCONTROL-FLOW')
  await this.liveSEntities[cid].liveDataC.RawData()
  console.log('EMANAGER1-----raw complete')
  await localthis.liveSEntities[cid].liveDataC.TidyData()
  console.log('EMANAGER2-----tidy complete')
  // console.log(tidyReturn)
  console.log('EMANAGER3---START')
  let computeBundle = {}
  computeBundle.lastComputeTime = ''
  computeBundle.live = cid
  computeBundle.wasmID = wasmID
  computeBundle.status = false
  computeBundle.liveTime = localthis.liveSEntities[cid].liveDataC.livedate.startperiod
  computeBundle.rangeTime = range
  let computeStatus = await localthis.liveSEntities[cid].liveComputeC.filterCompute(computeBundle, localthis.liveSEntities[cid].liveDataC.deviceList, cnrlInfo, localthis.liveSEntities[cid].liveDataC.dataRaw)
  console.log('EMANAGER3--complete')
  localthis.computeStatus = computeStatus
  // console.log(localthis.computeStatus)
  console.log('EMANAGE4--START-VIS')
  let visBundle = {}
  visBundle.vid = visID
  visBundle.cnrl = cid
  visBundle.deviceList = localthis.liveSEntities[cid].liveDataC.deviceList
  visBundle.datatypeList = localthis.liveSEntities[cid].liveDataC.datatypeList
  console.log('feed into vissss')
  visBundle.liveTime = localthis.liveSEntities[cid].liveDataC.livedate.startperiod
  visBundle.timeList = localthis.liveSEntities[cid].liveDataC.livedate.startperiod
  let visStatus = localthis.liveSEntities[cid].liveVisualC.filterVisual(visBundle, localthis.liveSEntities[cid].liveDataC.tidyData)
  console.log('visCompenent--FINISHED')
  console.log('5CONTROLFLOW___OVER(firstpass)')
  // console.log(localthis.computeStatus)
  // console.log(localthis.computeStatus.computeState.status)
  if (visStatus === true) {
    console.log('52ndSTARTFLOW----')
    if (localthis.computeStatus.computeState.status === 'uptodate') {
      console.log('UP TO DATE')
    } else if (localthis.computeStatus.computeState.status === 'update-required' || localthis.computeStatus.computeState.status === 'update-start-required') {
      console.log('5a--NOT uptodate')
      // emit message to inform peer that computation is progressing
      localthis.emit('computation', 'in-progress')
      computeBundle.status = true
      computeBundle.lastComputeTime = localthis.computeStatus.lastTimeComp
      computeBundle.liveTime = localthis.liveSEntities[cid].liveDataC.livedate
      console.log('5b--START_COMPUTEagain')
      await localthis.liveSEntities[cid].liveComputeC.filterCompute(computeBundle, localthis.liveSEntities[cid].liveDataC.deviceList, cnrlInfo, localthis.liveSEntities[cid].liveDataC.dataRaw)
      console.log('SECOND COMPUTE FITER RETURN')
      console.log('EMANAGER5c-----asked for the rawdata now compute updated')
      await this.liveSEntities[cid].liveDataC.RawData()
      let visStatus = localthis.liveSEntities[cid].liveVisualC.filterVisual(visID, wasmID, localthis.liveSEntities[cid].liveDataC.livedate, localthis.liveSEntities[cid].liveDataC.datatypeList, cnrlInfo, localthis.liveSEntities[cid].liveDataC.timeList, localthis.liveSEntities[cid].liveDataC.deviceList, localthis.liveSEntities[cid].liveDataC.tidyData)
      console.log(visStatus)
      console.log('5dVISOVER2___OVER(2ndpass)')
    }
  }
  console.log('6CONTROLFLOW___OVER(2ndpass)')
  return true
}

/**
*  check if entity already has data raw tidy visual
* @method checkForVisualData
*
*/
EntitiesManager.prototype.checkForVisualData = function (cid, timePeriod, visStyle) {
  // need to loop over TODO
  //  this only check for last prepareData, need VisualComponent to use push(object)
  // console.log(this.liveSEntities[cid])
  let entityData = this.liveSEntities[cid].liveVisualC.visualData
  if (!entityData[visStyle]) {
    return false
  } else if (entityData[visStyle][timePeriod]) {
    return true
  } else {
    return false
  }
}

/**
*  list all live Enties index CIDs
* @method listEntities
*
*/
EntitiesManager.prototype.listEntities = function () {
  return this.liveSEntities
}

/**
*  return data from an entity
* @method entityDataReturn
*
*/
EntitiesManager.prototype.entityDataReturn = async function (eid, visStyle) {
  console.log('ENTITYMANAGER----retrun data')
  // console.log(eid)
  // console.log(visStyle)
  // console.log(this.liveSEntities)
  let dateLive = this.liveSEntities[eid].liveDataC.livedate
  if (this.liveSEntities[eid].liveVisualC.visualData[visStyle] === undefined) {
    console.log('no existing chart data')
    let messageBundle = {}
    messageBundle.chartMessage = 'computation in progress'
    messageBundle.chartPackage = this.liveSEntities[eid].liveVisualC.visualData[visStyle][dateLive.startperiod]
    messageBundle.liveChartOptions = this.liveSEntities[eid].liveVisualC.liveChartSystem
    return messageBundle
  } else if (this.liveSEntities[eid].liveVisualC.visualData[visStyle].status === 'report-component') {
    console.log('HR learn report instead of chart')
    let messageVisBundle = {}
    messageVisBundle.chartMessage = 'vis-report'
    messageVisBundle.liveChartOptions = {}
    messageVisBundle.chartPackage = {}
    messageVisBundle.hrcReport = this.liveSEntities[eid].liveDataC.dataRaw
    return messageVisBundle
  } else {
    console.log('existing data to chart')
    let messageVisBundle = {}
    messageVisBundle.chartMessage = 'existing'
    messageVisBundle.liveChartOptions = this.liveSEntities[eid].liveVisualC.liveChartSystem
    messageVisBundle.chartPackage = this.liveSEntities[eid].liveVisualC.visualData[visStyle][dateLive.startperiod]
    return messageVisBundle
  }
}

/**
*  return chart data from an entity
* @method entityChartReturn
*
*/
EntitiesManager.prototype.entityChartReturn = async function (eid) {
  return this.liveSEntities[eid].liveVisualC
}

/**
*  return chart data from an entity
* @method GetaverageCurrentDailyStatistics
*
*/
EntitiesManager.prototype.GetaverageCurrentDailyStatistics = async function (eid) {
  let averageCurrentAHR = this.liveSEntities[eid].liveComputeC.liveComputeSystem.liveStatistics.averageCurrentDailyStatistics('1', this.liveSEntities[eid].seid.device[0].device_mac, 'cnrl-2356388732', '1')
  return averageCurrentAHR
}

/**
*  return observation entity data
* @method listenRHRdataEvent
*
*/
EntitiesManager.prototype.listenRHRdataEvent = async function () {
  const localthis = this
  // let dataOlive = {}
  // listener
  this.liveSEntities['cnrl-2356388733'].liveComputeC.liveCompute.liveRecoveryHR.on('liveobserve', function (call) {
    console.log('event from recoveryHR')
    localthis.liveSEntities['cnrl-2356388733'].liveComputeC.liveCompute.liveRecoveryHR.data = localthis.liveSEntities['cnrl-2356388731'].liveDataC.tidyData[0]
    // console.log(localthis.liveSEntities['cnrl-2356388731'])
    // dataOlive = localthis.liveSEntities['cnrl-2356388731'].liveDataC.tidyData[0]
    // console.log(dataOlive)
  })
}

/**
*  add component
* @method addComponent
*
*/
EntitiesManager.prototype.addComponent = function (entID) {
}

/**
*  remove component
* @method removeComponent
*
*/
EntitiesManager.prototype.removeComponent = function (entID) {

}

export default EntitiesManager

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
  let timeBundle = ecsIN.time // starting time ms
  let visID = ecsIN.visID[0] // limited to one for now will free up TODO
  if (this.liveSEntities[cid]) {
    console.log('entity' + cid + 'already exists')
    // does the data exist for this visualisation and time?
    let checkDataExist = this.checkForVisualData(cid, timeBundle.startperiod, visID)
    // console.log('check')
    // console.log(checkDataExist)
    if (checkDataExist === true) {
      console.log('data already ready')
      this.liveSEntities[cid].liveDataC.setStartTime(timeBundle.startperiod)
      this.liveSEntities[cid].liveDataC.setTimeList(timeBundle.startperiod)
      this.liveSEntities[cid].liveDataC.setTimeSegments(timeBundle.timeseg)
      this.liveSEntities[cid].liveDataC.setDatatypesLive(ecsIN.datatypes)
      this.liveSEntities[cid].liveDataC.setCategories(ecsIN.categories)
    } else {
    /* else if (ecsIN.timeperiod === true) {
      // toolbar select timerange mode
      console.log('toolbar select time range')
      await this.controlFlow(ecsIN).then(function (cFlow) {
        console.log('CONTROLFLOW--already-COMPLETE')
        // console.log(cFlow)
      })
    } */
      // new data call required for this visualisation time
      console.log('need to prepare new visualisation data')
      // console.log(timePeriod)
      this.liveSEntities[cid].liveDataC.setStartTime(timeBundle.startperiod)
      this.liveSEntities[cid].liveDataC.setTimeList(timeBundle.startperiod)
      this.liveSEntities[cid].liveDataC.setTimeSegments(timeBundle.timeseg)
      this.liveSEntities[cid].liveDataC.setDatatypesLive(ecsIN.datatypes)
      this.liveSEntities[cid].liveDataC.setCategories(ecsIN.categories)
      await this.controlFlow(ecsIN).then(function (cFlow) {
        console.log('CONTROLFLOW--already-COMPLETE')
        // console.log(cFlow)
      })
    }
  } else {
    console.log('entity' + cid + 'is new')
    // start workflow for setting up entity, compute and vis/sim etc.
    this.liveSEntities[cid] = new Entity(ecsIN, setIN)
    // default input set on setting up of component
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
  // var localthis = this
  console.log('controlflow start')
  console.log(cflowIN)
  let cid = cflowIN.cid
  // let timePeriod = cflowIN.time
  // let range = cflowIN.time.range
  // let wasmID = cflowIN.wasm
  // let visID = cflowIN.visID[0]
  console.log('EMANAGER0-----beginCONTROL-FLOW')
  this.liveSEntities[cid].liveDatatypeC.dataTypeMapping()
  /* await this.liveSEntities[cid].liveTimeC.startTimeSystem()
  await this.liveSEntities[cid].liveDataC.RawData()
  console.log('EMANAGER1-----raw complete')
  await localthis.liveSEntities[cid].liveDataC.TidyData()
  localthis.liveSEntities[cid].liveDataC.CategoriseData()
  console.log('EMANAGER2-----tidy complete')
  // console.log(tidyReturn)
  console.log('EMANAGER3---START')
  let computeBundle = {}
  computeBundle.lastComputeTime = ''
  computeBundle.cid = cid
  computeBundle.wasmID = wasmID
  computeBundle.status = false
  computeBundle.liveTime = localthis.liveSEntities[cid].liveDataC.livedate
  computeBundle.realtime = cflowIN.time.realtime
  computeBundle.rangeTime = range
  computeBundle.timeseg = cflowIN.time.timeseg
  this.computeStatus = await localthis.liveSEntities[cid].liveComputeC.filterCompute(computeBundle, localthis.liveSEntities[cid].liveDataC.dataRaw)
  console.log('EMANAGER3--complete')
  console.log('EMANAGE4--START-VIS')
  let visBundle = {}
  visBundle.vid = visID
  visBundle.cnrl = cid
  visBundle.computeStatus = this.computeStatus.computeState
  visBundle.deviceList = localthis.liveSEntities[cid].liveDataC.deviceList
  visBundle.datatypeList = localthis.liveSEntities[cid].liveDataC.datatypeList
  visBundle.liveTime = localthis.liveSEntities[cid].liveDataC.livedate
  visBundle.timeList = localthis.liveSEntities[cid].liveDataC.livedate
  let visStatus = localthis.liveSEntities[cid].liveVisualC.filterVisual(visBundle, localthis.liveSEntities[cid].liveDataC.tidyData)
  console.log('visCompenent--FINISHED')
  console.log('5CONTROLFLOW___OVER(firstpass)')
  console.log(visStatus)
  console.log(localthis.computeStatus)
  if (visStatus === true) {
    console.log('5a--2ndSTARTFLOW----')
    // emit message to inform peer that computation is progressing
    localthis.emit('computation', 'in-progress')
    computeBundle.status = true
    computeBundle.computeStatus = this.computeStatus
    computeBundle.liveTime = localthis.liveSEntities[cid].liveDataC.livedate
    console.log('5b--START_COMPUTEagain')
    await localthis.liveSEntities[cid].liveComputeC.filterCompute(computeBundle, localthis.liveSEntities[cid].liveDataC.dataRaw)
    console.log('5c---asked for the rawdata of results')
    await this.liveSEntities[cid].liveDataC.RawData()
    let visBundle2 = {}
    visBundle2.vid = visID
    visBundle2.cnrl = cid
    visBundle2.deviceList = localthis.liveSEntities[cid].liveDataC.deviceList
    visBundle2.datatypeList = localthis.liveSEntities[cid].liveDataC.datatypeList
    visBundle2.liveTime = localthis.liveSEntities[cid].liveDataC.livedate
    visBundle2.timeList = localthis.liveSEntities[cid].liveDataC.livedate
    visBundle2.computeStatus = 'go'
    let liveUpdatedCompData = this.latestData(localthis.liveSEntities[cid].liveDataC.tidyData)
    let visStatus = localthis.liveSEntities[cid].liveVisualC.filterVisual(visBundle2, liveUpdatedCompData)
    console.log(visStatus)
    console.log('5dVISOVER2___OVER(2ndpass)')
  } */
  console.log('6CONTROLFLOW___OVER(2ndpass)')
  return true
}

/**
*  extract the lastest ie most uptodate data in entity
* @method latestData
*
*/
EntitiesManager.prototype.latestData = function (dataIn) {
  console.log('lastest Data tidy')
  let lastArray = dataIn.slice(-1)
  return lastArray
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
  console.log(eid)
  console.log(visStyle)
  console.log(this.liveSEntities[eid].liveVisualC)
  let GroupVisBundle = []
  let messageVisBundle = {}
  let timeLive = this.liveSEntities[eid].liveDataC.livedate
  // loop over visualisation available and pick out match
  for (let lvc of this.liveSEntities[eid].liveVisualC.visualData) {
    console.log('visLOOP to match')
    console.log(lvc)
    if (lvc[visStyle] === undefined) {
      console.log('no existing chart data')
      messageVisBundle = {}
      messageVisBundle.chartMessage = 'computation in progress/ Nothing to chart'
      GroupVisBundle.push(messageVisBundle)
    } else if (lvc[visStyle].status === 'report-component') {
      console.log('HR learn report instead of chart')
      messageVisBundle = {}
      messageVisBundle.chartMessage = 'vis-report'
      messageVisBundle.liveChartOptions = {}
      messageVisBundle.chartPackage = {}
      messageVisBundle.displayTime = timeLive
      messageVisBundle.hrcReport = this.liveSEntities[eid].liveDataC.dataRaw
      GroupVisBundle.push(messageVisBundle)
    } else if (lvc['vis-sc-1']) {
      console.log('existing data to chart')
      console.log(timeLive)
      console.log(lvc)
      // for (let vi of lvc[visStyle][timeLive]) {
      console.log('chart day item')
      // console.log(vi)
      if (lvc[visStyle][timeLive].day) {
        messageVisBundle = {}
        messageVisBundle.chartMessage = 'Chart'
        messageVisBundle.liveChartOptions = lvc[visStyle][timeLive].day.options
        messageVisBundle.chartPackage = lvc[visStyle][timeLive].day.prepared
        messageVisBundle.displayTime = timeLive
        messageVisBundle.selectTimeStart = this.liveSEntities[eid].liveVisualC.liveVisSystem.liveChartSystem
        GroupVisBundle.push(messageVisBundle)
      }
      // }
    }
  }
  return GroupVisBundle
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
  console.log('avg avg live')
  console.log(eid)
  console.log(this.liveSEntities[eid])
  let averageCurrentAHR = this.liveSEntities[eid].liveComputeC.liveComputeSystem.liveAverage.avgliveStatistics.averageCurrentDailyStatistics('1', this.liveSEntities[eid].seid.devices[0].device_mac, 'cnrl-2356388732', 'cnrl-8856388724', 'day')
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

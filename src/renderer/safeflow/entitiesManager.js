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
EntitiesManager.prototype.addScienceEntity = async function (segT, entID, setIN) {
  // console.log(entID)
  // const localthis = this
  const cid = entID.science.cid
  const wasmID = entID.science.wasm
  const visID = entID.vis
  // build time profile and setup setFirstEntity
  const timePeriod = this.liveTimeUtil.timePeriod(segT)
  entID.timeperiod = timePeriod
  const cnrlInfo = this.liveCNRL.lookupContract(entID.science.cid)
  entID.dataTypesCNRL = cnrlInfo
  // console.log(entID.dataTypesCNRL)
  if (this.liveSEntities[cid]) {
    console.log('entity' + cid + 'already exists')
    // does the data exist for this visualisation and time?
    let checkDataExist = this.checkForVisualData(cid, timePeriod, visID)
    if (checkDataExist === true) {
      console.log('data already ready')
      this.liveSEntities[cid].liveDataC.setStartDate(timePeriod)
      this.liveSEntities[cid].liveDataC.setTimeList(timePeriod)
    } else {
      // new data call required for this visualisation and time
      console.log('need to prepare new visualisation data')
      this.liveSEntities[cid].liveDataC.setStartDate(timePeriod)
      this.liveSEntities[cid].liveDataC.setTimeList(timePeriod)
      await this.controlFlow(cid, timePeriod, wasmID, visID, cnrlInfo).then(function (cFlow) {
        console.log('CONTROLFLOW--already-COMPLETE')
        console.log(cFlow)
      })
    }
  } else {
    console.log('entity' + cid + 'is new')
    // start workflow for setting up entity, compute and vis/sim etc.
    this.liveSEntities[cid] = new Entity(entID, setIN)
    // console.log(this.liveSEntities)
    // set the livestart time for the UI
    this.liveSEntities[cid].liveDataC.setStartDate(timePeriod)
    this.liveSEntities[cid].liveDataC.setTimeList(timePeriod)
    await this.controlFlow(cid, timePeriod, wasmID, visID, cnrlInfo).then(function (cFlow) {
      console.log('CONTROLFLOW--new--COMPLETE')
      console.log(cFlow)
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
EntitiesManager.prototype.controlFlow = async function (cid, timePeriod, wasmID, visID, cnrlInfo) {
  var localthis = this
  console.log('EMANAGER0-----beginCONTROL-FLOW')
  await this.liveSEntities[cid].liveDataC.RawData()
  console.log('EMANAGER1-----raw complete')
  // console.log(rawReturn)
  await localthis.liveSEntities[cid].liveDataC.TidyData()
  console.log('EMANAGER2-----tidy complete')
  // console.log(tidyReturn)
  console.log('EMANAGER3---START')
  let computeBundle = {}
  computeBundle.lastComputeTime = ''
  computeBundle.live = cid
  computeBundle.wasmID = wasmID
  computeBundle.status = false
  computeBundle.liveTime = localthis.liveSEntities[cid].liveDataC.livedate
  let computeStatus = await localthis.liveSEntities[cid].liveComputeC.filterCompute(computeBundle, localthis.liveSEntities[cid].liveDataC.deviceList, cnrlInfo, localthis.liveSEntities[cid].liveDataC.dataRaw)
  console.log('EMANAGER3--complete')
  localthis.computeStatus = computeStatus
  console.log(localthis.computeStatus)
  console.log('EMANAGE4--START____VVVIISSSSIMM')
  let visStatus = localthis.liveSEntities[cid].liveVisualC.filterVisual(visID, wasmID, localthis.liveSEntities[cid].liveDataC.livedate, localthis.liveSEntities[cid].liveDataC.datatypeList, cnrlInfo, localthis.liveSEntities[cid].liveDataC.timeList, localthis.liveSEntities[cid].liveDataC.deviceList, localthis.liveSEntities[cid].liveDataC.tidyData)
  console.log(visStatus)
  console.log('5CONTROLFLOW___OVER(firstpass)')
  console.log(localthis.computeStatus)
  console.log(localthis.computeStatus.computeState.status)
  if (visStatus === true) {
    console.log(localthis.computeStatus.computeState.status)
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
  let entityData = this.liveSEntities[cid].liveVisualC.visualData
  console.log(entityData)
  // console.log(timePeriod)
  // console.log(entityData[timePeriod])
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
  console.log(this.liveSEntities[eid].liveVisualC[visStyle])
  let dateLive = this.liveSEntities[eid].liveDataC.livedate
  console.log(dateLive)
  // console.log(this.liveSEntities[eid].liveVisualC.visualData[visStyle])
  if (this.liveSEntities[eid].liveVisualC.visualData[visStyle] === undefined) {
    console.log('no existing chart data')
    let messageBundle = {}
    messageBundle.chartMessage = 'computation in progress'
    messageBundle.chartPackage = this.liveSEntities[eid].liveVisualC.visualData[visStyle][dateLive]
    messageBundle.liveChartOptions = this.liveSEntities[eid].liveVisualC.liveChartSystem
    return messageBundle
  } else {
    console.log('existing data to chart')
    let messageVisBundle = {}
    messageVisBundle.chartMessage = 'computation in progress'
    messageVisBundle.liveChartOptions = this.liveSEntities[eid].liveVisualC.liveChartSystem
    messageVisBundle.chartPackage = this.liveSEntities[eid].liveVisualC.visualData[visStyle][dateLive]
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

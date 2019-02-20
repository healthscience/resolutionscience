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
    console.log(checkDataExist)
    if (checkDataExist === true) {
      // exists
      console.log('data already ready')
      this.liveSEntities[cid].liveDataC.setStartDate(timePeriod)
      this.liveSEntities[cid].liveDataC.setTimeList(timePeriod)
      // need to check if compute flag for update needs acting on.
      return true
    } else {
      // new data call required for this visualisation and time
      console.log('need to prepare new visualisation data')
      this.liveSEntities[cid].liveDataC.setStartDate(timePeriod)
      this.liveSEntities[cid].liveDataC.setTimeList(timePeriod)
      await this.controlFlow(cid, timePeriod, wasmID, visID, cnrlInfo)
    }
  } else {
    console.log('entity' + cid + 'is new')
    // start workflow for setting up entity, compute and vis/sim etc.
    // async(immutable), KnowledgeSciptingLanguage(forth/stack), use SmartContract (need to select one to give gurantees)
    this.liveSEntities[cid] = new Entity(entID, setIN)
    // console.log(this.liveSEntities)
    // set the livestart time for the UI
    this.liveSEntities[cid].liveDataC.setStartDate(timePeriod)
    this.liveSEntities[cid].liveDataC.setTimeList(timePeriod)
    await this.controlFlow(cid, timePeriod, wasmID, visID, cnrlInfo)
  }
}

/**
*  control the adding of data to the entity
* @method controlFlow
*
*/
EntitiesManager.prototype.controlFlow = async function (cid, timePeriod, wasmID, visID, cnrlInfo) {
  var localthis = this
  // let cnrlLive = {}
  console.log('EMANAGER0-----beginCONTROL-FLOW')
  await this.liveSEntities[cid].liveDataC.RawData().then(function (rawReturn) {
    console.log('EMANAGER1-----raw complete')
    // console.log(localthis.liveSEntities[cid].liveDataC)
  }).then(function () {
    localthis.liveSEntities[cid].liveDataC.TidyData().then(function () {
      console.log('EMANAGER2-----tidy complete')
    }).then(function () {
      let computeBundle = {}
      computeBundle.lastComputeTime = ''
      computeBundle.live = cid
      computeBundle.wasmID = wasmID
      computeBundle.status = false
      console.log('3START____COMPUTTEEEE')
      localthis.liveSEntities[cid].liveComputeC.filterCompute(computeBundle, localthis.liveSEntities[cid].liveDataC.deviceList, cnrlInfo, localthis.liveSEntities[cid].liveDataC.dataRaw).then(function (computeStatus) {
        localthis.computeStatus = computeStatus
        console.log('EMANAGER3-----compute complete')
      }).then(function () {
        console.log('4START____VVVIISSSSIMM')
        localthis.liveSEntities[cid].liveVisualC.filterVisual(visID, wasmID, localthis.liveSEntities[cid].liveDataC.livedate, localthis.liveSEntities[cid].liveDataC.datatypeList, cnrlInfo, localthis.liveSEntities[cid].liveDataC.timeList, localthis.liveSEntities[cid].liveDataC.deviceList, localthis.liveSEntities[cid].liveDataC.tidyData).then(function (visR) {
          console.log(localthis.computeStatus)
          console.log('5CONTROLFLOW___OVER')
          if (localthis.computeStatus === 'uptodate') {
            console.log('UP TO DATE')
            return true
          } else if (localthis.computeStatus === 'update-required') {
            console.log('NOT uptodate')
            computeBundle.status = true
            console.log('3START_COMPUTTE2222')
            localthis.liveSEntities[cid].liveComputeC.filterCompute(computeBundle, localthis.liveSEntities[cid].liveDataC.deviceList, cnrlInfo, localthis.liveSEntities[cid].liveDataC.dataRaw).then(function (computeStatus) {
            // need to update computation from source data
            // localthis.controlFlow() // start flow again
            })
          }
          // console.log(localthis.liveSEntities)
        })
      })
    })
  }).catch(function (err) {
    console.log(err)
  })
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
  // console.log(eid)
  // console.log(visStyle)
  console.log(this.liveSEntities[eid].liveVisualC[visStyle])
  let dateLive = this.liveSEntities[eid].liveDataC.livedate
  console.log(dateLive)
  // console.log(this.liveSEntities[eid].liveVisualC.visualData[visStyle])
  if (this.liveSEntities[eid].liveVisualC.visualData[visStyle] === undefined) {
    console.log('no existing chart data')
    let messageBundle = {}
    messageBundle.chartMessage = 'computation in progress'
    return messageBundle
  } else {
    console.log('existing data to chart')
    return this.liveSEntities[eid].liveVisualC.visualData[visStyle][dateLive]
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

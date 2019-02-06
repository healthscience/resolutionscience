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
  console.log(entID)
  // const localthis = this
  const cid = entID.science.cid
  const wasmID = entID.science.wasm
  // build time profile and setup setFirstEntity
  const timePeriod = this.liveTimeUtil.timePeriod(segT)
  entID.timeperiod = timePeriod
  const cnrlInfo = this.liveCNRL.lookupContract(entID.science.cid)
  entID.dataTypesCNRL = cnrlInfo
  console.log(entID.dataTypesCNRL)
  if (this.liveSEntities[cid]) {
    console.log('entity' + cid + 'already exists')
    // does the data exist for this day?
    let checkDataExist = this.checkForVisualData(cid, timePeriod)
    console.log(checkDataExist)
    if (checkDataExist === true) {
      // exist return
      this.liveSEntities[cid].liveDataC.setStartDate(timePeriod)
      this.liveSEntities[cid].liveDataC.setTimeList(timePeriod)
      console.log('time data already ready')
      console.log('but has any new data arrived')
      return true
    } else {
      // new data call require for this date
      console.log('need to prepare new data for this date')
      this.liveSEntities[cid].liveDataC.setStartDate(timePeriod)
      this.liveSEntities[cid].liveDataC.setTimeList(timePeriod)
      await this.controlFlow(cid, timePeriod, wasmID)
    }
  } else {
    console.log('entity' + cid + 'is new')
    // start workflow for setting up entity, compute and vis/sim etc.
    // async(immutable), KnowledgeSciptingLanguage(forth/stack), use SmartContract (need to select one to give gurantees)
    // workflow function chain ..
    this.liveSEntities[cid] = new Entity(entID, setIN)
    // console.log(this.liveSEntities)
    // set the livestart Date for the UI
    this.liveSEntities[cid].liveDataC.setStartDate(timePeriod)
    this.liveSEntities[cid].liveDataC.setTimeList(timePeriod)
    await this.controlFlow(cid, timePeriod, wasmID)
  }
}

/**
*  control the adding of data to the entity
* @method controlFlow
*
*/
EntitiesManager.prototype.controlFlow = async function (cid, timePeriod, wasmID) {
  var localthis = this
  // let cnrlLive = {}
  console.log('EMANAGER0-----beginCONTROL-FLOW')
  await this.liveSEntities[cid].liveDataC.RawData().then(function (rawReturn) {
    // console.log(rawReturn)
    console.log(localthis.liveSEntities[cid].liveDataC)
    // console.log('EMANAGER1a-----end raw start Tidy')
  }).then(function () {
    localthis.liveSEntities[cid].liveDataC.TidyData().then(function () {
      // console.log('CONTROLFLOW___COMPUTE COMPLETE')
    }).then(function () {
      let computeBundle = {}
      computeBundle = localthis.establishDataStatus(cid, timePeriod)
      computeBundle.live = wasmID
      computeBundle.wasmID = wasmID
      console.log('computeBUndle')
      console.log(computeBundle)
      localthis.liveSEntities[cid].liveComputeC.filterCompute(computeBundle).then(function () {
      // console.log('EMANAGER1b-----tidy complete')
      }).then(function () {
        localthis.liveSEntities[cid].liveVisualC.filterVisual('chartjs', localthis.liveSEntities[cid].liveDataC.livedate, localthis.liveSEntities[cid].liveDataC.datatypeList, localthis.liveSEntities[cid].liveDataC.timeList, localthis.liveSEntities[cid].liveDataC.deviceList, localthis.liveSEntities[cid].liveDataC.tidyData).then(function (visR) {
          // console.log(visR)
          console.log('CONTROLFLOW___OVER')
          return true
          // console.log(localthis.liveSEntities)
        })
      })
    })
  }).catch(function (err) {
    console.log(err)
  })
}

/**
*  establishStatus of data in entity
* @method establishDataStatus
*
*/
EntitiesManager.prototype.establishDataStatus = function (cid, timePeriod) {
  // need to loop over
  // const localthis = this
  let sourceDataStatus = {}
  sourceDataStatus = this.checkForDataPerDevice(cid, timePeriod)
  console.log(sourceDataStatus)
  return sourceDataStatus
}

/**
*  check if entity already has data raw tidy visual
* @method checkForData
*
*/
EntitiesManager.prototype.checkForData = function (cid, timePeriod) {
  // need to loop over
  console.log('check timePeriod data?????')
  console.log(cid)
  console.log(this.liveSEntities[cid])
  let entityData = this.liveSEntities[cid].liveDataC
  console.log(entityData)
  for (let dataI of entityData.dataRaw) {
    console.log(dataI)
    if (dataI[timePeriod]) {
      console.log('check true')
      return true
    } else {
      console.log('check false')
      return false
    }
  }
}

/**
*  check if entity already has data raw tidy visual
* @method checkForDataPerDevice
*
*/
EntitiesManager.prototype.checkForDataPerDevice = function (cid, timePeriod) {
  // need to loop over
  const localthis = this
  console.log('check timePeriod PER DEVICE data?????')
  let dataStatus = []
  let deviceStatus = {}
  let entityData = this.liveSEntities[cid].liveDataC
  let entityDevList = this.liveSEntities[cid].liveDataC.deviceList
  // console.log(entityData.dataRaw)
  // console.log(entityDevList)
  for (let dataI of entityData.dataRaw) {
    console.log(dataI)
    for (let device of entityDevList) {
      console.log('length of data raw existing')
      console.log(timePeriod)
      console.log(device)
      console.log(dataI)
      if (!dataI[timePeriod]) {
        console.log('no data for the entity')
        // does any input source data exist?
        let firstD = localthis.liveSEntities[cid].liveDataC.liveDataSystem.liveTestStorage.getFirstData(device)
        deviceStatus.lastComputetime = firstD
        deviceStatus[device] = false
        dataStatus.push(deviceStatus)
        deviceStatus = {}
      } else if (dataI[timePeriod][device].length > 0) {
        console.log('existing data')
        deviceStatus.lastComputetime = localthis.liveSEntities[cid].liveDataC.tidyData.slice(-1)
        deviceStatus[device] = true
        dataStatus.push(deviceStatus)
        deviceStatus = {}
      }
    }
  }
  return dataStatus
}

/**
*  extract first data element from entity data
* @method extractFirstDataElement
*
*/
EntitiesManager.prototype.extractFirstDataElement = function (cid) {
  // loop over devices and produce array of first timestamps
  /* let deviceStarttimes = []
  let entityData = this.liveSEntities[cid].liveDataC
  let entityDevList = this.liveSEntities[cid].liveDataC.deviceList
  for (let device of entityDevList) {
    if (dataI[timePeriod][device].length > 0) {
      console.log('existing data')
      deviceStarttimes.push(localthis.liveSEntities[cid].liveDataC.tidyData[device].slice(1))
      return true
    } else {
      console.log('no data for the entity')
      localthis.liveSEntities[cid].liveDataC.tidyData.slice(1)
      return false
    }
  } */
}

/**
*  check if entity already has data raw tidy visual
* @method checkForVisualData
*
*/
EntitiesManager.prototype.checkForVisualData = function (cid, timePeriod) {
  // need to loop over TODO
  //  this only check for last prepareData, need VisualComponent to use push(object)
  let entityData = this.liveSEntities[cid].liveVisualC.visualData
  console.log(entityData)
  console.log(timePeriod)
  console.log(entityData[timePeriod])
  if (entityData[timePeriod]) {
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
EntitiesManager.prototype.entityDataReturn = async function (eid) {
  console.log('ENTITYMANAGER----retrun data')
  console.log(eid)
  let dateLive = this.liveSEntities[eid].liveDataC.livedate
  console.log(dateLive)
  console.log(this.liveSEntities[eid].liveVisualC.visualData)
  return this.liveSEntities[eid].liveVisualC.visualData[dateLive]
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

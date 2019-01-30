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
  // build time profile and setup setFirstEntity
  const timePeriod = this.liveTimeUtil.timePeriod(segT)
  entID.timeperiod = timePeriod
  const cnrlInfo = this.liveCNRL.lookupContract(entID.cnrl)
  entID.dataTypesCNRL = cnrlInfo
  if (this.liveSEntities[cid]) {
    console.log('entity' + cid + 'already exists')
    // does the data exist for this day?
    if (this.liveSEntities[cid].liveDataC[timePeriod]) {
      // exist return
      this.liveSEntities[cid].liveDataC.setStartDate(timePeriod)
      this.liveSEntities[cid].liveDataC.setTimeList(timePeriod)
      console.log('time data already ready')
      return true
    } else {
      // new data call require for this date
      console.log('need to prepare new data for this date')
      this.liveSEntities[cid].liveDataC.setStartDate(timePeriod)
      this.liveSEntities[cid].liveDataC.setTimeList(timePeriod)
      await this.controlFlow(cid)
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
    await this.controlFlow(cid)
  }
}

/**
*  control the adding of data to the entity
* @method controlFlow
*
*/
EntitiesManager.prototype.controlFlow = async function (cid) {
  var localthis = this
  // await this.liveSEntities[cid].liveDataC.setCNRLDataTypes().then(function () {
  // console.log('EMANAGER---set CNRL dataTypes finsihed')
  console.log('EMANAGER0-----beginCONTROL-FLOW')
  await this.liveSEntities[cid].liveDataC.RawData().then(function (rawReturn) {
    // console.log(rawReturn)
    // console.log(localthis.liveSEntities[cid].liveDataC)
    // console.log('EMANAGER1a-----end raw start Tidy')
  }).then(function () {
    localthis.liveSEntities[cid].liveDataC.TidyData().then(function () {
      // console.log('EMANAGER1b-----tidy complete')
      // console.log('CONTROLFLOW___OVER')
    }).then(function () {
      localthis.liveSEntities[cid].liveVisualC.filterVisual('chartjs', localthis.liveSEntities[cid].liveDataC.livedate, localthis.liveSEntities[cid].liveDataC.datatypeList, localthis.liveSEntities[cid].liveDataC.timeList, localthis.liveSEntities[cid].liveDataC.deviceList, localthis.liveSEntities[cid].liveDataC.tidyData).then(function (visR) {
        console.log(visR)
        console.log('CONTROLFLOW___OVER')
        return true
        // console.log(localthis.liveSEntities)
      })
    })
  }).catch(function (err) {
    console.log(err)
  })
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
  return this.liveSEntities[eid].liveVisualC.visualData
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

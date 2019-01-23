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
import Entities from './scienceEntities.js'
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
  const localthis = this
  const cid = entID.science.cid
  // build time profile and setup setFirstEntity
  const timePeriod = this.liveTimeUtil.timePeriod(segT)
  entID.timeperiod = timePeriod
  const cnrlInfo = this.liveCNRL.lookupContract(entID.cnrl)
  entID.dataTypesCNRL = cnrlInfo
  // start workflow for setting up entity, compute and vis/sim etc.
  // async(immutable), KnowledgeSciptingLanguage(forth/stack), use SmartContract (need to select one to give gurantees)
  // workflow function chain ..
  this.liveSEntities[cid] = new Entities(entID, setIN)
  console.log(this.liveSEntities)
  await this.liveSEntities[cid].liveDataC.RawData(entID).then(function () {
    console.log('EMANAGER--- rawdata finsihed')
    localthis.liveSEntities[cid].liveDataC.setDataTypes()
  }).then(function () {
    console.log('EMANAGER---set dataTypes finsihed')
    localthis.liveSEntities[cid].liveDataC.TidyData()
  }).then(function () {
    // compute required
    localthis.liveSEntities[cid].liveComputeC.filterCompute()
    console.log('EMANAGER---tidy finsihed')
  }).then(function () {
    // structure require for visualisation
    localthis.liveSEntities[cid].liveVisualC.filterVisual('chartjs', localthis.liveSEntities[cid].liveDataC.tidyData)
    console.log('EMANAGER---computation finsihed')
  }).then(function () {
    // structure require for simulation
    localthis.liveSEntities[cid].liveSimC.filterSimulation()
    console.log('EMANAGER---visulations (chart) finsihed')
  }).then(function () {
    console.log('EMANAGER---simulation finsihed')
  }).catch(function (err) {
    console.log(err)
  })
  return 'EMANAGER---NEW finished'
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
  console.log('CALLED ENTITYDATARESTURN')
  return this.liveSEntities[eid].liveVisualC.visualData
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

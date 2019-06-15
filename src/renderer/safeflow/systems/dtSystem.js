'use strict'
/**
*  DTSystem
*
*
* @class DTSystem
* @package    safeFlow
* @copyright  Copyright (c) 2019 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/

import CNRLmaster from '../cnrl/cnrlMaster.js'
import TestStorageAPI from './dataprotocols/teststorage/testStorage.js'
const util = require('util')
const events = require('events')

var DTSystem = function (setIN) {
  events.EventEmitter.call(this)
  this.liveCNRL = new CNRLmaster()
  this.liveTestStorage = new TestStorageAPI(setIN)
}

/**
* inherits core emitter class within this class
* @method inherits
*/
util.inherits(DTSystem, events.EventEmitter)

/**
*  // map data prime to source data types
* @method DTStartFilter
*
*/
DTSystem.prototype.DTStartFilter = function (dAPI, cnrl) {
  console.log(dAPI)
  console.log(cnrl)
  // given datastore and CNRL science contract map the source API queries to datatypes or source Types
  let APIcnrl = this.DTtableStructure(dAPI)
  // look up science computations contract if see what datatypes are listed (this assumes they are enter on setting up science contract???)
  let SciDTs = this.DTscienceStructure(cnrl)
  // map the storage API data types to the science entity datatype
  let datatypeMatch = this.mapDTs(APIcnrl.datatypes, SciDTs.datatypes)
  // let dtCategoryMatch = this.mapDTs(apiDTs.categories, sciSourceCatDTs)
  console.log('dt match')
  console.log(datatypeMatch)
  // console.log(dtCategoryMatch)
}

/**
* take in two data type arrays and return matching dts
* @method mapDTs
*
*/
DTSystem.prototype.mapDTs = function (dts1, dts2) {
  // matching of two arrays
  let matchArray = []
  console.log('dt matchter')
  console.log(dts1)
  console.log(dts2)
  // matchArray = dts1.filter(x => dts2.includes(x.cnrl))
  matchArray = dts1.filter(({ cnrl: id1 }) => dts2.some(({ cnrl: id2 }) => id2 === id1))
  console.log('filter match')
  console.log(matchArray)
  return matchArray
}

/**
*  // lookup and assess table structure
* @method DTtableStructure
*
*/
DTSystem.prototype.DTtableStructure = function (dAPI) {
  console.log(dAPI)
  let dtHolder = {}
  let subSourceAPI = {}
  let apiDTs = []
  // given datastore and CNRL science contract map the source API queries to datatypes or source Types
  let APIcnrl = this.liveCNRL.lookupContract(dAPI)
  // loop over table structure and extract out the dataTypes
  for (let dtt of APIcnrl.tableStructure[0]) {
    // lookup source DT contracts and build
    let indivDT = this.liveCNRL.lookupContract(dtt.cnrl)
    apiDTs.push(indivDT.prime)
    // if (dtt.cnrl.length > 0) {
    // apiDTs.push(dtt)
    // }
  }
  // does a sub or source structure contract exist?
  if (APIcnrl.source) {
    subSourceAPI = this.liveCNRL.lookupContract(APIcnrl.source)
  }
  console.log(subSourceAPI)
  dtHolder.datatypes = apiDTs
  dtHolder.sourcedts = subSourceAPI
  return dtHolder
}

/**
*  // lookup dts from the science side
* @method DTscienceStructure
*
*/
DTSystem.prototype.DTscienceStructure = function (cnrl) {
  console.log(cnrl)
  let sciDTholder = {}
  let sciSourceDTs = []
  let sciCategoryDTs = []
  let scienceCNRL = this.liveCNRL.lookupContract(cnrl)
  console.log(scienceCNRL)
  // look up datatypes and check to see if they are derive from other datatypes?
  for (let iDT of scienceCNRL.datatypes) {
    console.log(iDT)
    let indivDT = this.liveCNRL.lookupContract(iDT.cnrl)
    sciSourceDTs.push(indivDT.prime)
  }
  for (let icDT of scienceCNRL.categories) {
    console.log('list of categories')
    console.log(icDT)
    let indivcDT = this.liveCNRL.lookupContract(icDT.cnrl)
    console.log(indivcDT)
    sciCategoryDTs.push(indivcDT.prime)
  }
  sciDTholder.contract = scienceCNRL
  sciDTholder.datatypes = sciSourceDTs
  sciDTholder.categories = sciCategoryDTs
  return sciDTholder
}

export default DTSystem

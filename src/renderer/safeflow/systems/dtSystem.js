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
*  // match datatypes to query API via CNRL packaging contract(s)
* @method DTStartMatch
*
*/
DTSystem.prototype.DTStartMatch = function (dAPI, lDTs, catDTs) {
  console.log('dt to query matchter')
  // look up packaging contract
  let packagingDTs = this.liveCNRL.lookupContract(dAPI)
  let SpackagingDTs = {}
  let TidyDataLogic = []
  // is this a derived source?
  if (packagingDTs.source !== 'cnrl-primary') {
    // look up source data packaging
    SpackagingDTs = this.liveCNRL.lookupContract(packagingDTs.source)
    // tidy data info available?
    if (packagingDTs.tidy === true) {
      // investiage the source contract
      // does the live DT require any tidying?
      for (let tldt of SpackagingDTs.tidyList) {
        console.log('tidy list cnrl')
        console.log(tldt)
        for (let dtl of lDTs) {
          console.log('live dts')
          console.log(dtl)
          if (dtl.cnrl === tldt.cnrl) {
            console.log('match')
            TidyDataLogic = SpackagingDTs.tidyList
          } else {
            // TidyDataLogic = []
          }
        }
      }
    }
  } else {
    // extract tidy logic info.
    TidyDataLogic = packagingDTs.tidyList
  }
  let DTmapAPI = this.datatypeCheck(packagingDTs, lDTs)
  // if null check if category dt, ie derived from two or more dataTypeSensor
  let checkDTcategory = []
  let extractCatDT = []
  let catDTmapAPI = []
  if (catDTs.length > 0) {
    checkDTcategory = this.categoryCheck(catDTs[0], SpackagingDTs)
    // now check the API query for this dataType
    // todo extract data type ie loop over category matches, same or all different?
    // lookup the dataType
    let catDT = []
    extractCatDT = this.liveCNRL.lookupContract(checkDTcategory[0].column)
    catDT.push(extractCatDT.prime)
    catDTmapAPI = this.datatypeCheck(packagingDTs, catDT)
  } else {
    checkDTcategory = []
  }

  let apiInfo = {}
  apiInfo.apiquery = [...DTmapAPI, ...catDTmapAPI]
  apiInfo.categorycodes = checkDTcategory
  apiInfo.datatypes = lDTs
  apiInfo.tidyList = TidyDataLogic
  console.log('FINAL datatpe INFO')
  console.log(apiInfo)
  return apiInfo
}

/**
*  // map data prime to source data types
* @method datatypeCheck
*
*/
DTSystem.prototype.datatypeCheck = function (packagingDTs, lDTs) {
  console.log('check datatype to api location')
  let apiMatch = []
  // given datatypes select find match to the query string
  let tableCount = 0
  // match to source API query
  for (let dtt of packagingDTs.tableStructure) {
    for (let idt of lDTs) {
      const result = dtt.filter(item => item.cnrl === idt.cnrl)
      if (result.length > 0) {
        let packAPImatch = {}
        packAPImatch.cnrl = result[0].cnrl
        packAPImatch.column = result[0].text
        packAPImatch.api = packagingDTs.apistructure[tableCount]
        apiMatch.push(packAPImatch)
      }
    }
    tableCount++
  }
  return apiMatch
}

/**
*  // map data prime to source data types
* @method categoryCheck
*
*/
DTSystem.prototype.categoryCheck = function (cdt, catSource) {
  console.log('check category')
  console.log(cdt)
  console.log(catSource)
  let catMatch = []
  for (let catS of catSource.categorycodes) {
    for (let sc of catS.categories) {
      let scat = sc.cnrl
      let uicat = cdt.cnrl
      // any matches to data type in
      if (scat === uicat) {
        let codeLogic = sc.code
        let catHolderLogic = {}
        catHolderLogic.column = catS.column
        catHolderLogic.code = codeLogic
        catMatch.push(catHolderLogic)
      }
    }
  }
  return catMatch
}

/**
*  // map data prime to source data types
* @method DTStartFilter
*
*/
DTSystem.prototype.DTStartFilter = function (dAPI, cnrl) {
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
  matchArray = dts1.filter(({ cnrl: id1 }) => dts2.some(({ cnrl: id2 }) => id2 === id1))
  return matchArray
}

/**
*  // lookup and assess table structure
* @method DTtableStructure
*
*/
DTSystem.prototype.DTtableStructure = function (dAPI) {
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
  let sciDTholder = {}
  let sciSourceDTs = []
  let sciCategoryDTs = []
  let scienceCNRL = this.liveCNRL.lookupContract(cnrl)
  // look up datatypes and check to see if they are derive from other datatypes?
  for (let iDT of scienceCNRL.datatypes) {
    let indivDT = this.liveCNRL.lookupContract(iDT.cnrl)
    sciSourceDTs.push(indivDT.prime)
  }
  for (let icDT of scienceCNRL.categories) {
    let indivcDT = this.liveCNRL.lookupContract(icDT.cnrl)
    sciCategoryDTs.push(indivcDT.prime)
  }
  sciDTholder.contract = scienceCNRL
  sciDTholder.datatypes = sciSourceDTs
  sciDTholder.categories = sciCategoryDTs
  return sciDTholder
}

export default DTSystem

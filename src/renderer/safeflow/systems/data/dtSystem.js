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

import CNRLmaster from '../../cnrl/cnrlMaster.js'
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
DTSystem.prototype.DTStartMatch = function (devicesIN, lDTs, catDTs) {
  let datatypePerdevice = []
  let catDTmapAPI = []
  console.log(catDTmapAPI)
  // loop over devices and match to API etc
  for (let dliv of devicesIN) {
    let packagingDTs = this.liveCNRL.lookupContract(dliv.cnrl)
    console.log('api cnrl')
    console.log(packagingDTs)
    // is the data type primary?
    let sourceDTextract = this.mapSourceDTs(lDTs)
    let sourceDTmapAPI = this.datatypeCheckAPI(packagingDTs, sourceDTextract)
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
          for (let dtl of sourceDTextract) {
            if (dtl.cnrl === tldt.cnrl) {
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
    let DTmapAPI = this.datatypeCheckAPI(packagingDTs, lDTs)
    // if null check if category dt, ie derived from two or more dataTypeSensor
    let checkDTcategory = []
    let extractCatDT = []
    if (catDTs.length > 0 && catDTs[0].cnrl !== 'none') {
      checkDTcategory = this.categoryCheck(catDTs[0], SpackagingDTs)
      // now check the API query for this dataType
      // todo extract data type ie loop over category matches, same or all different?
      // lookup the dataType
      let catDT = []
      extractCatDT = this.liveCNRL.lookupContract(checkDTcategory[0].column)
      catDT.push(extractCatDT.prime)
      catDTmapAPI = this.datatypeCheckAPI(packagingDTs, catDT)
    } else {
      checkDTcategory = []
    }

    let apiHolder = {}
    apiHolder[dliv.device_mac] = {}
    let apiInfo = {}
    apiInfo.apiquery = DTmapAPI // [...DTmapAPI, ...catDTmapAPI]
    apiInfo.sourceapiquery = sourceDTmapAPI
    apiInfo.sourceDTs = sourceDTextract
    apiInfo.categorycodes = checkDTcategory
    apiInfo.datatypes = lDTs
    apiInfo.tidyList = TidyDataLogic
    apiHolder[dliv.device_mac] = apiInfo
    datatypePerdevice.push(apiHolder)
  }
  return datatypePerdevice
}

/**
*  // map data prime to source data types
* @method datatypeCheckAPI
*
*/
DTSystem.prototype.datatypeCheckAPI = function (packagingDTs, lDTs) {
  console.log('api m to DT check')
  console.log(packagingDTs)
  console.log(lDTs)
  let apiMatch = []
  let apiKeep = {}
  // given datatypes select find match to the query string
  let tableCount = 0
  // match to source API query
  for (let dtt of packagingDTs.tableStructure) {
    // is there table structure embedd in the storageStructure?
    console.log('tatable colum strucgture')
    console.log(dtt)
    // check to see if table contains sub structure
    let subStructure = this.subStructure(dtt)
    console.log('substructure returned')
    console.log(subStructure)
    if (subStructure.length > 0) {
      dtt = subStructure
    }
    for (let idt of lDTs) {
      const result = dtt.filter(item => item.cnrl === idt.cnrl)
      if (result.length > 0) {
        let packAPImatch = {}
        packAPImatch.cnrl = result[0].cnrl
        packAPImatch.column = result[0].text
        packAPImatch.api = packagingDTs.apistructure[tableCount]
        apiMatch.push(packAPImatch)
        if (apiMatch.length === lDTs.length) {
          apiKeep = apiMatch
          apiMatch = []
        }
      }
    }
    apiMatch = []
    tableCount++
  }
  return apiKeep
}

/**
*  check for sub table structure
* @method subStructure
*
*/
DTSystem.prototype.subStructure = function (tableStructure) {
  console.log('sub table structure')
  console.log(tableStructure)
  let subStructure = []
  for (let tcI of tableStructure) {
    if (tcI.cnrl === 'sensors') {
      console.log('yes sub structure')
      subStructure = tcI.data
    }
  }
  return subStructure
}

/**
*  map data type to souce DT if they exist
* @method mapSourceDTs
*
*/
DTSystem.prototype.mapSourceDTs = function (lDTs) {
  let sourceDTextract = []
  for (let iDT of lDTs) {
    // look up datatype contract to see if derived?
    let dtSourceContract = this.liveCNRL.lookupContract(iDT.cnrl)
    if (dtSourceContract.source === 'cnrl-derived') {
      // loop over source DT's
      for (let sDT of dtSourceContract.dtsource) {
        // look up datatype contract
        let dtprime = this.liveCNRL.lookupContract(sDT)
        sourceDTextract.push(dtprime.prime)
      }
    } else {
      sourceDTextract.push(iDT)
    }
  }
  // need to remove duplicate elements
  sourceDTextract = sourceDTextract.filter((sourceDTextract, index, self) =>
    index === self.findIndex((t) => (
      t.cnrl === sourceDTextract.cnrl
    ))
  )
  return sourceDTextract
}
/**
*  // map data prime to source data types
* @method categoryCheck
*
*/
DTSystem.prototype.categoryCheck = function (cdt, catSource) {
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
  // let APIcnrl = this.DTtableStructure(dAPI)
  // look up science computations contract if see what datatypes are listed (this assumes they are enter on setting up science contract???)
  // let SciDTs = this.DTscienceStructure(cnrl)
  // map the storage API data types to the science entity datatype
  // let datatypeMatch = this.mapDTs(APIcnrl.datatypes, SciDTs.datatypes)
  // let dtCategoryMatch = this.mapDTs(apiDTs.categories, sciSourceCatDTs)
}

/**
* take in two data type arrays and return matching dts
* @method mapDTs
*
*/
DTSystem.prototype.mapDTs = function (dts1, dts2) {
  // matching of two arrays
  let matchArray = []
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

'use strict'
/**
*  CategoryDataSystem
*
*
* @class CategoryDataSystem
* @package    safeFlow
* @copyright  Copyright (c) 2019 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/

import CNRLmaster from '../../kbl-cnrl/cnrlMaster.js'
import TestStorageAPI from './dataprotocols/safenetwork/index.js'
const util = require('util')
const events = require('events')

var CategoryDataSystem = function (setIN) {
  events.EventEmitter.call(this)
  this.liveCNRL = new CNRLmaster()
  this.liveTestStorage = new TestStorageAPI(setIN)
}

/**
* inherits core emitter class within this class
* @method inherits
*/
util.inherits(CategoryDataSystem, events.EventEmitter)

/**
* lookup categorisation rules and apply
* @method categorySorter
*
*/
CategoryDataSystem.prototype.categorySorter = function (systemBundle, rawData, time) {
  let catHolder = {}
  // is it source or derive categorisation?
  if (systemBundle.primary === 'derived') {
    // no cat require return data unchanged
    // console.log('no categorisation required')
    catHolder = rawData
  } else {
    catHolder = {}
    const excludeCodes = (e, tItem, column) => {
      for (let fCode of tItem) {
        let codeP = parseInt(fCode.code, 10)
        let colP = parseInt(e[column], 10)
        if (colP === codeP) {
          return true
        }
      }
    }
    let catData = []
    for (let dev of systemBundle.devices) {
      catHolder[dev] = []
      // extract the column query name
      if (systemBundle.apiInfo[dev].categorycodes.length !== 0) {
        let catColumnQueryName = this.extractColumnName(systemBundle.apiInfo[dev].categorycodes)
        // console.log('yes, categories required')
        // is it for primary or derive data types?
        for (let dti of systemBundle.apiInfo[dev].apiquery) {
          for (let ts of systemBundle.timeseg) {
            catData = rawData[dev][dti.cnrl]['day'].filter(n => excludeCodes(n, systemBundle.apiInfo[dev].categorycodes, catColumnQueryName))
            let catTempHold = {}
            catTempHold[ts] = catData
            catHolder[dev][dti.cnrl] = catTempHold
          }
        }
      } else {
        // console.log('no categorisation required')
        catHolder = rawData
      }
    }
  }
  return catHolder
}

/**
* give back name of cat code name
* @method extractColumnName
*
*/
CategoryDataSystem.prototype.extractColumnName = function (cCodes) {
  let columnName = ''
  columnName = this.liveCNRL.lookupContract(cCodes[0].column)
  return columnName.prime.text
}

export default CategoryDataSystem

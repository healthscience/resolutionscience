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
import TestStorageAPI from './dataprotocols/teststorage/testStorage.js'
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
CategoryDataSystem.prototype.categorySorter = function (dataASK, rawData) {
  console.log('category sorter start')
  console.log(dataASK)
  // console.log(rawData)
  let catHolder = {}
  // is it source or derive categorisation?
  if (dataASK.primary === 'derived') {
    // no cat require return data unchanged
    // console.log('no categorisation required')
    catHolder = rawData
  } else {
    let startTime = dataASK.startperiod
    catHolder[startTime] = {}
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
    for (let dev of dataASK.deviceList) {
      catHolder[startTime][dev] = []
      // extract the column query name
      if (dataASK.apiInfo[dev].categorycodes.length !== 0) {
        let catColumnQueryName = this.extractColumnName(dataASK.apiInfo[dev].categorycodes)
        // console.log('yes, categories required')
        // is it for primary or derive data types?
        for (let dti of dataASK.apiInfo[dev].apiquery) {
          for (let ts of dataASK.timeseg) {
            catData = rawData[startTime][dev][dti.cnrl][ts].filter(n => excludeCodes(n, dataASK.apiInfo[dev].categorycodes, catColumnQueryName))
            let catTempHold = {}
            catTempHold[ts] = catData
            catHolder[startTime][dev][dti.cnrl] = catTempHold
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

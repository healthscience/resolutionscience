'use strict'
/**
*  Knowledge Bundle Ledger
*
*
* @class KBLedger
* @package    KBLedger
* @copyright  Copyright (c) 2019 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
import DataSystem from '../systems/data/dataSystem.js'
const util = require('util')
const events = require('events')

var KBLedger = function (setIN) {
  console.log('KBL start')
  console.log(setIN)
  events.EventEmitter.call(this)
  this.liveDataSystem = new DataSystem(setIN)
}

/**
* inherits core emitter class within this class
* @method inherits
*/
util.inherits(KBLedger, events.EventEmitter)

/**
*  initialise forming of KBL
* @method genesisKBL
*
*/
KBLedger.prototype.genesisKBL = function () {
  let newLedger = 'new'
  return newLedger
}

/**
*  list of Experiment Live in Ledger
* @method liveNetworkExperimentLedger
*
*/
KBLedger.prototype.liveNetworkExperimentLedger = function () {
  console.log('get experiments live in Ledger')
  let liveExperList = ['cnrl-848388553323', 'cnrl-888355992223', 'cnrl-888355992224', 'cnrl-888388992224', 'cnrl-888388232224', 'cnrl-888388233324', 'cnrl-888388443324']
  // await this.liveDataSystem.getExpKbundles()
  return liveExperList
}

/**
*  last Knowledge Bundles from Ledger
* @method latestKBs
*
*/
KBLedger.prototype.latestKBs = async function () {
  console.log('latestKBs')
  let lastestKBs = await this.liveDataSystem.getExpKbundles()
  return lastestKBs
}

/**
*  extract Computations
* @method extractComputations
*
*/
KBLedger.prototype.extractComputations = function () {
  console.log('extractComputations')
  let livecomputeList = ['cnrl-2356388731', 'cnrl-2356388737', 'cnrl-2356388732', 'cnrl-2356383848']
  return livecomputeList
}

export default KBLedger

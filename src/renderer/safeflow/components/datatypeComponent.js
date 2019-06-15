'use strict'
/**
*  DatatypeComponent  heart of the data
*
*
* @class dataHolder
* @package    HealthScience.network
* @copyright  Copyright (c) 2018 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
import DTsystem from '../systems/dtSystem.js'
const util = require('util')
const events = require('events')

var DatatypeComponent = function (DID, setIN) {
  events.EventEmitter.call(this)
  this.did = DID
  this.liveDTsystem = new DTsystem(setIN)
  this.datatypeLive = []
}

/**
* inherits core emitter class within this class
* @method inherits
*/
util.inherits(DatatypeComponent, events.EventEmitter)

/**
*  the Type of data
* @method dataType
*
*/
DatatypeComponent.prototype.dataTypeMapping = function () {
  // query CNRL for hash and parse out datatype and packaging info.
  // return list of Datatypes - cnrl-IDs  primary and source ie Datatypes require to compute results
  let dataTypeMapped = this.liveDTsystem.DTStartFilter(this.did.storageAPI, this.did.cid)
  this.datatypeLive.push(dataTypeMapped)
}

export default DatatypeComponent

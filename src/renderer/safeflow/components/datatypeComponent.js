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
const util = require('util')
const events = require('events')
// const axios = require('axios')
// const moment = require('moment')

var DatatypeComponent = function () {
  events.EventEmitter.call(this)
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
DatatypeComponent.prototype.dataType = function () {
  // query CNRL for hash and parse out datatype and packaging info.
}

/**
*  Active time period
* @method dataTime
*
*/
DatatypeComponent.prototype.dataTime = function (date) {
}

export default DatatypeComponent

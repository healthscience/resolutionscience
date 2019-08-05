'use strict'
/**
*  tableSystem
*
*
* @class TableSystem
* @package    safeFlow
* @copyright  Copyright (c) 2019 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
const util = require('util')
const events = require('events')

var TableSystem = function () {
  events.EventEmitter.call(this)
}

/**
* inherits core emitter class within this class
* @method inherits
*/
util.inherits(TableSystem, events.EventEmitter)

/**
* return the data structure requested
* @method structureData
*
*/
TableSystem.prototype.structureChartData = function () {
}

export default TableSystem

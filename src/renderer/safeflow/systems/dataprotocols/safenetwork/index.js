'use strict'
/**
*  SAFEnetwork manager
*
*
* @class SAFEmaster
* @package    safe API
* @copyright  Copyright (c) 2019 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
const util = require('util')
const events = require('events')

var SAFEmaster = function () {
  events.EventEmitter.call(this)
}

/**
* inherits core emitter class within this class
* @method inherits
*/
util.inherits(SAFEmaster, events.EventEmitter)

/**
*  fetch data from Content address
* @method safeGetData
*
*/
SAFEmaster.prototype.safeGetData = function (addressIN) {
}

export default SAFEmaster

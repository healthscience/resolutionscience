'use strict'
/**
*  ComputeComponent
*
*
* @class ComputeComponent
* @package    safeFlow
* @copyright  Copyright (c) 2019 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
import ComputeSystem from '../systems/computeSystem.js'
const util = require('util')
const events = require('events')

var ComputeComponent = function () {
  events.EventEmitter.call(this)
  this.liveCompute = new ComputeSystem()
}

/**
* inherits core emitter class within this class
* @method inherits
*/
util.inherits(ComputeComponent, events.EventEmitter)

/**
*
* @method filterCompute
*
*/
ComputeComponent.prototype.filterCompute = async function () {
  return 'none'
}

/**
*
* @method startCompute
*
*/
ComputeComponent.prototype.startCompute = async function () {
}

export default ComputeComponent

'use strict'
/**
*  VisualComponent
*
*
* @class ComputeComponent
* @package    safeFlow
* @copyright  Copyright (c) 2019 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
import VisSystem from '../systems/visSystem.js'
const util = require('util')
const events = require('events')

var VisualComponent = function (EID) {
  events.EventEmitter.call(this)
  this.EIDinfo = EID
  this.liveVisSystem = new VisSystem()
  this.visLive = ''
  this.visualData = {}
  this.setVisLive()
}

/**
* inherits core emitter class within this class
* @method inherits
*/
util.inherits(VisualComponent, events.EventEmitter)

/**
*
* @method setVisLive
*
*/
VisualComponent.prototype.setVisLive = function () {
  // console.log('set visualisation styles')
  // console.log(this.EIDinfo)
  this.visAsked = this.EIDinfo.vis
}

/**
*
* @method filterVisual
*
*/
VisualComponent.prototype.filterVisual = function (visIN, vData) {
  // which of three types of visualisations?
  let status = false
  console.log('VISCOMP--start')
  console.log(visIN)
  console.log(vData)
  if (visIN.vid === 'vis-sc-1') {
    console.log('charts asked for')
    this.visualData = this.liveVisSystem.chartSystem(visIN, vData)
    console.log(this.visualData)
  } else if (visIN.vid === 'vis-sc-2') {
    console.log('table asked for')
    this.visualData = this.liveVisSystem.tableSystem(visIN, vData)
    status = true
  } else if (visIN.vid === 'vis-sc-3') {
    status = true
    console.log('simulation asked for')
    // this.visualData = this.liveVisSystem.simSystem()
  }
  return status
}

export default VisualComponent

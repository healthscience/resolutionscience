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
import VisSystem from '../systems/visual/visSystem.js'
const util = require('util')
const events = require('events')

var VisualComponent = function (EID) {
  events.EventEmitter.call(this)
  this.EIDinfo = EID
  this.liveVisSystem = new VisSystem()
  this.visLive = ''
  this.visualData = {}
  // this.setVisLive()
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
VisualComponent.prototype.setVisLive = function (updateEID) {
  this.EIDinfo.time.startperiod = updateEID
}

/**
*
* @method filterVisual
*
*/
VisualComponent.prototype.filterVisual = function (visIN, vData) {
  // console.log('filter vis')
  // console.log(visIN)
  // console.log(vData)
  // which of three types of visualisations?
  let status = false
  // todo need to check if one or many visualisation types required? ONe for now
  if (this.EIDinfo.visID[0] === 'vis-sc-1') {
    // console.log('charts asked for')
    this.visualData = this.liveVisSystem.visSystem(this.EIDinfo, visIN, vData)
    status = true
  } else if (visIN.vid === 'vis-sc-2') {
    // console.log('table asked for')
    this.visualData = this.liveVisSystem.tableSystem(visIN, vData)
    status = true
  } else if (visIN.vid === 'vis-sc-3') {
    status = true
    // console.log('simulation asked for')
    // this.visualData = this.liveVisSystem.simSystem()
  }
  return status
}

export default VisualComponent

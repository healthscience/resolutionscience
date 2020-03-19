'use strict'
/**
*  ScienceEntities
*
*
* @class ScienceEntities
* @package    safeFlow
* @copyright  Copyright (c) 2019 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
import DataComponent from './components/dataComponent.js'
import DatatypeComponent from './components/datatypeComponent.js'
import TimeComponent from './components/timeComponent.js'
import ComputeComponent from './components/computeComponent.js'
import VisualComponent from './components/visualComponent.js'
// import SimComponent from './components/simComponent.js'
const util = require('util')
const events = require('events')

var ScienceEntities = function (EID, dAccess) {
  events.EventEmitter.call(this)
  this.seid = EID
  this.liveTimeC = new TimeComponent(EID, dAccess)
  this.liveDatatypeC = new DatatypeComponent(EID, dAccess)
  this.liveDataC = new DataComponent(EID, dAccess)
  this.liveComputeC = new ComputeComponent(EID, dAccess)
  this.liveVisualC = new VisualComponent(EID)
  // this.liveSimC = new SimComponent()
}

/**
* inherits core emitter class within this class
* @method inherits
*/
util.inherits(ScienceEntities, events.EventEmitter)

/**
*
* @method rawdataGetter
*
*/
ScienceEntities.prototype.rawdataGetter = async function () {
  return this.liveDataC.dataRaw
}

/**
*
* @method datatypeGetter
*
*/
ScienceEntities.prototype.datatypeGetter = async function () {
  return this.liveDatatypeC.dataTypes
}

/**
*
* @method tidyDataGetter
*
*/
ScienceEntities.prototype.tidyDataGetter = async function () {
  return this.liveDataC.tidydata
}

/**
*
* @method visualGetter
*
*/
ScienceEntities.prototype.visualGetter = async function () {
  return this.liveVisualC.list
}

export default ScienceEntities

'use strict'
/**
*  SAFEflow  heart of the data
*
*
* @class safeFlow
* @package    LKN health
* @copyright  Copyright (c) 2018 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
const util = require('util')
const events = require('events')
const axios = require('axios')
const moment = require('moment')

var safeFlow = function () {
  console.log('SAFEflow live')
  events.EventEmitter.call(this)
  this.datacollection = []
}

/**
* inherits core emitter class within this class
* @method inherits
*/
util.inherits(safeFlow, events.EventEmitter)

/**
*  get base time from LKN
* @method LKNtime
*
*/
safeFlow.prototype.LKNtime = function () {
  this.baseNow = new Date()
}

/**
*  Accept data In  GRPC call verifed
* @method dataIn
*
*/
safeFlow.prototype.dataIn = function (timeCode) {
  console.log('in code' + timeCode)
  var datacollection = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [
      {
        label: 'Data One',
        backgroundColor: '#f87979',
        data: [getRandomInt(), getRandomInt(), getRandomInt(), getRandomInt(), getRandomInt(), getRandomInt(), getRandomInt(), getRandomInt(), getRandomInt(), getRandomInt(), getRandomInt(), getRandomInt()]
      }
    ]
  }
  function getRandomInt () {
    return Math.floor(Math.random() * (50 - 5 + 1)) + 5
  }
  return datacollection
}

/**
*  Mock data return
* @method dataOut
*
*/
safeFlow.prototype.dataOut = function () {
}

/**
*  Get Data via Axios
* @method getData
*
*/
safeFlow.prototype.getData = function (seg, callback) {
  var dataholder = {}
  var dataheart = []
  var datalabel = []
  axios.get('http://165.227.244.213:8881/heartdata//pubkey/token' + seg)
    .then((resp) => {
      resp.data.forEach(function (couple) {
        var mString = moment(couple.timestamp * 1000).format('MM-DD-YYYY')
        datalabel.push(mString)
        dataheart.push(3)
      })
      dataholder.labels = datalabel
      dataholder.datasets = dataheart
      console.log(dataholder)
      callback(dataholder)
    })
    .catch((err) => {
      console.log(err)
    })
}

module.exports = safeFlow

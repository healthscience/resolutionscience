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
import ChartSystem from '../systems/chartSystem.js'
const util = require('util')
const events = require('events')
const moment = require('moment')

var VisualComponent = function () {
  events.EventEmitter.call(this)
  this.liveChartSystem = new ChartSystem()
}

/**
* inherits core emitter class within this class
* @method inherits
*/
util.inherits(VisualComponent, events.EventEmitter)

/**
*
* @method filterVisual
*
*/
VisualComponent.prototype.filterVisual = async function (visIN, visData) {
  // build array of visualation modules and match to one asked for
  return 'visual complete'
  // this.structureChartData()
}

/**
* return the data structure requested
* @method structureData
*
*/
VisualComponent.prototype.structureChartData = function (structureAsked, dataMTypes, dataIn, colorL) {
  let dataholder = {}
  let datalabel = []
  let dataheart = []
  if (structureAsked === 'chartjs') {
    // loop through and build two sperate arrays
    dataIn.forEach(function (couple) {
      datalabel.push(couple[dataMTypes[0]])
      dataheart.push(couple[dataMTypes[1]])
    })
    dataholder.labels = datalabel
    dataholder.datasets = dataheart
    if (colorL === 'heartchain/heart/activity/steps') {
      dataholder.backgroundColor = '#203487'
      dataholder.borderColor = '#050d2d'
    } else if (colorL === 'heartchain/heart/bpm') {
      dataholder.backgroundColor = '#ed7d7d'
      dataholder.borderColor = '#ea1212'
    }
  }
  return dataholder
}

/**
* prepare DataCollection for vuechart.js
* @method prepareVueChartJS
*
*/
VisualComponent.prototype.prepareVueChartJS = function (structureAsked, dataMTypes, dataIn, colorL) {
  var localthis = this
  if (results.length === 2) {
    // need to prepare different visualisations, data return will fit only one select option
    for (let res of results) {
      if (res.senItem === 'heartchain/heart/bpm') {
        localthis.labelback = res.vueData.labels
        localthis.heartback = res.vueData.datasets
        localthis.colorback = res.vueData.backgroundColor
        localthis.colorlineback = res.vueData.borderColor
      } else if (res.senItem === 'heartchain/heart/activity/steps') {
        localthis.activityback = res.vueData.datasets
        localthis.colorback2 = res.vueData.backgroundColor
        localthis.colorlineback2 = res.vueData.borderColor
      }
    }
  } else {
    if (results[0].senItem === 'heartchain/heart/bpm') {
      localthis.activityback = []
      localthis.labelback = results[0].vueData.labels
      localthis.heartback = results[0].vueData.datasets
      localthis.colorback = results[0].vueData.backgroundColor
      localthis.colorlineback = results[0].vueData.borderColor
    } else if (results[0].senItem === 'heartchain/heart/activity/steps') {
      localthis.heartback = []
      localthis.labelback = results[0].vueData.labels
      localthis.activityback = results[0].vueData.datasets
      localthis.colorback2 = results[0].vueData.backgroundColor
      localthis.colorlineback2 = results[0].vueData.borderColor
    }
  }
  if (dataH === 'no data') {
    // no data to display
    localthis.chartmessage = 'No data to display'
    localthis.datacollection = {
      labels: localthis.labelback,
      datasets: [
        {
          type: 'line',
          label: 'Beats per Minute',
          borderColor: '#ed7d7d',
          backgroundColor: '#ed7d7d',
          fill: false,
          data: localthis.heartback,
          yAxisID: 'bpm'
        }, {
          type: 'bar',
          label: 'Activity Steps',
          // borderColor: '#ea1212',
          // borderWidth: .5,
          // backgroundColor: '#ea1212',
          fill: false,
          data: localthis.activityback,
          yAxisID: 'steps'
        }
      ]
    }
  } else {
    // console.log('draw chart')
    localthis.getAverages(70)
    var startChartDate = moment(localthis.labelback[0])
    localthis.liveTime = startChartDate
    localthis.updateChartoptions(startChartDate)
    localthis.chartmessage = 'BPM'
    localthis.datacollection = {
      labels: localthis.labelback,
      datasets: [
        {
          type: 'line',
          label: 'Beats per minute',
          borderColor: '#ea1212',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: true,
          data: localthis.heartback,
          yAxisID: 'bpm'
        }, {
          type: 'bar',
          label: 'Activity - Steps',
          lineThickness: 0.2,
          borderColor: '#020b2d',
          backgroundColor: '#050d2d',
          fill: false,
          data: localthis.activityback,
          yAxisID: 'steps'
        }
      ]
    }
  }
}

/**
* return the data Statistics structure requested
* @method structureStatisticsData
*
*/
VisualComponent.prototype.structureStatisticsData = function (structureAsked, dataTypes, dataIn) {
  let dataholder = {}
  let datalabel = []
  let dataheart = []
  if (structureAsked === 'chartjs') {
    // loop through and build two sperate arrays
    dataIn.forEach(function (couple) {
      let mString = moment(couple.timestamp * 1000).toDate() // .format('YYYY-MM-DD hh:mm')
      datalabel.push(mString)
      dataheart.push(couple.average)
    })
    dataholder.labels = datalabel
    dataholder.datasets = dataheart
    dataholder.backgroundColor = '#ed7d7d'
  }
  return dataholder
}

/**
* prepare DataCollection for vuechart.js
* @method prepareStatsVueChartJS
*
*/
VisualComponent.prototype.prepareStatsVueChartJS = function (structureAsked, dataMTypes, dataIn, colorL) {
  // need to prepare different visualisations, data return will fit only one select option
  var localthis = this
  localthis.labelback = results[0].labels
  localthis.heartback = results[0].datasets
  localthis.colorback = results[0].backgroundColor
  localthis.colorlineback = results[0].borderColor
  localthis.activityback = results[1].datasets
  if (dataH === 'no data') {
    // no data to display
    localthis.chartmessage = 'No data to display'
    localthis.datastatistics = {
      labels: localthis.labelback,
      datasets: [
        {
          label: 'Beats per Minute',
          borderColor: '#ed7d7d',
          backgroundColor: '#ed7d7d',
          fill: false,
          data: localthis.heartback,
          yAxisID: 'bpm'
        }, {
          label: 'Activity Steps',
          borderColor: '#ea1212',
          backgroundColor: '#ea1212',
          fill: false,
          data: localthis.activityback,
          yAxisID: 'steps'
        }
      ]
    }
  } else {
    localthis.chartmessage = 'BPM'
    localthis.datastatistics = {
      labels: localthis.labelback,
      datasets: [
        {
          label: 'Device 1',
          borderColor: '#ea1212',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: true,
          data: localthis.heartback,
          yAxisID: 'bpm'
        }, {
          label: 'Device 2',
          borderColor: '#050d2d',
          backgroundColor: '#050d2d',
          fill: false,
          data: localthis.activityback,
          yAxisID: 'steps'
        }
      ]
    }
    // console.log(localthis.datastatistics)
  }
}

export default VisualComponent

'use strict'
/**
*  ChartSystem
*
*
* @class ChartSystem
* @package    safeFlow
* @copyright  Copyright (c) 2019 James Littlejohn
* @license    http://www.gnu.org/licenses/old-licenses/gpl-3.0.html
* @version    $Id$
*/
const util = require('util')
const events = require('events')
const moment = require('moment')

var ChartSystem = function () {
  events.EventEmitter.call(this)
}

/**
* inherits core emitter class within this class
* @method inherits
*/
util.inherits(ChartSystem, events.EventEmitter)

/**
* return the data structure requested
* @method structureData
*
*/
ChartSystem.prototype.structureChartData = async function (chartDataIN) {
  console.log('CHARTSYSTEM---reStructure data for vue. ')
  console.log(chartDataIN)
  var localthis = this
  let dataholder = {}
  let datalabel = []
  let dataheart = []
  let dataMTypes = [1, 2]
  let colorL = ''
  this.chartPrep = {}
  // loop through and build two sperate arrays
  chartDataIN.forEach(function (couple) {
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
  // return 'structureREADY'
  await this.prepareVueChartJS(dataholder).then(function (chartReady) {
    localthis.chartPrep = chartReady
  })
  return this.chartPrep
}

/**
* prepare DataCollection for vuechart.js
* @method prepareVueChartJS
*
*/
ChartSystem.prototype.prepareVueChartJS = async function (results) {
  console.log('CHARTSYSTEM----VUEchart start prepare')
  console.log(results)
  this.datacollection = {}
  this.labelback = ''
  this.heartback = ''
  this.colorback = ''
  this.colorlineback = ''
  this.colorback2 = ''
  this.colorlineback2 = ''
  this.activityback = ''
  if (results.length === 2) {
    // need to prepare different visualisations, data return will fit only one Chart vis option
    for (let res of results) {
      if (res.senItem === 'heartchain/heart/bpm') {
        this.labelback = res.vueData.labels
        this.heartback = res.vueData.datasets
        this.colorback = res.vueData.backgroundColor
        this.colorlineback = res.vueData.borderColor
      } else if (res.senItem === 'heartchain/heart/activity/steps') {
        this.activityback = res.vueData.datasets
        this.colorback2 = res.vueData.backgroundColor
        this.colorlineback2 = res.vueData.borderColor
      }
    }
  } else {
    if (results[0] === 'heartchain/heart/bpm') {
      this.activityback = []
      this.labelback = results[0].vueData.labels
      this.heartback = results[0].vueData.datasets
      this.colorback = results[0].vueData.backgroundColor
      this.colorlineback = results[0].vueData.borderColor
    } else if (results[0] === 'heartchain/heart/activity/steps') {
      this.heartback = []
      this.labelback = results[0].vueData.labels
      this.activityback = results[0].vueData.datasets
      this.colorback2 = results[0].vueData.backgroundColor
      this.colorlineback2 = results[0].vueData.borderColor
    }
  }
  if (results === 'no data') {
    // no data to display
    this.chartmessage = 'No data to display'
    this.datacollection = {
      labels: this.labelback,
      datasets: [
        {
          type: 'line',
          label: 'Beats per Minute',
          borderColor: '#ed7d7d',
          backgroundColor: '#ed7d7d',
          fill: false,
          data: this.heartback,
          yAxisID: 'bpm'
        }, {
          type: 'bar',
          label: 'Activity Steps',
          // borderColor: '#ea1212',
          // borderWidth: .5,
          // backgroundColor: '#ea1212',
          fill: false,
          data: this.activityback,
          yAxisID: 'steps'
        }
      ]
    }
  } else {
    // console.log('draw chart')
    // getAverages(70)
    var startChartDate = moment(this.labelback[0])
    this.liveTime = startChartDate
    // updateChartoptions(startChartDate)
    // this.chartmessage = 'BPM'
    this.datacollection = {
      labels: this.labelback,
      datasets: [
        {
          type: 'line',
          label: 'Beats per minute',
          borderColor: '#ea1212',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: true,
          data: this.heartback,
          yAxisID: 'bpm'
        }, {
          type: 'bar',
          label: 'Activity - Steps',
          lineThickness: 0.2,
          borderColor: '#020b2d',
          backgroundColor: '#050d2d',
          fill: false,
          data: this.activityback,
          yAxisID: 'steps'
        }
      ]
    }
  }
  console.log('CHARTSYSTEM----RETURN chart system')
  console.log(this.datacollection)
  return this.datacollection
}

/**
* return the data Statistics structure requested
* @method structureStatisticsData
*
*/
ChartSystem.prototype.structureStatisticsData = function (structureAsked, dataTypes, dataIn) {
  /* let dataholder = {}
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
  return dataholder */
}

/**
* prepare DataCollection for vuechart.js
* @method prepareStatsVueChartJS
*
*/
ChartSystem.prototype.prepareStatsVueChartJS = function (structureAsked, dataMTypes, dataIn, colorL) {
  // need to prepare different visualisations, data return will fit only one select option
  /* var localthis = this
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
  } */
}

export default ChartSystem

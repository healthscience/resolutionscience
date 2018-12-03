<template>
  <section class="container">
    <h1>Heart</h1>
    <div class="columns">
      <div id="heart-chart" class="column">
        <h1>Select Device/Sensor Data: </h1>
        <ul>
          <li>
            <header>Device - </header>
              <ul>
                <li v-for="dev in devices">
		              <a href="" id="" @click.prevent="selectContext(dev)" v-bind:class="{ 'active': dev.active}">{{ dev.device_name }}</a>
                </li>
              </ul>
          </li>
          <li>
            <header> Sensors - </header>
              <ul>
                <li id="bmp-data-sensor" v-for="sen in sensors">
		              <a class="" href="" id="bmp-data" @click.prevent="selectContext(sen)" v-bind:class="{ 'active': sen.active}">{{ sen.device_sensorid }}</a>
                </li>
              </ul>
          </li>
          <li>
            <header> Science Computations - </header>
              <ul>
                <li id="science-compute"><a class="" href="" id="" @click.prevent="selectContext(compute1)" v-bind:class="{ 'active': compute1.active}">{{ compute1.name }}</a></li>
                <li id="science-compute"><a class="" href="" id="" @click.prevent="selectContext(compute2)" v-bind:class="{ 'active': compute2.active}">{{ compute2.name }}</a></li>
                <li id="science-compute"><a class="" href="" id="" @click.prevent="selectContext(compute3)" v-bind:class="{ 'active': compute3.active}">{{ compute3.name }}</a></li>
                <li id="science-compute"><a class="" href="" id="" @click.prevent="selectContext(compute4)" v-bind:class="{ 'active': compute4.active}">{{ compute4.name }}</a></li>
              </ul>
          </li>
          <li>
            <header> Visualisation - </header>
              <ul>
                <li id="visualisation-type"><a class="" href="" id="" @click.prevent="selectContext(vis1)" v-bind:class="{ 'active': vis1.active}">{{ vis1.name }}</a></li>
                <li id="visualisation-type"><a class="" href="" id="" @click.prevent="selectContext(vis2)" v-bind:class="{ 'active': vis2.active}">{{ vis2.name }}</a></li>
              </ul>
          </li>
          <li>
            <ul>
              <li id="lear-type"><a class="" href="" id="" @click.prevent="filterLearn(learn)" v-bind:class="{ 'active': learn.active}">{{ learn.name }}</a></li>
            </ul>
          </li>
        </ul>
        <h3>CHARTING - </h3>
        <div id="chart-message">{{ chartmessage }}</div>

        <reactive :chart-data="datacollection" :options="options" :width="1200" :height="600"></reactive>

        <button class="button is-primary" @click="fillData(0)">One day</button>
        <button class="button is-primary" @click="fillData(-1)">back day</button>
        <button class="button is-primary" @click="fillData(-2)">forward day</button>
        <button class="button is-primary" @click="fillData(1)">One month</button>
        <button class="button is-primary" @click="fillData(2)">Two months</button>
        <button class="button is-primary" @click="fillData(3)">Three months</button>
        <button class="button is-primary" @click="fillData(6)">6 months</button>
        <button class="button is-primary" @click="fillData(12)">One Year</button>

        <h3>Science Statistics - Live updates</h3>
        <div id="chart-message">{{ chartmessageS }}</div>

        <reactivestats :chart-data="datastatistics" :width="1200" :height="600"></reactivestats>

        <button class="button is-primary" @click="fillStats(0)">Year to date</button>
        <button class="button is-primary" @click="fillStats(1)">One month</button>
        <button class="button is-primary" @click="fillStats(2)">Two months</button>
        <button class="button is-primary" @click="fillStats(3)">Three months</button>
        <button class="button is-primary" @click="fillStats(6)">6 months</button>
        <button class="button is-primary" @click="fillStats(12)">One Year</button>
      </div>
    </div>
  </section>
</template>

<script>
  import LineChart from '@/components/charts/LineChart'
  import BarChart from '@/components/charts/BarChart'
  import BubbleChart from '@/components/charts/BubbleChart'
  import Reactive from '@/components/charts/Reactive'
  import Reactivestats from '@/components/charts/Reactivestats'
  import SAFEflow from '../../safeflow/safeFlow.js'
  const moment = require('moment')

  function newDate () {
    const nowTime = moment()
    const startTime = moment.utc(nowTime).startOf('day')
    const time = moment.duration('1:0:00')
    startTime.add(time)
    return startTime
  }

  function newDateEnd () {
    const nowTime2 = moment()
    const startTime2 = moment.utc(nowTime2).startOf('day')
    const time2 = moment.duration('4:0:00')
    startTime2.add(time2)
    return startTime2
  }

  export default {
    name: 'VueChartJS',
    components: {
      LineChart,
      BarChart,
      BubbleChart,
      Reactive,
      Reactivestats
    },
    data () {
      return {
        liveFlow: new SAFEflow(),
        datacollection: null,
        datastatistics: null,
        options: {},
        labelback: [],
        heartback: [],
        colorback: '',
        colorlineback: '',
        devices: [],
        sensors: [],
        analysisStart: 0,
        analysisEnd: 0,
        compute1:
        {
          name: 'recorded data',
          id: 'wasm-sc-1',
          active: true
        },
        compute2:
        {
          name: 'Average',
          id: 'wasm-sc-2',
          active: false
        },
        compute3:
        {
          name: 'error data',
          id: 'wasm-sc-3',
          active: false
        },
        compute4:
        {
          name: 'correlations',
          id: 'wasm-sc-4',
          active: false
        },
        vis1:
        {
          name: 'chart',
          id: 'vis-sc-1',
          active: true
        },
        vis2:
        {
          name: 'table',
          id: 'vis-sc-2',
          active: false
        },
        learn:
        {
          name: 'learn',
          id: 'learn-status',
          active: false
        },
        chartmessage: 'Chart Loading',
        chartmessageS: 'Statistics Chart Loading',
        activedevice: [],
        activesensor: [],
        activecompute: '',
        activeupdatecompute: '',
        activevis: '',
        activelearn: '',
        computeFlag: ''
      }
    },
    created () {
      this.dataContext()
      this.chartOptionsSet()
    },
    methods: {
      dataContext () {
        // make call to set start dataContext for this pubkey
        var localthis = this
        function callbackC (dataH) {
          localthis.devices = dataH
          localthis.dataType()
        }
        this.computeFlag = 'context'
        this.liveFlow.systemContext(this.computeFlag, callbackC)
      },
      dataType () {
        // make call to set start dataType for the device sensors
        var localthis = this
        function callbackT (dataH) {
          localthis.sensors = dataH
          localthis.liveFlow.dataStart()
          // localthis.fillData(0)
          // localthis.fillStats(0)
        }
        this.computeFlag = 'datatype'
        this.liveFlow.systemContext(this.computeFlag, callbackT)
      },
      fillData (seg) {
        var localthis = this
        this.filterDeviceActive()
        this.filterSensorActive()
        this.filterScienceActive()
        this.filterVisActive()
        function callbackD (dataH) {
          let results = dataH
          // console.log('in vue')
          // console.log(results)
          // is there one or two datasets?
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
                  borderColor: '#ea1212',
                  backgroundColor: '#ea1212',
                  fill: true,
                  data: localthis.activityback,
                  yAxisID: 'steps'
                }
              ]
            }
          } else {
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
                  borderColor: '#020b2d',
                  backgroundColor: '#050d2d',
                  fill: false,
                  data: localthis.activityback,
                  yAxisID: 'steps'
                }
              ]
            }
            // console.log(localthis.datacollection)
          }
        }
        this.computeFlag = 'raw'
        // console.log(this.activesensor)
        // console.log(this.activedevice)
        this.liveFlow.systemCoordinate(seg, this.activedevice, this.activesensor, this.activecompute, this.activevis, this.computeFlag, callbackD)
      },
      fillStats (seg) {
        var localthis = this
        this.filterDeviceActive()
        this.filterSensorActive()
        this.filterScienceActive()
        this.filterVisActive()
        function callbackD (dataH) {
          let results = dataH
          // need to prepare different visualisations, data return will fit only one select option
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
        this.computeFlag = 'statistics'
        this.liveFlow.systemCoordinate(seg, this.activedevice, this.activesensor, this.activecompute, this.activevis, this.computeFlag, callbackD)
      },
      selectContext (s) {
        s.active = !s.active
      },
      filterDeviceActive () {
        this.activedevice = []
        for (let dact of this.devices) {
          if (dact.active === true) {
            this.activedevice.push(dact.device_mac)
          }
        }
      },
      filterSensorActive () {
        this.activesensor = []
        for (let sact of this.sensors) {
          if (sact.active === true) {
            this.activesensor.push(sact.compref)
          }
        }
      },
      filterScienceActive () {
        if (this.compute1.active === true) {
          this.activecompute = this.compute1.id
        } else if (this.compute2.active === true) {
          this.activecompute = this.compute2.id
        } else if (this.compute3.active === true) {
          this.activecompute = this.compute3.id
        } else if (this.compute4.active === true) {
          this.activecompute = this.compute4.id
        }
      },
      filterVisActive () {
        if (this.vis1.active === true) {
          this.activevis = this.vis1.id
        } else if (this.vis2.active === true) {
          this.activevis = this.vis2.id
        }
      },
      filterLearn (s) {
        console.log(s)
        s.active = !s.active
        if (s.active === true) {
          this.activelearn = this.learn.id
          console.log(this.activelearn)
          this.learnStartStop()
        }
      },
      learnStartStop () {
        console.log('called collect start analysis--')
        console.log(this.analysisStart + ' start')
        console.log(this.analysisEnd + ' end')
        // const startA = this.options.analysisStart
        // const endA = this.options.analysisEnd
        // pass to computations system
      },
      chartOptionsSet () {
        var localthis = this
        this.options = {
          responsive: true,
          tooltips: {
            mode: 'index',
            intersect: true
          },
          stacked: false,
          title: {
            display: true,
            text: 'Device Data Charting'
          },
          scales: {
            xAxes: [{
              display: true,
              type: 'time',
              time: {
                format: 'YYYY-MM-DD hh:mm',
                // round: 'day'
                tooltipFormat: 'll HH:mm'
              },
              position: 'bottom',
              ticks: {
                maxRotation: 75,
                reverse: true
              }
            }],
            yAxes: [{
              type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
              display: true,
              position: 'left',
              id: 'bpm',
              ticks: {
                beginAtZero: true
              },
              scaleLabel: {
                display: true,
                labelString: 'Beats Per Minute Heart Rate'
              }
            },
            {
              type: 'linear', // only linear but allow scale type registration. This allows extensions to exist solely for log scale for instance
              display: true,
              position: 'right',
              id: 'steps',
              // grid line settings
              gridLines: {
                drawOnChartArea: false // only want the grid lines for one axis to show up
              },
              ticks: {
                beginAtZero: true
              },
              scaleLabel: {
                display: true,
                labelString: 'Number of Steps'
              }
            }]
          },
          annotation: {
            events: ['click'],
            annotations: [{
              drawTime: 'afterDatasetsDraw',
              type: 'line',
              mode: 'horizontal',
              scaleID: 'bpm',
              value: 72,
              borderColor: 'cyan',
              borderWidth: 6,
              label: {
                enabled: true,
                content: 'average daily heart rate'
              },
              draggable: true,
              onClick: function (e) {
                console.log(e.type, this)
              }
            },
            {
              drawTime: 'afterDatasetsDraw',
              type: 'line',
              mode: 'horizontal',
              scaleID: 'bpm',
              value: 58,
              borderColor: 'pink',
              borderWidth: 6,
              label: {
                enabled: true,
                content: 'average resting heart rate'
              },
              draggable: true,
              onClick: function (e) {
                console.log(e.type, this)
              }
            },
            {
              id: 'time',
              scaleID: 'x-axis-0',
              type: 'line',
              mode: 'vertical',
              value: newDate(),
              borderColor: 'blue',
              borderWidth: 12,
              label: {
                enabled: true,
                content: 'start point'
              },
              draggable: true,
              onClick: function (e) {
                // console.log(e.type, this.options.value)
                localthis.analysisStart = this.options.value
                // console.log(this.analysisStart + 'any ting')
              },
              onDrag: function (event) {
                // console.log(event.subject.config.value)
                localthis.analysisStart = this.options.value
              }
            },
            {
              id: 'time2',
              scaleID: 'x-axis-0',
              type: 'line',
              mode: 'vertical',
              value: newDateEnd(),
              borderColor: 'red',
              borderWidth: 12,
              label: {
                enabled: true,
                content: 'end point'
              },
              draggable: true,
              onClick: function (et) {
                console.log(et.type, this)
                localthis.analysisEnd = this.options.value
                console.log(this.options.value)
              },
              onDrag: function (event) {
                // console.log(event.subject.config.value)
                localthis.analysisEnd = event.subject.config.value
              }
            }]
          }
        }
      }
    }
  }
</script>

<style scoped>
  ul {
    list-style-type: none;
    padding: 0;
  }

  li {
    display: inline-block;
    margin: 0 10px;
  }

  a {
    color: #42b983;
  }

  #heart-chart {
    width: 1200px;
  }

  .active{
    background-color:#8ec16d;
    color: white;
  }
</style>

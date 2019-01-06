<template>
  <section class="container">
    <h1>Heart - select Device/Sensor Data: </h1>
    <div class="columns">
      <div id="heart-chart" class="column">
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
            <header> Visualisation - </header>
              <ul>
                <li id="visualisation-type"><a class="" href="" id="" @click.prevent="selectContext(vis1)" v-bind:class="{ 'active': vis1.active}">{{ vis1.name }}</a></li>
                <!-- <li id="visualisation-type"><a class="" href="" id="" @click.prevent="selectContext(vis2)" v-bind:class="{ 'active': vis2.active}">{{ vis2.name }}</a></li> -->
              </ul>
          </li>
          <li>
            <header> Science Computations - </header>
              <ul>
                <li >
                  <select v-model="selected">
                  <option class="science-compute" v-for="scoption in scoptions" v-bind:value="scoption.value">
                    {{ scoption.text }}
                  </option>
                </select>
                <!--<span>Selected: {{ selected }}</span>-->
                </li>
              </ul>
          </li>
          <li>
            <div id="learn-type">
              <button class="" href="" id="learn-button" @click.prevent="filterLearn(learn)" v-bind:class="{ 'active': learn.active}">{{ learn.name }}</button>
            </div>
          </li>
        </ul>
        <Learn-Report :reportData="reportData" ></Learn-Report>
          <div v-if="averageSeen" id="average-charting">
          <h3></h3>
          <div>
            <div id="chart-message">{{ chartmessageS }}</div>
            <div id="close-average">
              <button id="close-report" @click.prevent="closeAvgSummary()">Finsish & Close</button>
            </div>
          </div>

          <reactivestats :chart-data="datastatistics" :width="1200" :height="600"></reactivestats>
          <!-- <button class="button is-primary" @click="fillStats(0)">Year to date</button>
          <button class="button is-primary" @click="fillStats(1)">One month</button>
          <button class="button is-primary" @click="fillStats(2)">Two months</button>
          <button class="button is-primary" @click="fillStats(3)">Three months</button>
          <button class="button is-primary" @click="fillStats(6)">6 months</button>
          <button class="button is-primary" @click="fillStats(12)">One Year</button> -->
        </div>

        <div id="chart-message">{{ chartmessage }}</div>
        <reactive :chartData="datacollection" :options="options" :width="1200" :height="600"></reactive>

        <button class="button is-primary" @click="setContextData(0)">Today</button>
        <button class="button is-primary" @click="setContextData(-1)">back day</button>
        <button class="button is-primary" @click="setContextData(-2)">forward day</button>
        <button class="button is-primary" @click="setContextData(1)">One month</button>
        <!-- <button class="button is-primary" @click="fillData(2)">Two months</button>
        <button class="button is-primary" @click="fillData(3)">Three months</button>
        <button class="button is-primary" @click="fillData(6)">6 months</button> -->
        <button class="button is-primary" @click="setContextData(12)">One Year</button>
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
  import LearnReport from '@/components/reports/learn-report.vue'
  import SAFEflow from '../../safeflow/safeFlow.js'
  const moment = require('moment')

  export default {
    name: 'VueChartJS',
    components: {
      LineChart,
      BarChart,
      BubbleChart,
      Reactive,
      Reactivestats,
      LearnReport
    },
    data () {
      return {
        liveFlow: null,
        datacollection: null,
        datastatistics: null,
        selected: 'A',
        scoptions: [
          { text: 'Activity and HR data', value: 'A', cid: 'wasm-sc-1' },
          { text: 'Average HR', value: 'B', cid: 'wasm-sc-2' },
          { text: 'Resting HR Recovery', value: 'C', cid: 'wasm-sc-3' },
          { text: 'error data', value: 'D', cid: 'wasm-sc-4' },
          { text: 'HealthSpan', value: 'E', cid: 'wasm-sc-5' }
        ],
        options: {},
        averageSeen: false,
        reportData: {},
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
        chartmessage: 'Select time to load chart',
        chartmessageS: 'Select time to load chart',
        activedevice: [],
        activesensor: [],
        activecompute: 'wasm-sc-1',
        activeupdatecompute: '',
        activevis: '',
        activelearn: '',
        computeFlag: ''
      }
    },
    computed: {
      system: function () {
        return this.$store.state.system
      },
      datacollection: function () {
        return {
          labels: [],
          datasets: []
        }
      }
    },
    mounted () {
    },
    created () {
      this.setAccess()
      this.dataContext()
      this.chartOptionsSet()
    },
    methods: {
      setAccess () {
        this.liveFlow = new SAFEflow(this.system)
      },
      dataContext () {
        // make call to set start dataContext for this pubkey
        var localthis = this
        function callbackC (dataH) {
          localthis.devices = dataH
          localthis.$store.commit('setContext', dataH)
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
          localthis.liveFlow.dataStart(localthis.devices)
        }
        this.computeFlag = 'datatype'
        this.liveFlow.systemContext(this.computeFlag, callbackT)
      },
      getAverages (max) {
        var newAHR = 72 // Math.floor(Math.random() * Math.floor(max))
        var newARHR = 55
        this.options.annotation.annotations[0].value = newAHR
        this.options.annotation.annotations[1].value = newARHR
      },
      setContextData (seg) {
        // get seg and then look at compute context and call appropriate
        const compContext = this.activecompute
        console.log('context set at')
        console.log(compContext)
        if (compContext === 'wasm-sc-1') {
          this.fillData(seg)
        } else if (compContext === 'wasm-sc-2') {
          this.fillStats(seg)
        }
      },
      fillData (seg) {
        var localthis = this
        this.filterDeviceActive()
        this.filterSensorActive()
        this.filterScienceActive()
        this.filterVisActive()

        function callbackD (dataH) {
          let results = dataH
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
        this.computeFlag = 'raw'
        this.liveFlow.systemCoordinate(seg, this.activedevice, this.activesensor, this.activecompute, this.activevis, this.computeFlag, callbackD)
      },
      fillStats (seg) {
        var localthis = this
        this.filterDeviceActive()
        this.filterSensorActive()
        // this.filterScienceActive()
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
        // console.log(s)
        s.active = !s.active
        if (s.active === true) {
          this.activelearn = this.learn.id
          // console.log(this.activelearn)
          this.learnStartStop()
        }
      },
      filterCompute (cs) {
        // console.log(cs)
        for (let csi of this.scoptions) {
          if (csi.value === cs) {
            this.activecompute = csi.cid
          }
        }
        return this.activecompute
      },
      learnStartStop () {
        // pass to computations system
        let computeSelected = this.selected
        console.log(computeSelected)
        console.log(this.analysisStart)
        console.log(this.analysisEnd)
        let computationSMid = this.filterCompute(computeSelected)
        console.log(computationSMid)
        if (computationSMid === 'wasm-sc-3') {
          let reportDataback = {}
          reportDataback.learnSummarySeen = true
          reportDataback.ridentity = 10987654321
          reportDataback.heartmax = 153
          reportDataback.heartmin = 52
          reportDataback.recovertime = 3.45
          reportDataback.similarcount = 325
          reportDataback.recoverchange = '+.02'
          this.reportData = reportDataback
          // console.log(this.reportData)
          this.learn.active = false
        } else if (computationSMid === 'wasm-sc-2') {
          this.averageSeen = true
        }
      },
      closeAvgSummary () {
        this.averageSeen = false
        this.learn.active = false
        this.activecompute = 'wasm-sc-1'
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
              barPercentage: 0.1,
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
                beginAtZero: true,
                steps: 10,
                stepValue: 5,
                max: 180
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
                // console.log(e.type, this)
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
                // console.log(e.type, this)
              }
            },
            {
              id: 'time',
              scaleID: 'x-axis-0',
              type: 'line',
              mode: 'vertical',
              value: 0,
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
                localthis.analysisStart = event.subject.config.value
              }
            },
            {
              id: 'time2',
              scaleID: 'x-axis-0',
              type: 'line',
              mode: 'vertical',
              value: 0,
              borderColor: '#7A33FF',
              borderWidth: 12,
              label: {
                enabled: true,
                content: 'end point'
              },
              draggable: true,
              onClick: function (et) {
                // console.log(et.type, this)
                localthis.analysisEnd = this.options.value
                // console.log(this.options.value)
              },
              onDrag: function (eventt) {
                // console.log(event.subject.config.value)
                localthis.analysisEnd = eventt.subject.config.value
              }
            }]
          }
        }
      },
      updateChartoptions (startChartDate) {
        this.newDate(startChartDate) // moment('12/21/2018', 'MM-DD-YYYY')
        this.newDateEnd(startChartDate) // moment('12/21/2018', 'MM-DD-YYYY')
      },
      newDate (selectDay) {
        var nowTime = ''
        if (selectDay === 0) {
          nowTime = moment()
        } else {
          nowTime = moment(selectDay)
          nowTime = nowTime.subtract(selectDay, 'days')
        }
        // console.log(nowTime)
        var startTime = moment.utc(nowTime).startOf('day')
        const time = moment.duration('2:0:00')
        startTime.add(time)
        // startTime = moment('12/21/2018', 'MM-DD-YYYY')
        this.options.annotation.annotations[2].value = startTime
        // this.$set(this.options.annotation.annotations[2], 'value', startTime)
        // console.log(this.options.annotation.annotations[2])
      },
      newDateEnd (endTimeIN) {
        var nowTime2 = moment(endTimeIN)
        var startTime2 = moment.utc(nowTime2).startOf('day')
        var time2 = moment.duration('4:0:00')
        startTime2.add(time2)
        this.options.annotation.annotations[3].value = startTime2
        // this.$set(this.options.annotation.annotations[3], 'value', startTime2)
        // console.log(startTime2)
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

  #heart-chart ul li {
    font-size: 1.1em;
  }

  .active{
    background-color:#8ec16d;
    color: white;
  }

#learn-button {
  font-size: 1.6em;
  padding: .25em;

}

.is-primary {
  font-size: 1.6em
}

#learn-type {
  float: right;
}

.is-primary {
  margin-left: 12px;
}

#close-average {
  float: right;
}

.science-compute {
  font-size: 1.6em;
}
</style>

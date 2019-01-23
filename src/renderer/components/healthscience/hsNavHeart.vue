<template>
  <section class="container">
    <h1>Human -> Body(movement - steps) + Heart</h1>
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
                <li id="visualisation-type"><a class="" href="" id="" @click.prevent="selectVis(vis1)" v-bind:class="{ 'active': vis1.active}">{{ vis1.name }}</a></li>
                <li id="visualisation-type"><a class="" href="" id="" @click.prevent="selectVis(vis2)" v-bind:class="{ 'active': vis2.active}">{{ vis2.name }}</a></li>
                <li id="visualisation-type"><a class="" href="" id="" @click.prevent="selectVis(vis3)" v-bind:class="{ 'active': vis3.active}">{{ vis3.name }}</a></li>
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
        <Statistics-Tools :statsData="statsData" ></Statistics-Tools>
        <Learn-Report :reportData="reportData" ></Learn-Report>

        <div v-if="visChartview" id="charts-live">
          <div v-if="averageSeen" id="average-charting">
            <h3></h3>
            <div>
              <div id="chart-message">{{ chartmessage }}</div>
              <div id="chart-message">{{ chartmessageS }}</div>
              <div id="close-average">
                <button id="close-report" @click.prevent="closeAvgSummary()">Finsish & Close</button>
              </div>
            </div>
            <reactivestats :chart-data="datastatistics" :width="1200" :height="600"></reactivestats>
          </div>
          <reactive :chartData="datacollection" :options="options" :width="1200" :height="600"></reactive>
        </div>
      <div v-if="visTableview" id="table-view">
        Table View
      </div>

      <div v-if="visSimview" id="sim-view">
        <simulation-View></simulation-View>
      </div>

      <div id="time-context">
        <div id="select-time">
          <button class="button is-primary" @click="setContextData(12)">- 1 Year</button>
          <button class="button is-primary" @click="setContextData(1)">- 1 month</button>
          <button class="button is-primary" @click="setContextData(-1)">Back day</button>
          <button class="button is-now" @click="setContextData(0)">Today</button>
          <button class="button is-future" @click="setContextData(-2)">Forward day</button>
          <button class="button is-future" @click="setContextData(1)">+ 1 month</button>
          <button class="button is-future" @click="setContextData(12)">+ 1 year</button>
        </div>
        <div id="view-time">
          {{ liveTime }}
          <div id="calendar-selector">
          </div>
        </div>
      </div>
      </div>
    </div>
  </section>
</template>

<script>
  import SAFEflow from '../../safeflow/safeFlow.js'
  import LineChart from '@/components/charts/LineChart'
  import BarChart from '@/components/charts/BarChart'
  import BubbleChart from '@/components/charts/BubbleChart'
  import Reactive from '@/components/charts/Reactive'
  import Reactivestats from '@/components/charts/Reactivestats'
  import LearnReport from '@/components/reports/learn-report.vue'
  import StatisticsTools from '@/components/reports/statisticstools.vue'
  import simulationView from '@/components/simulation/simulation-life.vue'
  const moment = require('moment')

  export default {
    name: 'VueChartJS',
    components: {
      LineChart,
      BarChart,
      BubbleChart,
      Reactive,
      Reactivestats,
      LearnReport,
      simulationView,
      StatisticsTools
    },
    data () {
      return {
        liveSafeFlow: null,
        liveTime: 0,
        datacollection: null,
        datastatistics: null,
        selected: 'A',
        scoptions: [
          { text: 'Activity and HR data', value: 'A', cid: 'wasm-sc-1' },
          { text: 'Average HR', value: 'B', cid: 'wasm-sc-2' },
          { text: 'Resting HR Recovery', value: 'C', cid: 'wasm-sc-3' },
          { text: 'error data', value: 'D', cid: 'wasm-sc-4' },
          { text: 'HealthSpan', value: 'E', cid: 'wasm-sc-5' },
          { text: 'Statistics Tools', value: 'F', cid: 'wasm-sc-6' }
        ],
        options: {},
        averageSeen: false,
        reportData: {},
        statsData: {},
        labelback: [],
        heartback: [],
        colorback: '',
        colorlineback: '',
        devices: [],
        sensors: [],
        analysisStart: 0,
        analysisEnd: 0,
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
        vis3:
        {
          name: 'simulation',
          id: 'vis-sc-3',
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
        computeFlag: '',
        visChartview: true,
        visTableview: false,
        visSimview: false
      }
    },
    computed: {
      safeFlow: function () {
        return this.$store.state.safeFlow
      },
      system: function () {
        return this.$store.state.system
      },
      context: function () {
        return this.$store.state.context
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
      this.setFirstEntity()
      this.chartOptionsSet()
    },
    methods: {
      setAccess () {
        this.liveSafeFlow = new SAFEflow(this.system)
      },
      setFirstEntity () {
        // gather first entity profile parts
        this.scienceContext()
        this.deviceContext()
        this.dataType()
      },
      scienceContext () {
        // set the first science priority on start of RS
        this.$store.commit('setScience', this.scoptions[0])
        // let startContext = this.$store.getters.liveContext
        // let startDataaccess = this.$store.getters.liveSystem
        // this.liveSafeFlow.scienceEntities(startContext, startDataaccess)
      },
      deviceContext () {
        var localthis = this
        function callbackC (dataH) {
          localthis.devices = dataH
          localthis.$store.commit('setDevice', dataH)
        }
        const deviceSet = localthis.$store.getters.liveContext.device
        // has the device context been set already?
        if (deviceSet.length > 1) {
          localthis.devices = deviceSet
        } else {
          // make call to set start dataContext for this pubkey
          const flag = 'device'
          this.liveSafeFlow.toolkitContext(flag, callbackC)
        }
      },
      dataType () {
        // make call to set start dataType for the device sensors
        var localthis = this
        function callbackT (dataH) {
          localthis.sensors = dataH
          localthis.$store.commit('setDatatype', dataH)
        }
        const datatypeSet = localthis.$store.getters.liveContext.datatype
        // has the device context been set already?
        if (datatypeSet.length > 1) {
          localthis.sensors = datatypeSet
        } else {
          const flag = 'datatype'
          this.liveSafeFlow.toolkitContext(flag, callbackT)
        }
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
        if (compContext === 'wasm-sc-1') {
          this.fillData(seg)
        } else if (compContext === 'wasm-sc-2') {
          this.fillStats(seg)
        }
      },
      async fillData (seg) {
        var localthis = this
        this.filterDeviceActive()
        this.filterSensorActive()
        this.filterVisActive()

        function callbackD (dataH) {
          console.log('VUE----CHARTVUE COMPONENT FINISHED')
          console.log(dataH)
          localthis.datacollection = dataH
        }
        await this.liveSafeFlow.scienceEntities(seg, this.context, callbackD).then(function (entityData) {
          console.log('VUE---wait from vue RETURNED')
          console.log(entityData)
          localthis.liveSafeFlow.entityGetter('wasm-sc-1').then(function (eData) {
            console.log('VUE---COMPLETED getter')
            callbackD(eData)
          })
        })
      },
      fillStats (seg) {
        this.filterDeviceActive()
        this.filterSensorActive()
        this.filterVisActive()
        function callbackD (dataH) {
          this.dataStatistics = dataH.dataCollection
        }
        this.lifeSafeFlow.scienceEntities(seg, callbackD)
      },
      selectContext (s) {
        s.active = !s.active
      },
      selectVis (visIN) {
        console.log(visIN)
        // visIN.active = !visIN.active
        if (visIN.id === 'vis-sc-1') {
          if (visIN.active === true) {
            this.visChartview = false
            this.vis1.active = false
          } else {
            this.vis1.active = true
            this.visChartview = true
          }
        } else if (visIN.id === 'vis-sc-2') {
          if (visIN.active === true) {
            this.visTableview = false
            this.vis2.active = false
          } else {
            this.vis2.active = true
            this.visTableview = true
          }
        } else if (visIN.id === 'vis-sc-3') {
          if (visIN.active === true) {
            this.visSimview = false
            this.vis3.active = false
          } else {
            this.vis3.active = true
            this.visSimview = true
          }
        }
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
      filterVisActive () {
        if (this.vis1.active === true) {
          this.activevis = this.vis1.id
          this.$store.commit('setVisual', this.activevis)
        } else if (this.vis2.active === true) {
          this.activevis = this.vis2.id
          this.$store.commit('setVisual', this.activevis)
        } else if (this.vis3.active === true) {
          this.activevis = this.vis3.id
          this.$store.commit('setVisual', this.activevis)
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
        } else if (computationSMid === 'wasm-sc-6') {
          console.log('stats tools')
          this.learn.active = false
          let statstoolsStart = {}
          statstoolsStart.statsToolsSeen = true
          this.statsData = statstoolsStart
          console.log(this.statsData)
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
  font-size: 1.6em;
  margin-left: 12px;
}

#learn-type {
  float: right;
}

.is-now {
  font-size: 1.6em;
  margin-left: 12px;
  color: green;
}

.is-future {
  font-size: 1.6em;
  margin-left: 12px;
  color: orange;
}

#close-average {
  float: right;
}

.science-compute {
  font-size: 1.6em;
}

#time-context {
  min-margin: 40px;
  text-align: center;
}

#view-time {
  margin-top: 10px;
  font-size: 1.4em;
}
</style>

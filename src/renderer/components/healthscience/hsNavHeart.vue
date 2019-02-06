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
            <header>Tools</header>
              <ul>
                <li id="tool-bar"><a class="" href="" id="tools" @click.prevent="toolsVis(t)" v-bind:class="{ 'active': tools.active}">{{tools.text}}</a></li>
              </ul>
          </li>
          <li>
            <header> Science Computations - </header>
              <ul>
                <li >
                  <select v-model="selectedCompute">
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
        <table class="tg">
          <tr>
            <th class="tg-0pky"></th>
            <th class="tg-0pky"></th>
            <th class="tg-0pky"></th>
            <th class="tg-0lax"></th>
            <th class="tg-0lax"></th>
            <th class="tg-0lax"></th>
            <th class="tg-0lax"></th>
            <th class="tg-0lax"></th>
            <th class="tg-0lax"></th>
            <th class="tg-0lax"></th>
            <th class="tg-0lax"></th>
            <th class="tg-0lax"></th>
            <th class="tg-0lax"></th>
            <th class="tg-0lax"></th>
            <th class="tg-0lax"></th>
          </tr>
          <tr>
            <td class="tg-0pky"></td>
            <td class="tg-0pky"></td>
            <td class="tg-0pky"></td>
            <td class="tg-0lax"></td>
            <td class="tg-0lax"></td>
            <td class="tg-0lax"></td>
            <td class="tg-0lax"></td>
            <td class="tg-0lax"></td>
            <td class="tg-0lax"></td>
            <td class="tg-0lax"></td>
            <td class="tg-0lax"></td>
            <td class="tg-0lax"></td>
            <td class="tg-0lax"></td>
            <td class="tg-0lax"></td>
            <td class="tg-0lax"></td>
          </tr>
          <tr>
            <td class="tg-0pky"></td>
            <td class="tg-0pky"></td>
            <td class="tg-0pky"></td>
            <td class="tg-0lax"></td>
            <td class="tg-0lax"></td>
            <td class="tg-0lax"></td>
            <td class="tg-0lax"></td>
            <td class="tg-0lax"></td>
            <td class="tg-0lax"></td>
            <td class="tg-0lax"></td>
            <td class="tg-0lax"></td>
            <td class="tg-0lax"></td>
            <td class="tg-0lax"></td>
            <td class="tg-0lax"></td>
            <td class="tg-0lax"></td>
          </tr>
        </table>
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
        selectedCompute: 'A',
        scoptions: [
          { text: 'Activity and HR data', value: 'A', cid: 'cnrl-2356388731', wasm: 'wasm-sc-1' },
          { text: 'Average HR', value: 'B', cid: 'cnrl-2356388732', wasm: 'wasm-sc-2' },
          { text: 'Resting HR Recovery', value: 'C', cid: 'cnrl-2356388733', wasm: 'wasm-sc-3' },
          { text: 'error data', value: 'D', cid: 'cnrl-2356388734', wasm: 'wasm-sc-4' },
          { text: 'HealthSpan', value: 'E', cid: 'cnrl-2356388735', wasm: 'wasm-sc-5' }
        ],
        options: {},
        tools:
        {
          active: false,
          text: 'off'
        },
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
        activecompute: 'cnrl-2356388731',
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
      }
    },
    mounted () {
    },
    created () {
      this.setAccess()
      this.setFirstEntity()
      // this.chartOptionsSet()
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
      },
      deviceContext () {
        var localthis = this
        function callbackC (dataH) {
          localthis.devices = dataH
          localthis.$store.commit('setDevice', dataH)
        }
        const deviceSet = localthis.$store.getters.liveContext.device
        // console.log(deviceSet)
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
        if (compContext === 'cnrl-2356388731') {
          this.fillData(seg)
        }
      },
      selectContext (s) {
        s.active = !s.active
      },
      selectVis (visIN) {
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
      toolsVis (ts) {
        this.tools.active = true
        this.tools.text = 'on'
        console.log('stats tools')
        let statstoolsStart = {}
        statstoolsStart.statsToolsSeen = true
        this.statsData = statstoolsStart
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
        // var localthis = this
        let computeSelected = this.selectedCompute
        console.log(computeSelected)
        // need to ask for start end market info, from Entity
        /* this.liveSafeFlow.entityChartGetter('wasm-sc-1').then(function (eData) {
          localthis.analysisStart = eData.liveChartSystem.analysisStart
          localthis.analysisEnd = eData.liveChartSystem.analysisEnd
          console.log(localthis.analysisStart)
          console.log(localthis.analysisEnd)
        }).catch(function (err) {
          console.log(err)
        }) */
        // console.log(this.analysisStart)
        // console.log(this.analysisEnd)
        let computationSMid = this.filterCompute(computeSelected)
        console.log(computationSMid)
        if (computationSMid === 'cnrl-2356388733') {
          this.$store.commit('setScience', this.scoptions[2])
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
        } else if (computationSMid === 'cnrl-2356388732') {
          // need to dispay chart for this data, first check if averages need updating?
          this.$store.commit('setScience', this.scoptions[1])
          this.fillData(0)
          this.averageSeen = true
        }
      },
      closeAvgSummary () {
        this.averageSeen = false
        this.learn.active = false
        this.activecompute = 'cnrl-2356388731'
      },
      async fillData (seg) {
        var localthis = this
        this.filterDeviceActive()
        this.filterSensorActive()
        this.filterVisActive()
        await this.liveSafeFlow.scienceEntities(seg, this.context).then(function (entityData) {
          localthis.liveSafeFlow.entityGetter(localthis.activecompute).then(function (eData) {
            console.log('VUE---return getter data')
            console.log(eData)
            localthis.options = eData.options
            localthis.datacollection = eData.prepared
            localthis.liveTime = eData.livetime
            // console.log(localthis.datacollection)
          })
        }).catch(function (err) {
          console.log(err)
        })
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

.tg  {border-collapse:collapse;border-spacing:0;}
.tg td{width:40px;font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:black;}
.tg th{font-family:Arial, sans-serif;font-size:14px;font-weight:normal;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:black;}
.tg .tg-0pky{border-color:inherit;text-align:left;vertical-align:top}
.tg .tg-0lax{text-align:left;vertical-align:top}

</style>

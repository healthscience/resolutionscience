<template>
  <section class="container">
    <section id="knowledge">
      <knowledge-Live :liveData="liveData" ></knowledge-Live>
      <knowledge-Context :knowledgeData="knowledgeData" @knowledgeSet="knowledgeStatus" @languageSet="languageStatus"  @scienceSet="scienceStatus" ></knowledge-Context>
    </section>
    <!-- <h1>Human -> Body(movement - steps) + Heart</h1>
    <div id="resolution-set">Resolution: Time {{ resolutionSet }} intervals</div>
      <section id="heart-science-context" class="column">
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
            <header>DataTypes - </header>
              <ul>
                <li id="bmp-data-sensor" v-for="sen in sensors">
		              <a class="" href="" id="bmp-data" @click.prevent="selectContext(sen)" v-bind:class="{ 'active': sen.active}">{{ sen.text }}</a>
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
                <li id="tool-bar"><a class="" href="" id="toolbarholder" @click.prevent="toolsVis()" >{{toolbar.text}}</a></li>
              </ul>
          </li>
          <li>
            <header>Science Computations - </header>
              <ul>
                <li >
                  <select v-model="selectedCompute" @change="updateSciDTs(selectedCompute)">
                  <option class="science-compute" v-for="scoption in scoptions" v-bind:value="scoption.cid">
                    {{ scoption.text }}
                  </option>
                </select>
                </li>
              </ul>
          </li>
          <li>
            <div id="learn-type">
              <button class="" href="" id="learn-button" @click.prevent="filterLearn(learn)">{{ learn.name }}</button>
            </div>
          </li>
        </ul>
      </section> -->
      <section id="diy-science">
        <div id="oracles">oracles</div>
        <div id="tends">trends</div>
        <div id="visulation-select">
            <ul>
              <li id="visualisation-type"><a class="" href="" id="" @click.prevent="selectVis(vis1)" v-bind:class="{ 'active': vis1.active}">{{ vis1.name }}</a></li>
              <li id="visualisation-type"><a class="" href="" id="" @click.prevent="selectVis(vis2)" v-bind:class="{ 'active': vis2.active}">{{ vis2.name }}</a></li>
              <li id="visualisation-type"><a class="" href="" id="" @click.prevent="selectVis(vis3)" v-bind:class="{ 'active': vis3.active}">{{ vis3.name }}</a></li>
              <li id="tool-bar">
                <header>Tools</header>
                <a class="" href="" id="toolbarholder" @click.prevent="toolsSwitch()" >{{toolbar.text}}</a>
              </li>
            </ul>
        </div>
        <div id="toolbar-tools">
          <Toolbar-Tools :toolbarData="toolbarData" @toolbarSet="toolbarStatus()" ></Toolbar-Tools>
        </div>
        <div id="reports">
          <!--<Learn-Report @load="text = $event" :reportData="reportCollection" ></Learn-Report>-->
          <recovery-Report :recoveryData="recoveryData" @recoverySet="recoveryStatus()" ></recovery-Report>
        </div>
        <div v-if="visChartview" id="charts-live">
          <div v-if="averageSeen" id="average-charting">
            <h3></h3>
            <div>
              <div id="chart-message">{{ chartmessage }}</div>
              <div id="close-average">
                <button id="close-report" @click.prevent="closeAvgSummary()">Close</button>
              </div>
            </div>
          </div>
          <reactive :chartData="datacollection" :options="options" :width="1200" :height="600"></reactive>
        </div>
      <section v-if="visTableview" id="table-view">
        <table-Build></table-Build>
      </section>
      <section v-if="visSimview" id="sim-view">
        <simulation-View></simulation-View>
      </section>
      <section id="time-context">
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
      </section>
    </section>
  </section>
</template>

<script>
  import SAFEflow from '../../safeflow/safeFlow.js'
  import LineChart from '@/components/charts/LineChart'
  import BarChart from '@/components/charts/BarChart'
  import BubbleChart from '@/components/charts/BubbleChart'
  import Reactive from '@/components/charts/Reactive'
  import Reactivestats from '@/components/charts/Reactivestats'
  import KnowledgeContext from '@/components/toolbar/knowledgeContext.vue'
  import KnowledgeLive from '@/components/toolbar/knowledgeLive.vue'
  import ToolbarTools from '@/components/toolbar/statisticstools.vue'
  import LearnReport from '@/components/reports/learn-report.vue'
  import recoveryReport from '@/components/reports/recoveryReport.vue'
  import tableBuild from '@/components/table/tableBuilder.vue'
  import simulationView from '@/components/simulation/simulation-life.vue'

  export default {
    name: 'VueChartJS',
    components: {
      LineChart,
      BarChart,
      BubbleChart,
      Reactive,
      Reactivestats,
      recoveryReport,
      LearnReport,
      tableBuild,
      simulationView,
      ToolbarTools,
      KnowledgeContext,
      KnowledgeLive
    },
    data () {
      return {
        liveSafeFlow: null,
        knowledgeData: {},
        liveData:
        {
          devices: [],
          sensors: [],
          scienceLive: '',
          language: ''
        },
        knowledge:
        {
          active: false,
          text: 'hiden'
        },
        liveTime: 0,
        datacollection: null,
        datastatistics: null,
        liveChartoptions: null,
        selectedCompute: 'A',
        keyC: {},
        scoptions: [],
        options: {},
        toolbar:
        {
          active: false,
          text: 'off'
        },
        averageSeen: false,
        toolbarData: {},
        recoveryData: {},
        labelback: [],
        heartback: [],
        colorback: '',
        colorlineback: '',
        devices: [],
        sensors: [],
        resolution: [],
        resolutionSet: '',
        sciencedataMapping: {},
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
          id: 'learn-status'
        },
        chartmessage: 'Select time',
        activedevice: [],
        activesensor: [],
        activeEntity: 'cnrl-2356388731',
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
      science: function () {
        return this.$store.state.science
      },
      tools: function () {
        return this.$store.state.tools
      }
    },
    mounted () {
      this.knowledgeData.seenStatus = true
    },
    created () {
      this.setAccess()
      this.setFirstEntity()
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
        this.resoutionType()
      },
      scienceContext () {
        // set the first science priority on start of RS
        this.scoptions = this.$store.getters.liveScience
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
          localthis.sciencedataMapping[localthis.activeEntity] = datatypeSet
          localthis.sensors = localthis.sciencedataMapping[localthis.activeEntity]
        } else {
          const flag = 'datatype'
          this.liveSafeFlow.toolkitContext(flag, callbackT)
        }
      },
      resoutionType () {
        this.resolutionSet = '60 seconds'
      },
      async getAverages (eid) {
        // update latest daily average HR
        let currentAHR = await this.liveSafeFlow.entityCurrentAverageHR(eid)
        console.log('averageHR current====')
        console.log(currentAHR)
        let newAHR = currentAHR // Math.floor(Math.random() * Math.floor(max))
        let newARHR = 55
        this.options.annotation.annotations[0].value = newAHR
        this.options.annotation.annotations[1].value = newARHR
      },
      setContextData (seg) {
        // get seg and then look at compute context and call appropriate
        const compContext = this.activeEntity
        if (compContext === 'cnrl-2356388731') {
          this.fillData(seg, {})
        }
      },
      selectContext (s) {
        s.active = !s.active
      },
      updateSciDTs (sciDTin) {
        console.log('science has changed')
        // console.log(sciDTin)
        // console.log(this.activeEntity)
        this.activeEntity = sciDTin
        // use cid to look up datatype for this scienceEntities
        let sciDTypes = this.liveSafeFlow.cnrlLookup(sciDTin)
        // console.log(sciDTypes)
        this.sensors = sciDTypes.prime
        this.resolutionSet = sciDTypes.resolution[0].text
        this.$store.commit('setDatatype', sciDTypes.prime)
        this.$store.commit('setResolutiontype', sciDTypes.resolution)
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
      toolsVis () {
        console.log('toolbar view')
        this.toolbar.text = 'on'
        /* let recoveryStart = {}
        recoveryStart.seenStatus = true
        this.recoveryData = recoveryStart */
        let toolbarStart = {}
        toolbarStart.seenStatus = true
        toolbarStart.liveOptions = this.liveChartoptions
        this.toolbarData = toolbarStart
        console.log(this.toolbarData)
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
        // console.log(this.sensors)
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
        console.log(s)
        // s.active = !s.active
        this.learnStartStop()
      },
      timeRange () {
        let rangeHolder = {}
        rangeHolder.startTime = this.toolbarData.liveOptions.analysisStart
        rangeHolder.endTime = this.toolbarData.liveOptions.analysisEnd
        rangeHolder.active = true
        return rangeHolder
      },
      learnStartStop () {
        // pass to entity component system
        let computationSMid = this.selectedCompute
        // console.log(computationSMid)
        if (computationSMid === 'cnrl-2356388733') {
          this.$store.commit('setScience', this.scoptions[2])
          let timeRange = this.timeRange()
          this.fillData(0, timeRange)
          // this.learn.active = false
        } else if (computationSMid === 'cnrl-2356388732') {
          // need to dispay chart for this data, first check if averages need updating?
          this.$store.commit('setScience', this.scoptions[1])
          this.fillData(0, {})
          this.averageSeen = true
        } else if (computationSMid === 'cnrl-2356388731') {
          // observation data
          console.log('learn from observations')
          console.log(this.scoptions[0])
          this.$store.commit('setScience', this.scoptions[0])
          this.fillData(0, {})
          // this.observationsSeen = true
        }
      },
      closeAvgSummary () {
        this.averageSeen = false
        // this.learn.active = false
        this.activeEntity = 'cnrl-2356388731'
        this.$store.commit('setScience', this.scoptions[0])
      },
      knowledgeStatus (kIN) {
        console.log('knowledtget set in')
        console.log(kIN)
        if (kIN.device_mac) {
          console.log('device live')
          this.liveDevice(kIN)
        } else if (kIN.text) {
          // datatypes
          this.liveDataTypes(kIN)
        }
      },
      languageStatus (lIN) {
        console.log('language set in')
        console.log(lIN)
        this.liveData.language = lIN
        console.log(this.liveData.language)
      },
      liveDevice (liveD) {
        console.log('set live device to comp')
        let deviceLive = []
        if (liveD.active === true) {
          deviceLive.push(liveD)
        } else if (liveD.active === false) {
          // remove device
          this.removeLiveElement(liveD.device_mac)
        }
        this.liveData.devices = deviceLive
      },
      toolsSwitch () {
        console.log('tools sliders overlay')
        this.toolbar.text = 'on'
      },
      removeLiveElement (remove) {
        console.log('device remove')
        let array = this.liveData.devices
        function arrayRemove (arr, value) {
          return arr.filter(function (ele) {
            return ele.device_mac !== value
          })
        }
        let result = arrayRemove(array, remove)
        console.log(result)
        return true
      },
      liveDataTypes (liveDT) {
        console.log('set live DT')
        // let dataTypesLive = []
        if (liveDT.active === true) {
          console.log('true')
          this.liveData.sensors.push(liveDT)
        } else if (liveDT.active === false) {
          // remove device
          console.log('false')
          this.removeLiveDT(liveDT.text)
        }
        // this.liveData.sensors.push(dataTypesLive)
      },
      removeLiveDT (remove) {
        console.log('remove DT')
        let array = this.liveData.sensors
        function arrayRemove (arr, value) {
          return arr.filter(function (ele) {
            return ele.text !== value
          })
        }
        let result = arrayRemove(array, remove)
        this.liveData.sensors = result
        return true
      },
      scienceStatus (sIN) {
        console.log('science set in')
        console.log(sIN)
        this.liveData.scienceLive = sIN
      },
      toolbarStatus () {
        this.toolbar.text = 'off'
      },
      recoveryStatus () {
        this.toolbar.text = 'off'
      },
      async fillData (seg, range) {
        var localthis = this
        this.filterDeviceActive()
        this.filterSensorActive()
        this.filterVisActive()
        // listening to give peer info. on computation statusTime
        this.liveSafeFlow.liveEManager.on('computation', function (cState) {
          console.log('computation event from manager')
          console.log(cState)
          if (cState === 'in-progress') {
            localthis.chartmessage = cState
          } else {
            localthis.chartmessage = 'computation up-to-date'
          }
        })
        await this.liveSafeFlow.scienceEntities(seg, range, this.context).then(function (entityData) {
          localthis.liveSafeFlow.entityGetter(localthis.activeEntity, localthis.activevis).then(function (eData) {
            console.log('VUE---return getter data')
            console.log(eData)
            console.log(eData.chartMessage)
            console.log(localthis.activevis)
            if (localthis.activevis === 'vis-sc-1') {
              console.log('chartjs')
              if (eData.chartMessage === 'computation in progress') {
                console.log('chartjs--ongoing computation or obseration data')
                localthis.chartmessage = eData.chartMessage
                localthis.options = eData.chartPackage.options
                localthis.$store.commit('setTools', localthis.options)
                localthis.datacollection = eData.chartPackage.prepared
                localthis.liveTime = eData.chartPackage.livetime
                localthis.liveChartoptions = eData.liveChartOptions
                console.log(localthis.activeEntity)
                localthis.getAverages(localthis.activeEntity)
              } else if (eData.chartMessage === 'vis-report') {
                console.log('prepare report for HR recovery')
                let recoveryStart = {}
                recoveryStart.seenStatus = true
                recoveryStart.hrcdata = eData.hrcReport
                localthis.recoveryData = recoveryStart
                console.log(localthis.reportData)
              } else {
                console.log('chartjs-- uptodate finised')
                localthis.chartmessage = 'computation up-to-date'
                localthis.options = eData.options
                localthis.$store.commit('setTools', localthis.options)
                localthis.datacollection = eData.chartPackage.prepared
                localthis.liveTime = eData.chartPackage.livetime
                localthis.liveChartoptions = eData.liveChartOptions
              }
              // console.log(localthis.datacollection)
            } else if (localthis.activevis === 'vis-sc-2') {
              console.log('tablejs')
              // localthis.tableHTML = eData.table
            } else if (localthis.activevis === 'vis-sc-3') {
              console.log('simjs')
              // localthis.simulationHeart = eData.heart
              // localthis.simulationMovement = eData.heart
              // localthis.simulationTime = eData.time
            }
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

#diy-science {
  border: 2px solid orange;
  margin: 2em;
  width: 98%;
}

#visulation-select {
    border: 1px solid green;
    margin-left: 1em;
}
</style>

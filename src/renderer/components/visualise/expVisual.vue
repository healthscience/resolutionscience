<template>
  <div id="visual-view">
    <div id="diy-science">PAST
      <div id="experiment-summary">
          <div id="experiment-toolbar">
            <ul>
              <li id="visualisation-type"><a class="" href="" id="" @click.prevent="selectVis(vis1)" v-bind:class="{ 'active': vis1.active}">{{ vis1.name }}</a></li>
              <li id="visualisation-type"><a class="" href="" id="" @click.prevent="selectVis(vis2)" v-bind:class="{ 'active': vis2.active}">{{ vis2.name }}</a></li>
              <li id="visualisation-type"><a class="" href="" id="" @click.prevent="selectVis(vis3)" v-bind:class="{ 'active': vis3.active}">{{ vis3.name }}</a></li>
              <li id="tool-bar">
                <header>Tools</header>
                <a class="" href="" id="toolbarholder" @click.prevent="toolsSwitch(toolbar)" v-bind:class="{ 'active': toolbar.active}">{{ toolbar.text }}</a>
              </li>
            </ul>
            <div id="edit-experiment">
            </div>
        </div>
      </div>
      <div v-if="visChartview" id="charts-live">
        <reactive :chartData="datacollection" :options="options" :width="800" :height="400"></reactive>
      </div>
      <div v-if="visTableview" id="table-view">
        <table-Build></table-Build>
      </div>
      <div v-if="visSimview" id="sim-view">
        <simulation-View></simulation-View>
      </div>
      <div id="time-context">
        <!-- <div id="select-time">
          <ul>
            <li v-for="tv in timeVis" class="context-time">
              <button class="button is-primary" @click.prevent="setTimeData(tv)">{{ tv.text }}</button>
            </li>
          </ul>
        </div> -->
        <div id="view-time">
          {{ displayTime }}
        </div>
        <div id="calendar-selector">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import liveMixinSAFEflow from '@/mixins/safeFlowAPI'
  import Reactive from '@/components/visualise/charts/Reactive'
  import Reactivestats from '@/components/visualise/charts/Reactivestats'
  import ToolbarTools from '@/components/toolbar/statisticstools'
  import tableBuild from '@/components/visualise/table/tableBuilder'
  import simulationView from '@/components/visualise/simulation/simulation-life'
  // const moment = require('moment')

  export default {
    name: 'expvisual-liveview',
    components: {
      Reactive,
      Reactivestats,
      ToolbarTools,
      tableBuild,
      simulationView
    },
    props: {
      entityCNRL: '',
      datacollection: {
        type: Object
      },
      options: {
        type: Object
      },
      displayTime: ''
    },
    mixins: [liveMixinSAFEflow],
    data () {
      return {
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
        toolbar:
        {
          active: false,
          text: 'off'
        },
        toolbarData: {},
        visChartview: true,
        visTableview: false,
        visSimview: false,
        timeVis: []
      }
    },
    computed: {
    },
    created () {
      // this.timeNavSegments()
    },
    mounted () {
    },
    methods: {
      timeNavSegments () {
        this.timeVis = this.timeNav('datatime-index')
      },
      selectVis (visIN) {
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
        // filter what visualisation is active and setToken
        this.filterVisualisation()
      },
      filterVisualisation () {
        let visLive = []
        if (this.vis1.active === true) {
          visLive.push(this.vis1.id)
        }
        if (this.vis2.active === true) {
          visLive.push(this.vis2.id)
        }
        if (this.vis3.active === true) {
          visLive.push(this.vis3.id)
        }
      },
      toolsSwitch (ts) {
        ts.active = !ts.active
        if (ts.active === true) {
          this.toolbar.text = 'on'
          // need to add annotation to chart OPTIONS
          this.$emit('toolsStatus', true)
        } else {
          this.toolbar.text = 'off'
          // remove the annotation from the chart OPTIONS
          this.$emit('toolsStatus', false)
        }
      },
      recoveryStatus () {
        this.toolbar.text = 'off'
      },
      closeAvgSummary () {
        this.averageSeen = false
      },
      setTimeData (seg) {
        // back and forward and time
        this.$emit('updateLearn', seg)
      },
      addToExperiment (exB) {
      },
      experADD (expA) {
      }
    }
  }
</script>

<style>
#diy-science {
  border: 2px solid green;
  margin: 2em;
  width: 98%;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

#heart-chart {
  width: 1200px;
}

#heart-chart ul li {
  font-size: 1.1em;
}

.is-primary {
  font-size: 1.6em;
  margin-left: 12px;
}

#time-context {
  min-margin: 40px;
  text-align: center;
}

#visulation-select {
    border: 1px solid green;
    margin-left: 1em;
}

#learn-button {
  font-size: 1.6em;
  padding: .25em;
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

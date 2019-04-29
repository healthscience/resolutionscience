<template>
  <div id="visual-view">
    <div id="diy-science">
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
        <recovery-Report :recoveryData="recoveryData" @recoverySet="recoveryStatus()" ></recovery-Report>
      </div>
      <div v-if="visChartview" id="charts-live">
        <!-- <div v-if="averageSeen" id="average-charting">
          <h3></h3>
          <div>
            <div id="chart-message">{{ chartmessage }}</div>
            <div id="close-average">
              <button id="close-report" @click.prevent="closeAvgSummary()">Close</button>
            </div>
          </div>
        </div> -->
        <reactive :chartData="datacollection" :options="options" :width="1200" :height="600"></reactive>
      </div>
      <div v-if="visTableview" id="table-view">
        <table-Build></table-Build>
      </div>
      <div v-if="visSimview" id="sim-view">
        <simulation-View></simulation-View>
      </div>
      <div id="time-context">
        <div id="select-time">
          <button class="button is-primary" @click="setContextData('-year')">- 1 Year</button>
          <button class="button is-primary" @click="setContextData('-month')">- 1 month</button>
          <button class="button is-primary" @click="setContextData('-day')">Back day</button>
          <button class="button is-now" @click="setContextData('day')">Today</button>
          <button class="button is-future" @click="setContextData('+day')">Forward day</button>
          <button class="button is-future" @click="setContextData('+month')">+ 1 month</button>
          <button class="button is-future" @click="setContextData('+year')">+ 1 year</button>
        </div>
        <div id="view-time">
          {{ liveTime }}
        </div>
        <div id="calendar-selector">
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import LineChart from '@/components/charts/LineChart'
  import BarChart from '@/components/charts/BarChart'
  import BubbleChart from '@/components/charts/BubbleChart'
  import Reactive from '@/components/charts/Reactive'
  import Reactivestats from '@/components/charts/Reactivestats'
  import ToolbarTools from '@/components/toolbar/statisticstools'
  import LearnReport from '@/components/reports/learn-report'
  import recoveryReport from '@/components/reports/recoveryReport'
  import tableBuild from '@/components/table/tableBuilder'
  import simulationView from '@/components/simulation/simulation-life'

  export default {
    name: 'visual-live',
    components: {
      LineChart,
      BarChart,
      BubbleChart,
      Reactive,
      Reactivestats,
      ToolbarTools,
      LearnReport,
      recoveryReport,
      tableBuild,
      simulationView
    },
    props: {
      liveVis: {
        type: Object
      },
      inputData: {
        type: Object
      }
    },
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
        recoveryData: {},
        datastatistics: null,
        liveChartoptions: null,
        visChartview: true,
        liveTime: '',
        visTableview: false,
        visSimview: false
      }
    },
    computed: {
      system: function () {
        return this.$store.state.system
      },
      datacollection: function () {
        return this.$store.state.visData
      },
      options: function () {
        return this.$store.state.visOptions
      },
      tools: function () {
        return this.$store.state.tools
      }
    },
    created () {
    },
    mounted () {
      this.startTools()
    },
    methods: {
      startTools () {
        this.liveTools = this.$store.getters.liveTools
        this.$store.commit('setVisual', ['vis-sc-1'])
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
        this.$store.commit('setVisual', visLive)
      },
      toolsSwitch () {
        console.log('tools sliders overlay')
        this.toolbar.text = 'on'
      },
      toolbarStatus () {
        this.toolbar.text = 'off'
      },
      recoveryStatus () {
        this.toolbar.text = 'off'
      },
      closeAvgSummary () {
        this.averageSeen = false
      }
    }
  }
</script>

<style>
#diy-science {
  border: 2px solid orange;
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

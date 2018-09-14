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
        </ul>
        <h3>Reactive data charting - Live updates</h3>
        <div id="chart-message">{{ chartmessage }}</div>
        <reactive :chart-data="datacollection" :width="1200" :height="600"></reactive>
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
        labelback: [],
        heartback: [],
        colorback: '',
        colorlineback: '',
        devices: [],
        sensors: [],
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
        chartmessage: 'Chart Loading',
        chartmessageS: 'Statistics Chart Loading',
        activedevice: [],
        activesensor: [],
        activecompute: '',
        activeupdatecompute: '',
        activevis: '',
        computeFlag: ''
      }
    },
    created () {
      this.dataContext()
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
          console.log('in vue')
          console.log(results)
          // need to prepare different visualisations, data return will fit only one select option
          localthis.labelback = results[0].labels
          localthis.heartback = results[0].datasets
          localthis.colorback = results[0].backgroundColor
          localthis.colorlineback = results[0].borderColor
          localthis.activityback = results[1].datasets
          // localthis.colorback2 = results[1].backgroundColor
          // localthis.colorlineback2 = results[1].borderColor

          if (dataH === 'no data') {
            // no data to display
            localthis.chartmessage = 'No data to display'
            localthis.datacollection = {
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
            localthis.datacollection = {
              labels: localthis.labelback,
              datasets: [
                {
                  label: 'Beats per minute',
                  borderColor: '#ea1212',
                  backgroundColor: '#ed7d7d',
                  fill: true,
                  data: localthis.heartback,
                  yAxisID: 'bpm'
                }, {
                  label: 'Activity - Steps',
                  borderColor: '#050d2d',
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
          // localthis.colorback2 = results[1].backgroundColor
          // localthis.colorlineback2 = results[1].borderColor

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
                  backgroundColor: '#ed7d7d',
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

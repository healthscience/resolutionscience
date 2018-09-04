<template>
  <section class="container">
    <h1>Heart</h1>
    <div class="columns">
      <div id="heart-chart" class="column">
        <h1>Select Device/Sensor Data: <a class="" href="" id="update-compute" @click.prevent="startComputeUpdate(updatecompute)" v-bind:class="{ 'active': updatecompute.active}">{{ updatecompute.name }}</a></h1>
        <ul>
          <li>
            <header>Device - </header>
              <ul>
                <li><a class="" href="" id="F1:D1:D5:6A:32:D6" @click.prevent="selectContext(device1)" v-bind:class="{ 'active': device1.active}">{{ device1.name }}</a></li>
                <li><a href="" class="" id="E3:30:80:7A:77:B5" @click.prevent="selectContext(device2)" v-bind:class="{ 'active': device2.active}">{{ device2.name }}</a></li>
              </ul>
          </li>
          <li>
            <header> Sensors - </header>
              <ul>
                <li id="bmp-data-sensor"><a class="" href="" id="bmp-data" @click.prevent="selectContext(sensor1)" v-bind:class="{ 'active': sensor1.active}">{{ sensor1.name }}</a></li>
                <li id="steps-data-sensor"><a class="" href="" id="steps-data" @click.prevent="selectContext(sensor2)" v-bind:class="{ 'active': sensor2.active}">{{ sensor2.name }}</a></li>
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
        <button class="button is-primary" @click="fillData(1)">One month</button>
        <button class="button is-primary" @click="fillData(2)">Two months</button>
        <button class="button is-primary" @click="fillData(3)">Three months</button>
        <button class="button is-primary" @click="fillData(6)">6 months</button>
        <button class="button is-primary" @click="fillData(12)">One Year</button>
        <h3>Science Statistics - Live updates</h3>
        <div id="chart-message">{{ chartmessageS }}</div>
        <reactivestats :chart-data="datastatistics" :width="1200" :height="600"></reactivestats>
        <button class="button is-primary" @click="fillStats(0)">One day</button>
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
        device1:
        {
          name: 'Mi Band2',
          id: 'C5:4C:89:9D:44:10',
          active: false
        },
        device2:
        {
          name: 'Amazfit',
          id: 'F1:D1:D5:6A:32:D6',
          active: true
        },
        sensor1:
        {
          name: 'BMP - lightLED',
          id: 'SCDaMaHub-time-heartrate',
          active: true
        },
        sensor2:
        {
          name: 'Steps - Accelerometer',
          id: 'SCDaMaHub-time-steps',
          active: false
        },
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
        updatecompute:
        {
          name: 'Update Computations',
          id: 'update-compute-1',
          active: false
        },
        chartmessage: 'Chart Loading',
        activedevice: '',
        activesensor: '',
        activecompute: '',
        activeupdatecompute: '',
        activevis: '',
        computeFlag: ''
      }
    },
    created () {
      this.fillData(0)
      this.fillStats(0)
    },
    methods: {
      fillData (seg) {
        var localthis = this
        this.filterDeviceActive()
        this.filterSensorActive()
        this.filterScienceActive()
        this.filterVisActive()
        function callbackD (dataH) {
          let results = dataH
          // need to prepare different visualisations, data return will fit only one select option
          localthis.labelback = results.labels
          localthis.heartback = results.datasets
          if (dataH === 'no data') {
            // no data to display
            localthis.chartmessage = 'No data to display'
            localthis.datacollection = {
              labels: [],
              datasets: [
                {
                  label: 'No data available',
                  backgroundColor: '#ed7d7d',
                  borderColor: '#ea1212',
                  data: []
                }
              ]
            }
          } else {
            localthis.chartmessage = ''
            localthis.datacollection = {
              labels: localthis.labelback,
              datasets: [
                {
                  label: localthis.activesensor,
                  backgroundColor: '#ed7d7d',
                  borderColor: '#ea1212',
                  data: localthis.heartback
                }
              ]
            }
          }
          // console.log(localthis.datacollection)
        }
        this.computeFlag = 'raw'
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
          localthis.labelback = results.labels
          localthis.heartback = results.datasets
          if (dataH === 'no data') {
            // no data to display
            localthis.chartmessage = 'No data to display'
            localthis.datastatistics = {
              labels: [],
              datasets: [
                {
                  label: 'No data available',
                  backgroundColor: '#ed7d7d',
                  borderColor: '#ea1212',
                  data: []
                }
              ]
            }
          } else {
            localthis.chartmessage = ''
            localthis.datastatistics = {
              labels: localthis.labelback,
              datasets: [
                {
                  label: localthis.activesensor,
                  backgroundColor: '#ed7d7d',
                  borderColor: '#ea1212',
                  data: localthis.heartback
                }
              ]
            }
          }
          // console.log(localthis.datacollection)
        }
        this.computeFlag = 'statistics'
        this.liveFlow.systemCoordinate(seg, this.activedevice, this.activesensor, this.activecompute, this.activevis, this.computeFlag, callbackD)
      },
      startComputeUpdate () {
        this.liveFlow.computationSystem('update', this.activedevice)
      },
      selectContext (s) {
        s.active = !s.active
      },
      filterDeviceActive () {
        if (this.device1.active === true) {
          this.activedevice = this.device1.id
        } else if (this.device2.active === true) {
          this.activedevice = this.device2.id
        }
      },
      filterSensorActive () {
        if (this.sensor1.active === true) {
          this.activesensor = this.sensor1.id
        } else if (this.sensor2.active === true) {
          this.activesensor = this.sensor2.id
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

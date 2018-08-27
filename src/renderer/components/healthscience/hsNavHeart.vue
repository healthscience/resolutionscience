<template>
  <section class="container">
    <h1>Heart</h1>
    <div class="columns">
      <div class="column">
        <h3>Line Chart</h3>
        <!--<line-chart></line-chart>-->
      </div>
      <div class="column">
        <h3>Bar Chart</h3>
        <!--<bar-chart></bar-chart>-->
      </div>
    </div>
    <div class="columns">
      <div class="column">
        <h3>Bubble Chart</h3>
        <!--<bubble-chart></bubble-chart>-->
      </div>
      <div id="heart-chart" class="column">
        <h1>Select Device/Sensor Data:</h1>
        <ul>
          <li>
            <header>Device - <a class="" href="" id="E3:30:80:7A:77:B5" @click.prevent="selectContext(device1)" v-bind:class="{ 'active': device1.active}">{{ device1.name }}</a> <a href="" class="" id="E3:30:80:7A:77:B5" @click.prevent="selectContext(device2)" v-bind:class="{ 'active': device2.active}">{{ device2.name }}</a></header>
            <ul>
              <li id="bmp-data-sensor"><a class="" href="" id="bmp-data" @click.prevent="selectContext(sensor1)" v-bind:class="{ 'active': sensor1.active}">{{ sensor1.name }}</a></li>
              <li id="steps-data-sensor"><a class="" href="" id="steps-data" @click.prevent="selectContext(sensor2)" v-bind:class="{ 'active': sensor2.active}">{{ sensor2.name }}</a></li>
            </ul>
          </li>
        </ul>
        <h3>Reactivity - Live update upon change in datasets</h3>
        <div id="chart-message">{{ chartmessage }}</div>
        <reactive :chart-data="datacollection" :width="1200" :height="600"></reactive>
        <button class="button is-primary" @click="fillData(0)">One day</button>
        <button class="button is-primary" @click="fillData(1)">One month</button>
        <button class="button is-primary" @click="fillData(2)">Two months</button>
        <button class="button is-primary" @click="fillData(3)">Three months</button>
        <button class="button is-primary" @click="fillData(6)">6 months</button>
        <button class="button is-primary" @click="fillData(12)">One Year</button>
      </div>
    </div>
  </section>
</template>

<script>
  import LineChart from '@/components/charts/LineChart'
  import BarChart from '@/components/charts/BarChart'
  import BubbleChart from '@/components/charts/BubbleChart'
  import Reactive from '@/components/charts/Reactive'
  import SAFEflow from '../../safeflow/safeFlow.js'

  export default {
    name: 'VueChartJS',
    components: {
      LineChart,
      BarChart,
      BubbleChart,
      Reactive
    },
    data () {
      return {
        liveFlow: new SAFEflow(),
        datacollection: null,
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
          id: 'E3:30:80:7A:77:B5',
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
        chartmessage: 'Chart Loading',
        activedevice: '',
        activesensor: ''
      }
    },
    created () {
      this.fillData(0)
    },
    methods: {
      fillData (seg) {
        var localthis = this
        this.filterDeviceActive()
        this.filterSensorActive()
        function callbackD (dataH) {
          let results = dataH
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
        this.liveFlow.getData(seg, this.activedevice, this.activesensor, callbackD)
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
  }
</style>

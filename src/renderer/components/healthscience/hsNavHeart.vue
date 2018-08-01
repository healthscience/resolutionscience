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
        <h3>Reactivity - Live update upon change in datasets</h3>
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
        heartback: []
      }
    },
    created () {
      this.fillData(0)
    },
    methods: {
      fillData (seg) {
        console.log(seg)
        var localthis = this
        function callbackD (dataH) {
          let results = dataH
          localthis.labelback = results.labels
          localthis.heartback = results.datasets
          localthis.datacollection = {
            labels: localthis.labelback,
            datasets: [
              {
                label: 'Heart Beats Per Minute',
                backgroundColor: '#ed7d7d',
                borderColor: '#ea1212',
                data: localthis.heartback
              }
            ]
          }
          console.log(localthis.datacollection)
        }
        this.liveFlow.getData(seg, '"E3:30:80:7A:77:B5', callbackD)
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
</style>

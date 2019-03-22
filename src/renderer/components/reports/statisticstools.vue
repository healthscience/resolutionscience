<template>
  <div v-if="statsData.statsToolsSeen" id="statistics-tools-view">
    <div id="navigate-stats">
      <header>Toolbar</header>
      <div id="close-stats-tools">
        <button id="save-stats" @click.prevent="saveStatsScience()">Close</button>
      </div>
    </div>
    <div id="tools">
      <div id="tool-bar">
      </div>
      <div id="categorise">
        <header>Categorise</header>
        <div id="start-point">Start point: {{ startLine }}</div>
        <div id="end-point">End point: {{ stopLine }}</div>
        <!-- <div id="low-category-matrix">Low Intentity: Short Medium High</div> statsData.liveOptions.analysisStart
        <div id="medium-category-matrix">High Intentity: Short Medium High</div>
        <div id="high-category-matrix">High Intentity: Short Medium High</div> -->
        <button id="test-compute-stats" @click.prevent="categoriseCompute()">Learn categorisation</button>
      </div>
      <!-- <div id="stat-computational-model">
        <header>Computational Model</header>
         Mean, Mode, Median, Correlation, Variance Std. Deviation Error LMS-reqression
        <div id="equation-model">Model: Y = x2 _2</div>
        <div id="new-wasm-model">Upload WASM computation</div>
        <button id="test-compute-stats" @click.prevent="testStatsCompute()">Start Compute</button>
      </div> -->
    </div>
  </div>
</template>

<script>
  import moment from 'moment'

  export default {
    name: 'statistics-tools',
    components: {
    },
    props: {
      statsData: {
        type: Object
      },
      inputData: {
        type: Object
      }
    },
    data () {
      return {
        liveTools: {},
        statsSummary: '',
        startPoint: 'none selected',
        endPoint: 'none selected'
      }
    },
    created () {
    },
    computed: {
      system: function () {
        return this.$store.state.system
      },
      tools: function () {
        return this.$store.state.tools
      },
      startLine: function () {
        return moment(this.statsData.liveOptions.analysisStart).format('MMMM Do YYYY, h:mm:ss a')
      },
      stopLine: function () {
        return moment(this.statsData.liveOptions.analysisEnd).format('MMMM Do YYYY, h:mm:ss a')
      }
    },
    mounted () {
      this.startTools()
      console.log('mounted')
    },
    methods: {
      startTools () {
        this.liveTools = this.$store.getters.liveTools
      },
      saveStatsScience () {
        console.log('button pressed')
        this.statsData.statsToolsSeen = false
        this.$emit('toolbarSet', false)
      },
      testStatsCompute () {
      },
      categoriseCompute () {
      }
    }
  }
</script>

<style>
#statistics-tools-view {
  margin: 20px;
  border: 1px solid grey;
}
#statistics-tools-view header {
  font-size: 1.4em;
}

#save-stats {
  float: right;
}

#tools {
  margin: 20px;
  border: 1px solid lightgrey;
}
</style>

<template>
  <div v-if="toolbarData.seenStatus" id="toolbar-view">
    <div id="navigate-toolbar">
      <header>Toolbar</header>
      <div id="close-toolbar">
        <button id="save-stats" @click.prevent="saveStatsScience()">Close</button>
      </div>
    </div>
    <div id="tools-settings">
      <div id="categorise">
        <header>Categorise</header>
        <div id="start-point">Start point: {{ startLine }}</div>
        <div id="end-point">End point: {{ stopLine }}</div>
        <!--<div id="low-category-matrix">Low Intentity: Short Medium High</div> statsData.liveOptions.analysisStart
        <div id="medium-category-matrix">High Intentity: Short Medium High</div>
        <div id="high-category-matrix">High Intentity: Short Medium High</div>
        <button id="test-compute-stats" @click.prevent="categoriseCompute()">Learn categorisation</button>-->
      </div>
      <!--<div id="stat-computational-model">
        <header>Computational Model</header>
         Mean, Mode, Median, Correlation, Variance Std. Deviation Error LMS-reqression
        <div id="equation-model">Model: Y = x2 _2</div>
        <div id="new-wasm-model">Upload WASM computation</div>
        <button id="test-compute-stats" @click.prevent="testStatsCompute()">Start Compute</button>
      </div>-->
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
      toolbarData: {
        type: Object
      },
      inputData: {
        type: Object
      }
    },
    data () {
      return {
        liveTools: {},
        toolbarSummary: '',
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
        return moment(this.toolbarData.liveOptions.analysisStart).format('MMMM Do YYYY, h:mm:ss a')
      },
      stopLine: function () {
        return moment(this.toolbarData.liveOptions.analysisEnd).format('MMMM Do YYYY, h:mm:ss a')
      }
    },
    mounted () {
      this.startTools()
    },
    methods: {
      startTools () {
        this.liveTools = this.$store.getters.liveTools
      },
      saveStatsScience () {
        console.log('button pressed')
        this.toolbarData.seenStatus = false
        this.$emit('toolbarSet', false)
      },
      categoriseCompute () {
      }
    }
  }
</script>

<style>
#toolbar-view {
  margin: 20px;
  border: 1px solid grey;
}
#toolbar-view header {
  font-size: 1.4em;
}

#save-toolbar {
  float: right;
}

#tools {
  margin: 20px;
  border: 1px solid lightgrey;
}
</style>

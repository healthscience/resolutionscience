<template>
  <div id="science-list">
  <header>SCIENCE</header>
    <li v-for="sci in science">
      <header>{{ sci.text }} <a href="" @click.prevent="viewScienceDetail(sci)" id="view-details">View details</a> </header>
      <div id="description">
        <header class="science-part">Description</header>
        {{ sci.description }}
      </div>
      <div id="science-details" v-if="sci.active">
      <div id="sensors">
        <header class="science-part">Sensors / DataType</header>
        <div id="sensor-type">
          DataType <a id="" href="http://healthscience.network/heartchain/da-hc-773355992211" >heartchain/activity/steps</a>
        </div>
        <div id="sensor-type">
          DataType <a id="" href="http://healthscience.network/heartchain/da-hc-773355992211" >heartchain/heart/bpm</a>
        </div>
      </div>
      <div id="computations">
        <header class="science-part">Computations</header>
        <div id="compute-location">
          WASM File ->   github ->  IPFS ->   Smart Contract ->
        </div>
        <div id="compute-analysis">
          Simulation Status - Training: live  Predictions: Awaiting task
        </div>
      </div>
      <div id="vis-sim">
        <header class="science-part">Visualisation / Simulation</header>
        <div id="vis-location">
          Simulation - webGL
        </div>
      </div>
      <div id="outcome-oracle">
        <header class="science-part">Outcome Oracle</header>
        <div id="oracle-type">
          Open -> Blind -> Review ->
        </div>
      </div>
    </div>
    </li>
  </div>
</template>

<script>
  export default {
    name: 'science-page',
    components: {
    },
    data: () => ({
      liveSafeFlow: {},
      computeFlag: '',
      science: [
        { active: false, text: 'Activity and HR data', description: 'Display of source data from a devies sensors.', value: 'A', cid: 'wasm-sc-1' },
        { active: false, text: 'Average HR', description: 'A statisticial average calculated on BMP and steps on a daily basis.', value: 'B', cid: 'wasm-sc-2' },
        { active: false, text: 'Resting HR Recovery', description: 'The use of bayesian statistical methods to show the time it take for the heart to reach resting heart rate value after activity.', value: 'C', cid: 'wasm-sc-3' },
        { active: false, text: 'error data', description: 'Data Error numbers and statistics', value: 'D', cid: 'wasm-sc-4' },
        { active: false, text: 'HealthSpan', description: 'Combines all network machine learning of the scientific computations to build a simulation of a human heart', value: 'E', cid: 'wasm-sc-5' },
        { active: false, text: 'Statistics Tools', description: 'Statistical tool for categorising self directed science', value: 'F', cid: 'wasm-sc-6' }
      ]
    }),
    created () {
    },
    mounted () {
      this.checkContext()
    },
    computed: {
      system: function () {
        return this.$store.state.system
      },
      safeFlow: function () {
        return this.$store.state.safeFlow
      },
      context: function () {
        return this.$store.state.context
      }
    },
    methods: {
      checkContext () {
        // let startContext = this.$store.getters.liveContext
        // set devices and sensor from Store
      },
      viewScienceDetail (sciIN) {
        if (sciIN.active === true) {
          sciIN.active = false
        } else if (sciIN.active === false) {
          sciIN.active = true
        }
      }
    }
  }
</script>

<style>
#science-list header {
  margin: 0.4em;
  font-weight: bold;
  font-size: 1.2em;
}

#view-details header {
  font-weight: bold
}
</style>

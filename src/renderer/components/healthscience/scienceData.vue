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
          DataType <a id="" href="http://healthscience.network/heartchain/da-hc-773355992213" >heartchain/heart/bpm</a>
        </div>
      </div>
      <div id="computations">
        <header class="science-part">Computations</header>
        <div id="compute-location">
          {{ sci.wasm }} WASM File ->   github ->  IPFS ->   Smart Contract ->
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
      computeFlag: ''
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
      },
      science: function () {
        return this.$store.state.science
      }
    },
    methods: {
      checkContext () {
        // let startContext = this.$store.getters.liveContext
        // set devices and sensor from Store
      },
      scienceContext () {
        // set the first science priority on start of RS
        this.science = this.$store.getters.liveScience
        this.$store.commit('setScience', this.science[0])
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

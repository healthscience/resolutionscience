<template>
  <div id="science">
    <h1>Science & Computations</h1>
    <button class="" href="" id="add-new-science" @click.prevent="addnewScience()">New Science</button>
    <!-- <section v-if="newScienceSeen" id="new-science"> -->
    <science-contribute  :contributeData="contributeData"></science-contribute>
    <!-- </section>  -->
    <div id="science-compute-status">
      <ul>
        <li>
          <header class="science-start">HealthSpan Heart Simulation</header>
          <div id="description">
            <header class="science-part">Description</header>
            Combines all network machine learning of the scientific computations to build a simulation of a human heart.
          </div>
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
        </li>
        <li>
          <header class="science-start">Heart Rate Recovery</header>
          <div id="description">
            <header class="science-part">Description</header>
            The use of bayesian statistical methods to show the time it take for the heart to reach resting heart rate value after activity.
          </div>
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
              Computation Status - DIY toolkit Learn button  Predictions: coming soon
            </div>
          </div>
          <div id="vis-sim">
            <header class="science-part">Visualisation</header>
            <div id="vis-location">
              Chart and numbers
            </div>
          </div>
          <div id="outcome-oracle">
            <header class="science-part">Outcome Oracle</header>
            <div id="oracle-type">
              Open -> Blind -> Review ->
            </div>
          </div>
        </li>
        <li>
          <header class="science-start">Statistics - average (mean)</header>
          <div id="description">
            <header class="science-part">Description</header>
            A statisticial average calculated on BMP and steps on a daily basis.
          </div>
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
              <a class="" href="" id="update-compute" @click.prevent="startComputeUpdate(updatecompute)" v-bind:class="{ 'active': updatecompute.active}">{{ updatecompute.name }}</a>
              <div id="status-compute" v-if="avgStatusCompute">
                {{ avgStatusCompMessage }}
              </div>
            </div>
          </div>
          <div id="vis-sim">
            <header class="science-part">Visualisation / Simulation</header>
            <div id="vis-location">
              Chart -> Table -> Simulation ->
            </div>
          </div>
          <div id="outcome-oracle">
            <header class="science-part">Outcome Oracle</header>
            <div id="oracle-type">
              Open -> Blind -> Review ->
            </div>
          </div>
        </li>
        <li>
          <header class="science-start">Statistics - correlations</header>
          <div id="description">
            <header class="science-part">Description</header>
            A staticial correlation between BMP and Step activity.
          </div>
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
              <!-- <a class="" href="" id="update-compute" @click.prevent="startComputeUpdate(updatecompute2)" v-bind:class="{ 'active': updatecompute2.active}">{{ updatecompute2.name }}</a>-->
            </div>
          </div>
          <div id="vis-sim">
            <header class="science-part">Visualisation / Simulation</header>
            <div id="vis-location">
              Chart -> Table -> Simulation ->
            </div>
          </div>
          <div id="outcome-oracle">
            <header class="science-part">Outcome Oracle</header>
            <div id="oracle-type">
              Open -> Blind -> Review ->
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
  </div>
</template>

<script>
import SAFEflow from '../safeflow/safeFlow.js'
import scienceContribute from '@/components/healthscience/scienceContribute.vue'

export default {
  name: 'Science',
  components: {
    scienceContribute
  },
  data () {
    return {
      liveFlow: null,
      avgStatusCompute: false,
      avgStatusCompMessage: '',
      newScienceSeen: false,
      contributeData: {},
      updatecompute:
      {
        name: 'Update Computations',
        id: 'update-compute-1',
        active: false
      },
      updatecompute2:
      {
        name: 'Update Computations 2',
        id: 'update-compute-2',
        active: false
      },
      activedevice: '',
      activesensor: '',
      activecompute: '',
      activeupdatecompute: '',
      activeupdatecompute2: '',
      activevis: '',
      computeFlag: ''
    }
  },
  computed: {
    system: function () {
      return this.$store.state.system
    }
  },
  created () {
    this.setAccess()
  },
  methods: {
    setAccess () {
      this.liveFlow = new SAFEflow(this.system)
    },
    startComputeUpdate () {
      this.activedevice = this.$store.getters.liveContext
      console.log('before active device')
      console.log(this.activedevice)
      this.liveFlow.computationSystem('wasm-sc-2', this.activedevice[0].device_mac)
      this.avgStatusCompMessage = 'Average compute is taking place'
      this.avgStatusCompute = true
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
    },
    addnewScience () {
      let scienceStart = {}
      scienceStart.formSeen = true
      this.contributeData = scienceStart
    }
  }
}
</script>

<style>
#science {
  margin: 1em;
}

.science-start{
  font-weight: bold;
  font-size: 1.5em;
}

.science-part {
  font-weight: bold;
  font-size: 1em;
}

#description {
  margin: 1em;
}

#sensors {
  margin: 1em;
}

#sensors header {
  font-weight: bold;
}

#computations {
  margin: 1em;
}

#computations header {
  font-weight: bold;
}

#vis-sim {
  margin: 1em;
}

#vis-sim header {
  font-weight: bold;
}

#outcome-oracle {
  margin: 1em;
}

#outcome-oracle header {
  font-weight: bold;
}
</style>

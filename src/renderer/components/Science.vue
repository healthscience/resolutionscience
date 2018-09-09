<template>
  <div id="science">
    <h1>Science & Computations</h1>
    <div id="science-compute-status">
      <ul>
        <li>
          <header class="science-start">Heart Simulation</header>
          <div id="description">
            <header class="science-part">Description</header>
            A network machine learning simulation of a human heart used to predict heart health.
          </div>
          <div id="sensors">
            <header class="science-part">Sensors / DataType</header>
            <div id="sensor-type">
              DataType <a id="" href="http://healthscience.network/heartchain/da-hc-773355992211" >heartchain/activity/steps</a>
            </div>
            <div id="sensor-type">
              DataType <a id="" href="http://healthscience.network/heartchain/da-hc-773355992211" >heartchain/heart/bmp</a>
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
              DataType <a id="" href="http://healthscience.network/heartchain/da-hc-773355992211" >heartchain/heart/bmp</a>
            </div>
          </div>
          <div id="computations">
            <header class="science-part">Computations</header>
            <div id="compute-location">
              WASM File ->   github ->  IPFS ->   Smart Contract ->
            </div>
            <div id="compute-analysis">
              <a class="" href="" id="update-compute" @click.prevent="startComputeUpdate(updatecompute)" v-bind:class="{ 'active': updatecompute.active}">{{ updatecompute.name }}</a>
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
              DataType <a id="" href="http://healthscience.network/heartchain/da-hc-773355992211" >heartchain/heart/bmp</a>
            </div>
          </div>
          <div id="computations">
            <header class="science-part">Computations</header>
            <div id="compute-location">
              WASM File ->   github ->  IPFS ->   Smart Contract ->
            </div>
            <div id="compute-analysis">
              <a class="" href="" id="update-compute" @click.prevent="startComputeUpdate(updatecompute2)" v-bind:class="{ 'active': updatecompute2.active}">{{ updatecompute2.name }}</a>
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
export default {
  name: 'Science',
  data () {
    return {
      liveFlow: new SAFEflow(),
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
      updatecompute2:
      {
        name: 'Update Computations 2',
        id: 'update-compute-2',
        active: false
      },
      chartmessage: 'Chart Loading',
      activedevice: '',
      activesensor: '',
      activecompute: '',
      activeupdatecompute: '',
      activeupdatecompute2: '',
      activevis: '',
      computeFlag: ''
    }
  },
  created () {
  },
  methods: {
    startComputeUpdate () {
      // this.activedevice = '' // 'F1:D1:D5:6A:32:D6', 'E3:30:80:7A:77:B5', 'C5:4C:89:9D:44:10',  'F3:6E:2A:A7:0F:FB'
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

<template>
  <div id="science">
    <h1>Science & Computations</h1>
    <button class="" href="" id="add-new-science" @click.prevent="addnewScience()">New Science</button>
    <!-- <section v-if="newScienceSeen" id="new-science"> -->
    <science-contribute  :contributeData="contributeData"></science-contribute>
    <science-list></science-list>
  </div>
</template>

<script>
import SAFEflow from '../safeflow/safeFlow.js'
import scienceList from '@/components/healthscience/scienceData.vue'
import scienceContribute from '@/components/healthscience/scienceContribute.vue'

export default {
  name: 'Science',
  components: {
    scienceList,
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
  margin: 2em;
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

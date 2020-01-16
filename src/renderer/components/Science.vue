<template>
  <div id="science">
    <h1>DIY Science & Computations</h1>
    <knowledge-Live :liveData="liveData" ></knowledge-Live>
    <!-- <section v-if="newScienceSeen" id="new-science"> -->
    <!--<science-contribute  :contributeData="contributeData"></science-contribute>-->
    <!--<science-list></science-list>-->
  </div>
</template>

<script>
import scienceList from '@/components/healthscience/scienceData.vue'
import KnowledgeLive from '@/components/toolbar/knowledgeLive'
const moment = require('moment')

export default {
  name: 'Science',
  components: {
    KnowledgeLive,
    scienceList
  },
  data () {
    return {
      liveFlow: null,
      liveData:
      {
        devicesLive: [],
        datatypesLive: [],
        categoryLive: [],
        scienceLive: {},
        languageLive: {},
        timeLive: [],
        resolutionLive: ''
      },
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
  },
  methods: {
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
    learnUpdate (uSeg) {
      let updateTbundle = {}
      let timeAsk = []
      timeAsk.push(uSeg.text)
      updateTbundle.timevis = timeAsk
      updateTbundle.startperiod = 'relative'
      updateTbundle.timeseg = []
      const nowTime = moment()
      let realTime = moment.utc(nowTime)
      let liveBundleUpdate = {}
      liveBundleUpdate.cnrl = this.liveBundle.cnrl
      liveBundleUpdate.language = this.liveBundle.language
      liveBundleUpdate.devices = this.liveBundle.devices
      liveBundleUpdate.datatypes = this.liveBundle.datatypes
      liveBundleUpdate.categories = this.liveBundle.categories
      liveBundleUpdate.science = this.liveBundle.science
      liveBundleUpdate.time = updateTbundle
      liveBundleUpdate.realtime = realTime
      liveBundleUpdate.resolution = this.liveBundle.resolution
      liveBundleUpdate.visualisation = this.liveBundle.visualisation
      this.learnStart(liveBundleUpdate)
    },
    toolsSwitch (tss) {
      if (tss === true) {
        let updateCopyTemp = this.liveDataCollection
        this.liveDataCollection = {}
        let updateOptions = this.liveOptions
        updateOptions.annotation = this.liveAnnotations
        this.liveOptions = updateOptions
        this.liveDataCollection = updateCopyTemp
      } else if (tss === false) {
        this.liveOptions.annotation = {}
      }
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

<template>
  <div id="nxp-diy-science">
    <h1>DIY TOOLKIT</h1>
    <nxp-controls></nxp-controls>
    <div v-if="NXPnew">
      <nxp-template></nxp-template>
    </div>
    <div v-if="NXPlive"> {{ NXPlive }}
      <!--<nxp-existing></nxp-existing> -->
      <nxp-question></nxp-question>
      <nxp-compute></nxp-compute>
      <!-- <nxp-outcome></nxp-outcome> -->
      <!-- <nxp-data></nxp-data> -->
      <knowledge-Live :liveData="liveData" ></knowledge-Live>
      <nxp-visualise></nxp-visualise>
      <nxp-communicate></nxp-communicate>
      <nxp-evolve></nxp-evolve>
    </div>
  </div>
</template>

<script>
import NxpControls from '@/components/healthscience/nxp/NxpControls.vue'
import nxpTemplate from '@/components/healthscience/nxp/nxpTemplate.vue'
import nxpCompute from '@/components/healthscience/nxp/nxpCompute.vue'
import nxpQuestion from '@/components/healthscience/nxp/nxpQuestion.vue'
import KnowledgeLive from '@/components/toolbar/knowledgeLive'
import nxpVisualise from '@/components/healthscience/nxp/nxpVisualise.vue'
import nxpCommunicate from '@/components/healthscience/nxp/nxpCommunicate.vue'
import nxpEvolve from '@/components/healthscience/nxp/nxpEvolve.vue'
const moment = require('moment')

export default {
  name: 'NXP-builder',
  components: {
    NxpControls,
    KnowledgeLive,
    nxpTemplate,
    nxpQuestion,
    nxpCompute,
    nxpVisualise,
    nxpCommunicate,
    nxpEvolve
  },
  computed: {
    system: function () {
      return this.$store.state.system
    },
    NXPlive: function () {
      return this.$store.state.liveNXP
    },
    NXPnew: function () {
      return this.$store.state.newNXP
    }
  },
  data () {
    return {
      liveFlow: null,
      nxpSelected: false,
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
      newNXPSeen: false,
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
  created () {
  },
  methods: {
    selectContext (s) {
      s.active = !s.active
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

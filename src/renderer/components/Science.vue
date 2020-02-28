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
      <!--<nxp-education></nxp-education> -->
      <!--<nxp-app></nxp-app> -->
      <nxp-compute></nxp-compute>
      <nxp-sciencereview></nxp-sciencereview>
      <nxp-control></nxp-control>
      <!--<nxp-errormanagement></nxp-errormanagement> -->
      <nxp-lifestylemedicine></nxp-lifestylemedicine>
      <nxp-prescription></nxp-prescription>
      <nxp-communicate></nxp-communicate>
      <nxp-evolve></nxp-evolve>
    </div>
  </div>
</template>

<script>
import NxpControls from '@/components/healthscience/nxp/NxpControls.vue'
import nxpTemplate from '@/components/healthscience/nxp/nxpTemplate.vue'
import nxpCompute from '@/components/healthscience/nxp/nxpCompute.vue'
import nxpSciencereview from '@/components/healthscience/nxp/nxpSciencereview.vue'
import nxpControl from '@/components/healthscience/nxp/nxpControl.vue'
import nxpQuestion from '@/components/healthscience/nxp/nxpQuestion.vue'
import nxpLifestylemedicine from '@/components/healthscience/nxp/nxpLifestylemedicine.vue'
import nxpPrescription from '@/components/healthscience/nxp/nxpPrescription.vue'
import nxpCommunicate from '@/components/healthscience/nxp/nxpCommunicate.vue'
import nxpEvolve from '@/components/healthscience/nxp/nxpEvolve.vue'

export default {
  name: 'NXP-builder',
  components: {
    NxpControls,
    nxpTemplate,
    nxpQuestion,
    nxpCompute,
    nxpSciencereview,
    nxpControl,
    nxpLifestylemedicine,
    nxpPrescription,
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

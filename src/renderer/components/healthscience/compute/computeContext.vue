<template>
  <div id="compute-context">
    <div id="context-compute" class="context-box">
      <header>Computations - </header>
        <ul>
          <li>
            <select v-model="selectedCompute" @change="updateSciDTs(selectedCompute)">
            <option class="science-compute" v-for="comp in nxpComputes" v-bind:value="comp.prime.cnrl">
              {{ comp.prime.text }}
            </option>
          </select>
          </li>
          <li>
            <!-- <a href="" id="liveScience.livingpaperLiving" @click.prevent="livingPaper()">Paper: </a> -->
          </li>
        </ul>
    </div>
    <compute-controls></compute-controls>
    <div id="compute-controls-setup">
      <header>Control panel setup </header>
    </div>
    <div class="clear-compute"></div>
  </div>
</template>

<script>
  import liveMixinSAFEflow from '@/mixins/safeFlowAPI'
  import computeControls from './computeControls.vue'
  // import { kBus } from '../../../main.js'

  export default {
    name: 'compute-panel',
    components: {
      computeControls
    },
    props: {
    },
    computed: {
      nxpComputes: function () {
        return this.$store.state.compute
      }
    },
    data () {
      return {
        selectedCompute: 'A'
      }
    },
    created () {
    },
    mounted () {
    },
    mixins: [liveMixinSAFEflow],
    methods: {
      updateSciDTs (sciIN) {
        this.activeEntity = sciIN
        // use cid to look up datatype for this scienceEntities
        // let sciDTypesSelect = {} // this.GETcnrlScienceDTs(sciIN)
        // sciDTypesSelect.cnrl = sciIN
        // this.scidtypes = sciDTypesSelect.datatypes
        // this.cdtypes = sciDTypesSelect.categories
        // this.liveScience.livingpaper = sciDTypesSelect.contract.livingpaper
        // kBus.$emit('setVScience', sciDTypesSelect.contract)
      }
    }
  }
</script>

<style>
#select-compute {
  float: right;
}

.clear-compute {
  clear: both;
}
</style>

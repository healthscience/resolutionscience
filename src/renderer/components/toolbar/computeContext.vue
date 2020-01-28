<template>
  <div id="compute-context">
    <div id="select-knowledge">
      <a href="" id="open-knowledge" @click.prevent="openCompute(oc)">{{ oc.name }}</a>
    </div>
    <div id="comupte-boxes" v-if="oc.active">
      <div id="context-science" class="context-box">
        <header>Computations - </header>
          <ul>
            <li >
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
    </div>
  </div>
</template>

<script>
  import liveMixinSAFEflow from '@/mixins/safeFlowAPI'
  import { kBus } from '../../main.js'

  export default {
    name: 'knowledge-context',
    components: {
    },
    props: {
      cContext: {
        type: Object
      }
    },
    computed: {
      nxpComputes: function () {
        return this.$store.state.compute
      }
    },
    data () {
      return {
        oc:
        {
          name: 'open compute',
          id: 'compute-status',
          active: false
        },
        selectedCompute: 'A',
        sciencedataMapping: {}
      }
    },
    created () {
      this.setAccess()
    },
    mounted () {
    },
    mixins: [liveMixinSAFEflow],
    methods: {
      setAccess () {
        this.scienceContext()
      },
      openCompute (oc) {
        oc.active = !oc.active
        if (oc.active === true) {
          oc.name = 'Close compute'
          // this.$emit('clearKbox')
        } else {
          oc.name = 'Open compute'
        }
      },
      scienceContext () {
        // set the first science priority on start of RS
        this.scoptions = this.$store.getters.liveScience
      },
      updateSciDTs (sciIN) {
        this.activeEntity = sciIN
        // use cid to look up datatype for this scienceEntities
        let sciDTypesSelect = this.GETcnrlScienceDTs(sciIN)
        sciDTypesSelect.cnrl = sciIN
        this.scidtypes = sciDTypesSelect.datatypes
        this.cdtypes = sciDTypesSelect.categories
        // this.liveScience.livingpaper = sciDTypesSelect.contract.livingpaper
        kBus.$emit('setVScience', sciDTypesSelect.contract)
      }
    }
  }
</script>

<style>

</style>

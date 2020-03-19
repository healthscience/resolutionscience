<template>
  <div id="compute-context">
    <div id="live-computes">
      {{ liveCompute.prime.text }}
      <div id="select-compute-options">
        <compute-controls>cc</compute-controls>
      </div>
    </div>
    <div class="clear-compute"></div>
    <!-- setup new compuation -->
    <div v-if="liveCompute.edit" id="context-compute" class="compute-code">
      <header>Computations - </header>
        <ul>
          <li>
            <select v-model="selectedCompute" @change="updateSciDTs(selectedCompute)">
            <option class="science-compute" v-for="comp in nxpComputes" v-bind:value="comp.prime.cnrl">
              {{ comp.prime.text }}
            </option>
          </select>
          </li>
          <!-- <li>
            <a href="" id="liveScience.livingpaperLiving" @click.prevent="livingPaper()">Paper: </a>
          </li> -->
      </ul>
    </div>
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
      liveCompute: {
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
        selectedCompute: 'A',
        oc:
        {
          name: 'open compute',
          id: 'compute-status',
          active: false
        }
      }
    },
    created () {
    },
    mounted () {
    },
    mixins: [liveMixinSAFEflow],
    methods: {
    }
  }
</script>

<style>
#view-controls-compute {
  float: right;
  margin-bottom: 10px;
}

#open-compute {
  background-color: #eae6ed;
}

.compute-code {
  display: inline-block;
}

.clear-compute {
  clear: both;
}
</style>

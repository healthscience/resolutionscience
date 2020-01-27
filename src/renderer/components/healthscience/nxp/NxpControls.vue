<template>
  <div id="nxp-toolbar">Controls over NXPs
    <div id="nxp-master-toolbar">
      <select v-model="liveexerimentList" class="button-expadd" href="" id="add-exp-button" @change="selectNXP($event)">
        <option class="science-compute" v-for="expi in liveexerimentList" v-bind:value="expi.prime.cnrl">
          {{ expi.prime.text }}
        </option>
      </select>
      <div class="control-buttons" id="new-button">
        <button v-model="newNXP" class="button-new-nxp" href="" id="new-exp-button" @click.prevent="nxpNew($event)">New</button>
      </div>
      <div class="control-buttons">
    <button v-model="viewCNRL" class="button-view-cnrl" href="" id="cnrl-view-button" @click.prevent="viewCNRLlibrary(viewCNRL)">{{ viewCNRL.name }}</button>
      </div>
      <div class="control-buttons">
        <button v-model="computehist" class="button-view-computelist" href="" id="computelist-view-button" @click.prevent="viewComputeHistory(computehist)">{{ computehist.name }}</button>
      </div>
    </div>
    <cnrl-controls v-if="viewCNRL.active"></cnrl-controls>
    <div id="history" v-if="computehist.active">
      <history-List :historyData="historyData" @setLiveBundle="makeLiveKnowledge"></history-List>
    </div>
  </div>
</template>

<script>
  import cnrlControls from '../cnrl/cnrlControls.vue'
  import historyList from '@/components/healthscience/historyList.vue'

  export default {
    name: 'nxp-controls',
    components: {
      cnrlControls,
      historyList
    },
    data () {
      return {
        saveExpKid:
        {
          active: false,
          text: ''
        },
        newNXP:
        {
          active: false,
          text: 'NXP'
        },
        viewCNRL:
        {
          active: false,
          name: 'view CNRL'
        },
        CNRLdata: [],
        computehist:
        {
          name: 'View compute list',
          id: 'learn-history',
          active: false
        }
      }
    },
    created () {
    },
    mounted () {
    },
    computed: {
      liveexerimentList: function () {
        return this.$store.state.experimentList
      },
      historyData: function () {
        return this.$store.state.startBundles
      }
    },
    methods: {
      selectNXP (exB) {
        // dispatch select to store
        this.$store.dispatch('actionSetNXP', exB.target.value)
        // this.selectedExperiment = exB.target.value
      },
      viewCNRLlibrary (cnrlv) {
        console.log('view the CNRL to add view delelte etc')
        console.log(cnrlv)
        cnrlv.active = !cnrlv.active
        if (cnrlv.active === true) {
          this.viewCNRL.name = 'Close CNRL'
        } else {
          this.viewCNRL.name = 'View CNRL'
        }
      },
      viewComputeHistory (hist) {
        console.log(hist)
        hist.active = !hist.active
        if (hist.active === true) {
          this.computehist.name = 'Close compute list'
        } else {
          this.computehist.name = 'View compute list'
        }
        this.$emit('viewHistory', hist)
      }
    }
  }
</script>

<style>
.control-buttons {
  display: inline-block;
}
</style>

<template>
  <div id="experiment-view">EXPERIMENTS
    <ul v-if="experimentData.length !== 0" >
      <li id="experiment-item" v-for="(exp, index) in experimentData">
        <div id="live-experiment-elements">
          <div id="select-ebox" class="live-element">
            <div id="select-ebox-container">
              <div id="select-status">
                <header>Select</header>
                <input type="checkbox" v-bind:id="exp.cnrl" v-bind:value="exp.cnrl" v-model="eboxSelect" @change="makeELive($event)" >
                <label for="e-select">{{ }}</label>
              </div>
            </div>
          </div>
          <div id="context-experiment" class="live-element">
            <header>Status:</header>
            <div class="live-item">
              NOT live
            </div>
          </div>
          <div id="context-experiment" class="live-element">
            <header>Name:</header>
            <div class="live-item">
              {{ exp.contract.prime.text }}
            </div>
          </div>
          <div id="context-experiment" class="live-element">
            <header>Description:</header>
            <div class="live-item">
              Understanding the network of life
            </div>
          </div>
          <div id="context-experiment" class="live-element">
            <header>Author:</header>
            <div class="live-item">
              Pubkey:    Privacy: annon
            </div>
          </div>
          <div id="context-experiment" class="live-element">
            <header>Participation:</header>
            <div class="live-item">
              N=1
            </div>
          </div>
          <div id="experiment-close"></div>
        </div>
        <edashboard :progressMessageIN="setprogressMessage" :dashCNRL="exp.cnrl" :experimentDash="eKBundle[exp.cnrl]"></edashboard>
      </li>
    </ul>
  </div>
</template>

<script>
  import liveMixinSAFEflow from '@/mixins/safeFlowAPI'
  import edashboard from '@/components/healthscience/edashBoard'

  export default {
    name: 'experiment-history',
    components: {
      edashboard
    },
    props: {
      experimentData: {
        type: Array
      }
    },
    mixins: [liveMixinSAFEflow],
    data () {
      return {
        eboxSelect: [],
        eKBundle: {},
        setprogressMessage:
        {
          active: false,
          cnrl: '',
          text: 'Preparing visualisation'
        }
      }
    },
    created () {
    },
    computed: {
      activeKentities: function () {
        return this.$store.state.activeKentities
      },
      startBundlesList: function () {
        return this.$store.state.startBundles
      },
      experimentList: function () {
        return this.$store.state.experimentList
      }
    },
    mounted () {
      // this.makeLiveProgress()
    },
    methods: {
      async makeELive (status) {
        let expCNRL = status.target.id
        let expStateLive = this.experimentState(expCNRL)
        // are any of the other experiments OPEN?  If so keep them open
        if (status.target.checked === true) {
          this.makeLiveProgress(expCNRL)
          let learnDlist = await this.learnWork(expCNRL)
          this.updateStoreExpStateTrue(expCNRL, expStateLive, learnDlist)
          this.stopLiveProgress(expCNRL)
        } else {
          this.updateStoreExpStateFalse(expCNRL, expStateLive)
        }
      },
      async learnWork (expCNRL) {
        // let mappedExpENTs = this.$store.getters.liveKentities
        let currentEntities = this.startBundlesList
        let liveBundles = this.activeKentities[expCNRL]
        let prepareDashList = []
        for (let expEB of liveBundles) {
          for (let iee of currentEntities) {
            if (expEB === iee.kbid) {
              let visDataBack = await this.learnStart(iee)
              prepareDashList.push(visDataBack)
            }
          }
        }
        return prepareDashList
      },
      experimentState (expCNRL) {
        let listExperimentsState = this.experimentList
        // match to contract CNRL
        let liveContract = {}
        for (let lx of listExperimentsState) {
          if (lx.cnrl === expCNRL) {
            liveContract = lx
          }
        }
        return liveContract
      },
      updateStoreExpStateTrue (expCNRL, expStateLive, learnDlist) {
        let expState = {}
        expState.cnrl = expCNRL
        expState.view = true
        expState.dashKBlist = learnDlist
        expState.contract = expStateLive.contract
        this.$store.dispatch('actionUpdateExperiment', expState)
        this.eKBundle = this.$store.getters.liveExperiment
      },
      updateStoreExpStateFalse (expCNRL, expStateLive) {
        let expState = {}
        expState.cnrl = expCNRL
        expState.view = false
        expState.dashKBlist = []
        expState.contract = expStateLive.contract
        this.$store.dispatch('actionUpdateExperimentC', expState)
        this.eKBundle = this.$store.getters.liveExperiment
      },
      makeLiveProgress (pcnrl) {
        this.setprogressMessage.active = true
        this.setprogressMessage.cnrl = pcnrl
      },
      stopLiveProgress (pcnrl) {
        this.setprogressMessage.active = false
        this.setprogressMessage.cnrl = pcnrl
      }
    }
  }
</script>

<style>
#experiment-item {
  border: 2px solid lightgrey;
  background-color: #EBE7E0;
  display: block;
  margin: 2em;
}

.live-element {
  display: inline-block;
  margin: 10px;
}
.live-eelement {
  float: left;
  margin-left: 2em;
}

#experiment-close {
  clear: both;
}
</style>

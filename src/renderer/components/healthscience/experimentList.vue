<template>
  <div id="experiment-view">
    <ul v-if="KLexperimentData.length !== 0" >
      <li id="experiment-item" v-for="(exp, index) in KLexperimentData">
        <div id="live-experiment-elements">
          <div id="select-ebox" class="live-expelement">
            <div id="select-ebox-container">
              <div id="select-status" class="exp-item">
                <header>Select</header>
                <input type="checkbox" v-bind:id="exp.prime.cnrl" v-bind:value="exp.prime.cnrl" v-model="eboxSelect" @change="makeELive($event)" >
                <label for="e-select">{{ }}</label>
              </div>
            </div>
          </div>
          <div id="context-experiment" class="live-expelement">
            <header>Status:</header>
            <div class="live-expitem">
              NOT live
            </div>
          </div>
          <div id="context-experiment" class="live-expelement">
            <header>Name:</header>
            <div class="live-expitem">
              {{ exp.prime.text }}
            </div>
          </div>
          <div id="context-experiment" class="live-expelement">
            <header>Description:</header>
            <div class="live-expitem">
              Understanding the network of life
            </div>
          </div>
          <div id="context-experiment" class="live-expelement">
            <header>Author:</header>
            <div class="live-expitem">
              Pubkey:    Privacy: annon
            </div>
          </div>
          <div id="context-experiment" class="live-expelement">
            <header>Participation:</header>
            <div class="live-expitem">
              N=1
            </div>
          </div>
          <div id="experiment-close"></div>
        </div>
        <edashboard v-if="eKBundle[exp.prime.cnrl] || progressMessageIN[exp.prime.cnrl]" :dashCNRL="exp.prime.cnrl" :experimentDash="eKBundle[exp.prime.cnrl]" ></edashboard>
      </li>
    </ul>
  </div>
</template>

<script>
  import liveMixinSAFEflow from '@/mixins/safeFlowAPI'
  import edashboard from '@/components/healthscience/edashBoard'

  export default {
    name: 'experiment-list',
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
        liveExpActive: '',
        liveExpStateObject: {},
        CNRLactiveList: [],
        eKBundle: {}
      }
    },
    created () {
    },
    computed: {
      KLexperimentData: function () {
        return this.$store.state.experimentList
      },
      activeKentities: function () {
        return this.$store.state.activeKentities
      },
      startBundlesList: function () {
        return this.$store.state.startBundles
      },
      experimentList: function () {
        return this.$store.state.experimentList
      },
      progressMessageIN: function () {
        return this.$store.state.experimentProgressStatus
      }
    },
    mounted () {
    },
    methods: {
      async makeELive (status) {
        let expCNRL = status.target.id
        this.liveExpActive = expCNRL
        let expStateLive = this.experimentState(expCNRL)
        // are any of the other experiments OPEN?  If so keep them open
        if (this.activeKentities[expCNRL].length > 0) {
          if (status.target.checked === true) {
            this.setProgressMessage(expCNRL)
            let expDataFresh = await this.learnWork(expCNRL, expStateLive)
            let expState = {}
            expState.cnrl = expCNRL
            expState.status = true
            expState.dashKBlist = expDataFresh
            expState.contract = expStateLive
            this.$set(this.eKBundle, expCNRL, expState)
            this.StopprogressMessage(expCNRL)
          } else {
            // this.removeCNRLlist(expCNRL)
            let expState = {}
            expState.cnrl = expCNRL
            expState.status = false
            expState.dashKBlist = []
            expState.contract = expStateLive
            this.$set(this.eKBundle, expCNRL, expState)
          }
        } else {
          console.log('nothing set to show')
        }
      },
      async learnWork (expCNRL, expStateLive) {
        let prepareDashList = []
        let currentEntities = this.startBundlesList
        let liveBundles = this.activeKentities[expCNRL]
        // console.log(currentEntities)
        // console.log(liveBundles)
        for (let expEB of liveBundles) {
          for (let iee of currentEntities) {
            if (expEB === iee.kbid) {
              if (iee) {
                let visDataBack = await this.learnStart(iee)
                prepareDashList.push(visDataBack)
              } else {
                // updateStatus = false
              }
            }
          }
        }
        return prepareDashList
      },
      experimentState (expCNRL) {
        // match to contract CNRL
        let liveContract = {}
        for (let lx of this.experimentList) {
          if (lx.prime.cnrl === expCNRL) {
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
        expState.contract = expStateLive
        // this.$store.dispatch('actionUpdateExperiment', expState)
      },
      updateStoreExpStateFalse (expCNRL, expStateLive) {
        let expState = {}
        expState.cnrl = expCNRL
        expState.view = false
        expState.dashKBlist = []
        expState.contract = expStateLive
        // this.$store.dispatch('actionUpdateExperimentC', expState)
        return true
      },
      setProgressMessage (CNRL) {
        let progressSet = {}
        progressSet.active = true
        progressSet.cnrl = CNRL
        progressSet.text = 'Preparing visualisation'
        this.$store.dispatch('actionExperimentProgressStatus', progressSet)
      },
      StopprogressMessage (CNRL) {
        let progressSet = {}
        progressSet.active = false
        progressSet.cnrl = CNRL
        progressSet.text = 'Preparing visualisation'
        this.$store.dispatch('actionExperimentProgressStatusFalse', progressSet)
      },
      removeCNRLlist (expCNRL) {
        let updateCNRLlist = []
        for (let exc of this.CNRLactiveList) {
          if (exc !== expCNRL) {
            updateCNRLlist.push()
          }
        }
        this.CNRLactiveList = updateCNRLlist
      },
      leaveClearExpClose () {
        // set experiment and progress Status to false
        for (let expCNRL of this.CNRLactiveList) {
          let expStateLive = this.experimentState(expCNRL)
          this.updateStoreExpStateFalse(expCNRL, expStateLive)
          // this.StopprogressMessage(expCNRL)
        }
      }
    },
    beforeDestroy: function () {
      console.log('leaving page')
      this.leaveClearExpClose()
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

.live-expelement {
  display: inline-block;
  margin: 10px;
}

.live-expelement header {
  font-weight: normal;
}

.live-expitem {
  font-weight: bold;
  border: 0px solid black;
}

.live-eelement {
  float: left;
  margin-left: 2em;
}

#experiment-close {
  clear: both;
}
</style>

<template>
  <div id="experiment-view">EXPERIMENTS  (+ new)
    <ul v-if="experimentData.length !== 0" >
      <li id="experiment-item" v-for="(exp, index) in experimentData">
        <div id="live-experiment-elements">{{ index }}
          <div id="context-experiment" class="live-eelement">
            <header>Status:</header>
            <div class="live-item">
              NOT live
            </div>
          </div>
          <div id="context-experiment" class="live-eelement">
            <header>Name:</header>
            <div class="live-item">
              {{ exp.contract.prime.text }}
            </div>
          </div>
          <div id="context-experiment" class="live-eelement">
            <header>Description:</header>
            <div class="live-item">
              Understanding the network of life
            </div>
          </div>
          <div id="context-experiment" class="live-eelement">
            <header>Author:</header>
            <div class="live-item">
              Pubkey:    Privacy: annon
            </div>
          </div>
          <div id="context-experiment" class="live-eelement">
            <header>Participation:</header>
            <div class="live-item">
              N=1
            </div>
          </div>
          <div id="select-ebox" class="live-element">
            <div id="select-ebox-container">
              <div id="select-status">
                <header>Select</header>
                <input type="checkbox" v-bind:id="exp.cnrl" v-bind:value="exp.cnrl" v-model="eboxSelect" @change="makeELive($event)">
                <label for="e-select">{{ }}</label>
              </div>
            </div>
          </div>
          <div id="experiment-close"></div>
        </div>
        <edashboard v-bind:dashCNRL="exp.cnrl" v-bind:experimentDash="eKBundle" ></edashboard>
      </li>
    </ul>
  </div>
</template>

<script>
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
    data () {
      return {
        eboxSelect: [],
        eKBundle: {}
      }
    },
    created () {
    },
    computed: {
    },
    mounted () {
    },
    methods: {
      async makeELive (status) {
        console.log('make this Experiment bundle live')
        let expCNRL = status.target.id
        if (status.target.checked === true) {
          // loop over arry of bundles and match bid number and make active
          let expState = {}
          expState.cnrl = expCNRL
          expState.view = true
          this.$store.dispatch('actionUpdateExperiment', expState)
          console.log(this.$store.state.experimentCNRL[expCNRL])
          this.eKBundle = this.$store.state.experimentCNRL[expCNRL]
        } else {
          let expCState = {}
          expCState.cnrl = expCNRL
          expCState.view = false
          this.$store.dispatch('actionUpdateExperiment', expCState)
        }
      }
    }
  }
</script>

<style>
#experiment-item {
  border: 2px solid blue;
  display: block;
  margin: 2em;
}

.live-eelement {
  float: left;
  margin-left: 2em;
}

#experiment-close {
  clear: both;
}
</style>

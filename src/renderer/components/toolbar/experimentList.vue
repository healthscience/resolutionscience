<template>
  <div id="experiment-view">EXPERIMENTS  (+ new)
    <ul>
      <li id="experiment-item" v-for="exp in experimentData">
        <div id="live-experiment-elements">
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
        <edashboard></edashboard>
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
        eboxSelect: []
      }
    },
    created () {
    },
    computed: {
      system: function () {
        return this.$store.state.system
      },
      safeFlow: function () {
        return this.$store.state.safeFlow
      },
      experimentDataR: function () {
        return this.$store.state.experiments
      }
    },
    mounted () {
    },
    methods: {
      async makeELive (status) {
        console.log('make this Experiment bundle live')
        // loop over arry of bundles and match bid number and make active
        let expCNRL = status.target.id
        console.log(expCNRL)
        console.log('match experiment')
        for (let ueb of this.experimentData) {
          if (ueb.cnrl === expCNRL) {
            console.log('match')
            this.$store.dispatch('actionUpdateExperiment', ueb)
          }
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

<template>
  <div id="experiment-view">
    <ul v-if="PeerexperimentData.length !== 0" >
      <li id="experiment-item" v-for="(exp, index) in PeerexperimentData">
        <div id="live-experiment-elements">
          <div id="select-ebox" class="live-expelement">
            <div id="select-ebox-container">
              <div id="select-status" class="exp-item">
                <header>Select</header>
                <input type="checkbox" v-bind:id="exp.prime.cnrl" v-bind:value="exp.prime.cnrl" v-model="eboxSelect" @change="makeDashlive($event)" >
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
        <edashboard :dashCNRL="exp.prime.cnrl"></edashboard>
      </li>
    </ul>
  </div>
</template>

<script>
  import edashboard from '@/components/healthscience/datastructure/edashBoard'

  export default {
    name: 'experiment-list',
    components: {
      edashboard
    },
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
      PeerexperimentData: function () {
        return this.$store.state.experimentList
      },
      activeexperimentStatus: function () {
        return this.$store.state.experimentStatus
      }
    },
    mounted () {
    },
    methods: {
      makeDashlive (ne) {
        console.log('open dashboard me NXP')
        let dashStatus = ne.target.id
        // dispatch a store to prepare data for this dashboard
        this.$store.dispatch('actionDashboardState', dashStatus)
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

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
              {{ exp.prime.text }}
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
          <div id="experiment-close"></div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'experiment-history',
    components: {
    },
    props: {
      experimentData: {
        type: Object
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
      }
    },
    mounted () {
    },
    methods: {
      makeELive (status) {
        console.log('make this Experiment live')
        console.log(status.target.id)
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

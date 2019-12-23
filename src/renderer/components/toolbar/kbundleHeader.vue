<template>
  <div id="live-kbview-header">
    <div id="live-knowledge-bundle-header">
      <!-- <div v-if="liveBundle.languageLive" id="context-language" class="live-kelement">
        Language: <div class="live-item">{{ liveBundle.languageLive.word }}</div>
        <div id="learn-close"></div>
      </div>
      <div v-else id="live-context-language" class="live-kelement">Please set</div> -->
      <div id="live-context-devices" class="live-kelement">
        <header>Devices:</header>
      </div>
      <div id="live-context-datatypes" class="live-kelement">
        <header>X-axis fixed </header>
          <ul>
            <li id="bmp-data-sensor">
              <div class="live-item">Timestamp</div>
            </li>
          </ul>
        <header>Y-axis</header>
      </div>
      <div id="live-context-category" class="live-kelement">
        <header>Category</header>
      </div>
      <div id="context-time" class="live-kelement">
        <header>Time Period:</header>
      </div>
      <div id="context-resolution" class="live-kelement">
        <header>Resolution:</header>
      </div>
    </div>
  </div>
</template>

<script>
  import liveMixinSAFEflow from '@/mixins/safeFlowAPI'

  export default {
    name: 'knowledge-live',
    components: {
    },
    props: {
      liveBundle: {
        type: Object
      }
    },
    computed: {
    },
    data () {
      return {
      }
    },
    created () {
    },
    mounted () {
      let sciStartEmpty = {}
      sciStartEmpty.prime = {'text': 'empty'}
      // this.liveBundle.scienceLive = sciStartEmpty
      this.liveBundle.categoryLive.push({'active': false, 'cnrl': 'none', 'text': 'none'}) // categoryEmpty
      this.setNaveTime()
    },
    mixins: [liveMixinSAFEflow],
    methods: {
    }
  }
</script>

<style>
#live-knowledge-bundle-header {
  border: 0px solid darkgreen;
  margin-bottom: 10px;
}

.live-item {
  font-weight: bold;
  border: 0px solid black;
}
</style>

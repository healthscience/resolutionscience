<template>
  <div id="live-kbview">
    <div id="live-knowledge-bundle">
      <div id="live-context-devices" class="live-kelement">
          <ul>
            <li v-for="dev in liveBundle.devicesLive">
               <div class="live-item">{{ dev.device_name }}</div>
            </li>
          </ul>
          <div v-if="feedback.devices" class="feedback">---</div>
      </div>
      <div id="live-context-datatypes" class="live-kelement">
          <ul>
            <li id="bmp-data-sensor" v-for="dts in liveBundle.datatypesLive">
              <div class="live-item">{{ dts.text }}</div>
            </li>
          </ul>
          <div v-if="feedback.datatypes" class="feedback">---</div>
      </div>
      <div id="live-context-category" class="live-kelement">
          <ul>
            <li id="cat-items" v-for="catL in liveBundle.categoryLive">
              <div class="live-item">{{ catL.text }}</div>
            </li>
          </ul>
          <div v-if="feedback.categories" class="feedback">---</div>
      </div>
      <div id="context-time" class="live-kelement">
          <ul>
            <li v-for="ts in liveBundle.timeLive">
               <div class="live-item">{{ ts }}</div>
            </li>
          </ul>
          <div v-if="feedback.time" class="feedback">---</div>
      </div>
      <div id="context-resolution" class="live-kelement">
          <div class="live-item">{{ liveBundle.resolutionLive }}</div>
          <div v-if="feedback.resolution" class="feedback">---</div>
      </div>
      <knowledge-Context :kContext="liveBundle"></knowledge-Context>
    </div>
  </div>
</template>

<script>
  import liveMixinSAFEflow from '@/mixins/safeFlowAPI'
  import KnowledgeContext from '@/components/toolbar/knowledgeContext'

  export default {
    name: 'knowledge-live',
    components: {
      KnowledgeContext
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
        feedback:
        {
          devices: false,
          datatypes: false,
          categories: false,
          time: false,
          visulisation: false,
          resolution: false
        }
      }
    },
    created () {
    },
    mounted () {
      let sciStartEmpty = {}
      sciStartEmpty.prime = {'text': 'empty'}
      this.liveBundle.scienceLive = sciStartEmpty
      this.liveBundle.categoryLive.push({'active': false, 'cnrl': 'none', 'text': 'none'}) // categoryEmpty
      this.setNaveTime()
    },
    mixins: [liveMixinSAFEflow],
    methods: {
      setNaveTime () {
        this.liveNavTime = this.timeNav('datatime-index')
      }
    }
  }
</script>

<style>
#live-knowledge-bundle {
  border: 2px solid darkgreen;
  margin-bottom: 10px;
}

.live-item {
  font-weight: bold;
  border: 0px solid black;
}

.feedback {
  background-color: red;
  vertical-align: bottom;
}
</style>

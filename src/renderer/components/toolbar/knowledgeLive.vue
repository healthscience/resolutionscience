<template>
  <div id="live-view">
    <div id="live-knowledge-elements">
      <div v-if="liveData.language !== undefine" id="context-language" class="live-element">
        Language: <div class="live-item">{{ liveData.language }}</div>
      </div>
      <div v-else id="live-context-language" class="live-element">Please set</div>
      <div id="live-context-devices" class="live-element">
        <header>Devices:</header>
          <ul>
            <li v-for="dev in liveData.devices">
               <div class="live-item">{{ dev.device_name }}</div>
            </li>
          </ul>
      </div>
      <div id="live-context-datatypes" class="live-element">
        <header>DataTypes - </header>
          <ul>
            <li id="bmp-data-sensor" v-for="sen in liveData.sensors">
              <div class="live-item">{{ sen.text }}</div>
            </li>
          </ul>
      </div>
      <div v-if="liveData.scienceLive.prime !== undefine" id="live-context-science" class="live-element">
        Science - <div class="live-item">{{ liveData.scienceLive.prime[0].text || 'none' }}</div>
      </div>
      <div v-else id="live-context-science" class="live-element">Science: not selected</div>
      <!-- <div id="context-resolution">
        Resolution
      </div>
      <div id="context-time">
        Time:
      </div> -->
      <div id="live-learn">
        <div id="live-learn-container">
          <div id="learn">
            <button class="" href="" id="learn-button" @click.prevent="filterLearn(learn)">{{ learn.name }}</button>
          </div>
        </div>
      </div>
      <div id="learn-close"></div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'knowledge-live',
    components: {
    },
    props: {
      liveData: {
        type: Object
      },
      inputData: {
        type: Object
      }
    },
    data () {
      return {
        live: {},
        liveSummary: '',
        learn:
        {
          name: 'learn',
          id: 'learn-status'
        }
      }
    },
    created () {
      this.liveData.seenStatus = true
    },
    computed: {
      system: function () {
        return this.$store.state.system
      },
      tools: function () {
        return this.$store.state.tools
      }
    },
    mounted () {
      this.startTools()
    },
    methods: {
      startTools () {
        this.liveTools = this.$store.getters.liveTools
      },
      async filterLearn (s) {
        console.log(s)
        // get language, device, datatypes and sci comp bundles
        // pass on to SAFEflow to pass on entity manager
        let liveBundle = {}
        liveBundle.language = this.liveData.language
        liveBundle.devices = this.liveData.devices
        liveBundle.datatypes = this.liveData.sensors
        liveBundle.science = this.liveData.scienceLive
        console.log(liveBundle)
        // let entityBegin = await this.liveSafeFlow.scienceEntities()
        // console.log(entityBegin)
      }
    }
  }
</script>

<style>
#live-view {
  border: 2px solid lightgrey;
  margin-left: 1em;
}

.live-element {
  float: left;
  min-width: 120px;
}

.live-item {
  font-weight: bold;
}
#learn-close {
  clear:both;
}

#learn-button {
  font-size: 1.6em;
  padding: .25em;

}
</style>

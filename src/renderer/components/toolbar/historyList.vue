<template>
  <div id="history-view">HISTORY
  <ul>
    <li id="data-type-history" v-for="lh in historyData">
      <div id="live-knowledge-elements">
        <div id="context-language" class="live-element">
          Language: <div class="live-item">{{ lh.language.word }}</div>
        </div>
        <div id="live-context-devices" class="live-element">
          <header>Devices:</header>
            <ul>
              <li v-for="dev in lh.devices">
                 <div class="live-item">{{ dev.device_name }}</div>
              </li>
            </ul>
        </div>
        <div id="live-context-datatypes" class="live-element">
          <header>DataTypes - </header>
            <ul>
              <li id="bmp-data-sensor" v-for="dts in lh.datatypes">
                <div class="live-item">{{ dts.text }}</div>
              </li>
            </ul>
        </div>
        <div id="history-context-science" class="live-element">
          Science - <div class="live-item">{{ lh.science.prime.text }}</div>
        </div>
        <div id="context-time" class="live-element">
          <header>Time:</header>
            <ul>
              <li v-for="ts in lh.time">
                 <div class="live-item">{{ ts }}</div>
              </li>
            </ul>
        </div>
        <div id="context-resolution" class="live-element">
          <header>Resolution:</header>
            <div class="live-item">{{ lh.resolution }}</div>
        </div>
        <div id="open-on-start" class="live-element">
          <div id="start-learn-container">
            <div id="start-status">
              Start ON/OFF
            </div>
          </div>
        </div>
        <div id="learn-close"></div>
      </div>
    </li>
  </ul>
  </div>
</template>

<script>
  export default {
    name: 'knowledge-live',
    components: {
    },
    props: {
      historyData: {
        type: Object
      }
    },
    data () {
      return {
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
      viewHistory (hist) {
        hist.active = !hist.active
        if (hist.active === true) {
          hist.name = 'Close history'
        } else {
          hist.name = 'View history'
        }
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

#history {
  border: 2px solid purple;
  margin-top: 2em;
}

#data-type-history {
  margin:1em;
}
</style>

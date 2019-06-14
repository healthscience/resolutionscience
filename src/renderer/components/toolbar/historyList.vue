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
              <li>
                <header>Category</header>
                  <div id="live-context-category" class="live-element">
                    <ul>
                      <li id="cat-items" v-for="catL in lh.categories">
                        <div class="live-item">{{ catL.text }}</div>
                      </li>
                    </ul>
                  </div>
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
              <header>View on Start</header>
              <a href="" id="start-save" v-bind:id="lh.bid" @click.prevent="startStatus(lh.startStatus, $event)" v-bind:class="{ 'active': lh.startStatus.active}">{{ lh.startStatus.name }}</a>
            </div>
          </div>
        </div>
        <div id="publish-dapp" class="live-element">
          <div id="dapp-publish-container">
            <div id="dapp-status">
              <header>Publish Dapp</header>
              Y / N
            </div>
          </div>
        </div>
        <div id="select-kbox" class="live-element">
          <div id="select-kbox-container">
            <div id="select-status">
              <header>Select</header>
              <input type="checkbox" v-bind:id="lh.cnrl" v-bind:value="lh.bid" v-model="kboxSelect" @change="makeKLive($event)">
              <label for="k-select">{{ kboxSelect }} {{ lh.bid }} </label>
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
  import { sBus } from '../../main.js'

  export default {
    name: 'knowledge-history',
    components: {
    },
    props: {
      historyData: {
        type: Array
      }
    },
    data () {
      return {
        kboxSelect: []
      }
    },
    created () {
      this.startKup()
    },
    computed: {
      system: function () {
        return this.$store.state.system
      },
      safeFlow: function () {
        return this.$store.state.safeFlow
      },
      startK: function () {
        return this.$store.state.startBundles
      },
      bundleCounter: function () {
        return this.$store.state.bundleCounter
      }
    },
    mounted () {
    },
    methods: {
      startKup () {
        console.log('start settings KKKK')
        console.log(this.startK)
        if (this.startK.length > 0) {
          this.$store.dispatch('actionSortSKB')
          console.log('post sort')
          this.historyData = this.$store.getters.startBundlesList
        }
      },
      async makeKLive (status) {
        console.log('make this knowledge bundle live')
        // loop over arry of bundles and match bid number and make active
        for (let ukb of this.historyData) {
          let makeInt = parseInt(status.target.value)
          if (ukb.bid === makeInt) {
            console.log('match')
            console.log(this.historyData[ukb.bid])
            this.$emit('setLiveBundle', this.historyData[ukb.bid])
            // return true
          }
        }
      },
      startStatus (lss, se) {
        // change start status and save or delete settings
        console.log('save start status')
        let startInt = parseInt(se.target.id)
        this.$store.dispatch('actionUpdateBundleItem', startInt)
        let updateBundle = this.$store.getters.startBundlesList
        for (let iB of updateBundle) {
          if (iB.bid === startInt) {
            sBus.$emit('saveLBundle', iB)
          }
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

#data-type-history {
  margin:1em;
}
</style>

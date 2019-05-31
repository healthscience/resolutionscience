<template>
  <div id="live-view">
    <div id="live-knowledge-elements">
      <div v-if="liveData.languageLive !== undefine" id="context-language" class="live-element">
        Language: <div class="live-item">{{ liveData.languageLive.word }}</div>
      </div>
      <div v-else id="live-context-language" class="live-element">Please set</div>
      <div id="live-context-devices" class="live-element">
        <header>Devices:</header>
          <ul>
            <li v-for="dev in liveData.devicesLive">
               <div class="live-item">{{ dev.device_name }}</div>
            </li>
          </ul>
      </div>
      <div id="live-context-datatypes" class="live-element">
        <header>DataTypes - </header>
          <ul>
            <li id="bmp-data-sensor" v-for="dts in liveData.datatypesLive">
              <div class="live-item">{{ dts.text }}</div>
            </li>
          </ul>
      </div>
      <div v-if="liveData.scienceLive.prime !== undefine" id="live-context-science" class="live-element">
        Science - <div class="live-item">{{ liveData.scienceLive.prime.text || 'none' }}</div>
      </div>
      <div v-else id="live-context-science" class="live-element">Science: not selected</div>
      <div id="context-time" class="live-element">
        <header>Time:</header>
          <ul>
            <li v-for="ts in liveData.timeLive">
               <div class="live-item">{{ ts }}</div>
            </li>
          </ul>
      </div>
      <div id="context-resolution" class="live-element">
        <header>Resolution:</header>
          <div class="live-item">{{ liveData.resolutionLive }}</div>
      </div>
      <div id="live-learn" class="live-element">
        <div id="live-learn-container">
          <div id="learn">
            <button class="" href="" id="learn-button" @click.prevent="filterLearn(learn)">{{ learn.name }}</button>
          </div>
        </div>
      </div>
      <div id="history-learn" class="live-element">
        <div id="history-learn-container">
          <div id="history-view">
            <a href="" id="history-button" @click.prevent="viewHistory(hist)" v-bind:class="{ 'active': hist.active}">{{ hist.name }}</a>
          </div>
        </div>
      </div>
      <div id="experiment-learn" class="live-element">
        <div id="experiment-learn-container">
          <div id="experiment-view">
            <a href="" id="experiment-button" @click.prevent="viewExperiment(exper)" v-bind:class="{ 'active': exper.active}">{{ exper.name }}</a>
          </div>
        </div>
      </div>
      <div id="learn-close"></div>
    </div>
    <div id="experiments" v-if="exper.active">
      <experiment-List :experimentData="liveExper" ></experiment-List>
    </div>
    <div id="history" v-if="hist.active">
      <history-List :historyData="historyData" @setLiveBundle="makeLiveKnowledge"></history-List>
    </div>
  </div>
</template>

<script>
  import experimentList from '@/components/toolbar/experimentList.vue'
  import historyList from '@/components/toolbar/historyList.vue'
  import { kBus } from '../../main.js'
  const moment = require('moment')

  export default {
    name: 'knowledge-live',
    components: {
      experimentList,
      historyList
    },
    props: {
      liveData: {
        type: Object
      }
    },
    data () {
      return {
        learn:
        {
          name: 'learn',
          id: 'learn-status'
        },
        liveSafeFlow: null,
        activeEntity: '',
        activevis: '',
        hist:
        {
          name: 'View history',
          id: 'learn-history',
          active: false
        },
        historyData: [],
        exper:
        {
          name: 'View experiments',
          id: 'learn-experiments',
          active: false
        },
        experimentData: [],
        bundleid: 0
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
      filterLearn (s) {
        // get language, device, datatypes and sci comp bundles
        // pass on to SAFEflow to pass on entity manager
        this.activeEntity = this.liveData.scienceLive.cnrl
        this.activevis = this.$store.getters.liveVis[0]
        console.log('active vis ====')
        console.log(this.activevis)
        const nowTime = moment()
        let realTime = moment.utc(nowTime)
        let startPeriodTime = moment.utc(nowTime).startOf('day')
        let updateTbundle = {}
        updateTbundle.timeseg = this.liveData.timeLive
        updateTbundle.startperiod = startPeriodTime
        updateTbundle.timevis = ['day']
        let liveBundle = {}
        liveBundle.cnrl = this.liveData.scienceLive.cnrl
        liveBundle.language = this.liveData.languageLive
        liveBundle.devices = this.liveData.devicesLive
        liveBundle.datatypes = this.liveData.datatypesLive
        liveBundle.science = this.liveData.scienceLive
        liveBundle.realtime = realTime
        liveBundle.time = updateTbundle
        liveBundle.resolution = this.liveData.resolutionLive
        liveBundle.visualisation = ['vis-sc-1']
        liveBundle.bid = this.bundleid
        this.saveLearnHistory(liveBundle)
        this.$emit('liveLearn', liveBundle)
        // close the knowledge
        kBus.$emit('closeKnowledge')
        this.liveData.datatypesLive = []
      },
      saveLearnHistory (lBundle) {
        console.log('save temp history or keep on network save')
        // save to network  save to LOCAL storage(encrpted???)
        this.bundleid++
        this.historyData.push(lBundle)
      },
      viewHistory (hist) {
        hist.active = !hist.active
        if (hist.active === true) {
          hist.name = 'Close history'
        } else {
          hist.name = 'View history'
        }
      },
      viewExperiment (exper) {
        exper.active = !exper.active
        // query CNRL to get live EXPERIMENTS
        this.$emit('liveExperiments')
        if (exper.active === true) {
          exper.name = 'Close experiment'
        } else {
          exper.name = 'View experiments'
        }
      },
      makeLiveKnowledge (lBund) {
        console.log('make live')
        console.log(lBund)
        this.$emit('liveLearn', lBund)
      },
      listenKbus () {
        console.log(kBus)
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

#experiments {
  border: 2px solid orange;
  margin-top: 2em;
}

</style>

<template>
<div id="live-view">
    <div id="live-knowledge-elements">
      <div id="context-language" class="live-element">
        Language: <div class="live-item">{{ liveData.languageLive.word }}</div>
      </div>
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
            <li>
              <header>Category</header>
                <div id="live-context-category" class="live-element">
                  <ul>
                    <li id="cat-items" v-for="catL in liveData.categoryLive">
                      <div class="live-item">{{ catL.text }}</div>
                    </li>
                  </ul>
                </div>
            </li>
          </ul>
      </div>
      <div id="live-context-science" class="live-element">
        Science - <div class="live-item">{{ liveData.scienceLive.prime.text }}</div>
      </div>
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
      <experiment-List :experimentData="KLexperimentData" ></experiment-List>
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
      },
      KLexperimentData: []
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
        historyData: this.$store.getters.startBundlesList,
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
      kBus.$on('setVLanguage', (ckData) => {
        console.log('select knowlect INNNINIIN')
        console.log(ckData)
        this.languageStatus(ckData)
      })
      kBus.$on('setVDevice', (ckData) => {
        console.log('select knowlect INNNINIIN')
        console.log(ckData)
        this.deviceStatus(ckData)
      })
      kBus.$on('setVDatatypes', (ckData) => {
        console.log('select knowlect INNNINIIN')
        console.log(ckData)
        this.datatypeStatus(ckData)
      })
      kBus.$on('setVScience', (ckData) => {
        console.log('select knowlect INNNINIIN')
        console.log(ckData)
        this.scienceStatus(ckData)
      })
      kBus.$on('setVTime', (ckData) => {
        console.log('select knowlect INNNINIIN')
        console.log(ckData)
        this.timeStatus(ckData)
      })
      kBus.$on('setVResolution', (ckData) => {
        console.log('select knowlect INNNINIIN')
        console.log(ckData)
        this.resolutionStatus(ckData)
      })
      kBus.$on('setVDataCategory', (ckData) => {
        console.log('select knowlect INNNINIIN')
        console.log(ckData)
        this.categoryStatus(ckData)
      })
    },
    computed: {
      system: function () {
        return this.$store.state.system
      },
      safeFlow: function () {
        return this.$store.state.safeFlow
      },
      bundleCounter: function () {
        return this.$store.state.bundleCounter
      }
    },
    mounted () {
      let sciStartEmpty = {}
      sciStartEmpty.prime = {'text': 'empty'}
      this.liveData.scienceLive = sciStartEmpty
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
        liveBundle.startStatus = {'active': false, 'name': 'no'}
        liveBundle.language = this.liveData.languageLive
        liveBundle.devices = this.liveData.devicesLive
        liveBundle.datatypes = this.liveData.datatypesLive
        liveBundle.science = this.liveData.scienceLive
        liveBundle.realtime = realTime
        liveBundle.time = updateTbundle
        liveBundle.resolution = this.liveData.resolutionLive
        liveBundle.visualisation = ['vis-sc-1']
        liveBundle.bid = this.$store.getters.liveBundleCounter
        this.saveLearnHistory(liveBundle)
        this.$emit('liveLearn', liveBundle)
        // close the knowledge
        kBus.$emit('closeKnowledge')
        this.liveData.datatypesLive = []
      },
      saveLearnHistory (lBundle) {
        console.log('save history or keep on network save')
        // save to network  save to LOCAL storage(encrpted???)
        console.log(this.bundleCounter)
        this.$store.commit('setBCounter', this.bundleCounter)
        this.historyData.push(lBundle)
        console.log(this.historyData)
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
        console.log(lBund.cnrl)
        console.log(this.liveData.scienceLive)
        this.liveData.scienceLive = {}
        this.liveData.scienceLive.cnrl = lBund.cnrl
        this.$emit('liveLearn', lBund)
      },
      languageStatus (lIN) {
        console.log('language set in')
        console.log(lIN)
        this.liveData.languageLive = lIN
        console.log(this.liveData.languageLive)
      },
      deviceStatus (dIN) {
        console.log('device set in')
        console.log(dIN)
        this.liveDevice(dIN)
      },
      liveDevice (liveD) {
        console.log('set live device to comp')
        let deviceLive = []
        if (liveD.active === true) {
          deviceLive.push(liveD)
        } else if (liveD.active === false) {
          // remove device
          this.removeLiveElement(liveD.device_mac)
        }
        this.liveData.devicesLive = deviceLive
      },
      datatypeStatus (ldt) {
        console.log('live datatypes')
        this.liveDataTypes(ldt)
      },
      liveDataTypes (liveDT) {
        console.log('set live DT')
        console.log(liveDT)
        if (liveDT.active === true) {
          console.log('true')
          this.liveData.datatypesLive.push(liveDT)
        } else if (liveDT.active === false) {
          // remove device
          console.log('false')
          this.removeLiveDT(liveDT.text)
        }
      },
      removeLiveDT (remove) {
        console.log('remove DT')
        let array = this.liveData.datatypesLive
        function arrayRemove (arr, value) {
          return arr.filter(function (ele) {
            return ele.text !== value
          })
        }
        let result = arrayRemove(array, remove)
        this.liveData.datatypesLive = result
        return true
      },
      scienceStatus (sIN) {
        console.log('science set in')
        console.log(sIN)
        this.liveData.scienceLive = sIN
      },
      timeStatus (tIN) {
        console.log('time set in')
        console.log(tIN)
        if (tIN.active === true) {
          console.log('true')
          this.liveData.timeLive.push(tIN.text)
        } else if (tIN.active === false) {
          // remove device
          console.log('false')
          this.removeLiveTime(tIN)
        }
      },
      removeLiveTime (trIN) {
        console.log('remove time')
        console.log(trIN)
        let removeTimeArr = this.liveData.timeLive.filter(item => item !== trIN.text)
        this.liveData.timeLive = removeTimeArr
      },
      resolutionStatus (rIN) {
        console.log('resolution set in')
        console.log(rIN)
        if (rIN.active === true) {
          console.log('true')
          this.liveData.resolutionLive = rIN.text
        } else if (rIN.active === false) {
          // remove device
          console.log('false')
          this.liveData.resolutionLive = ''
        }
      },
      categoryStatus (catIN) {
        console.log('set catorgy live')
        console.log(catIN)
        // this.liveData.categoryLive = catIN
        if (catIN.active === true) {
          console.log('true')
          this.liveData.categoryLive.push(catIN)
        } else if (catIN.active === false) {
          // remove device
          console.log('false')
          this.removeLiveCat(catIN.text)
        }
      },
      removeLiveCat (remove) {
        console.log('remove DT')
        let array = this.liveData.categoryLive
        function arrayRemove (arr, value) {
          return arr.filter(function (ele) {
            return ele.text !== value
          })
        }
        let result = arrayRemove(array, remove)
        this.liveData.categoryLive = result
        return true
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

#live-context-datatypes li {
  display: block;
  border: 2px solid pink;
}

</style>

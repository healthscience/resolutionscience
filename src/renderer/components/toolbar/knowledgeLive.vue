<template>
  <div id="live-view">
    <div id="live-knowledge-elements">
      <div v-if="liveData.languageLive" id="context-language" class="live-element">
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
      <div v-if="liveData.scienceLive.prime" id="live-context-science" class="live-element">
        Compute - <div class="live-item">{{ liveData.scienceLive.prime.text || 'none' }}</div>
      </div>
      <div v-else id="live-context-science" class="live-element">Compute: not selected</div>
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
      <div id="learn-close"></div>
    </div>
    <knowledge-Context :kContext="kContext"></knowledge-Context>
    <div id="history" v-if="hist.active">
      <history-List :historyData="historyData" @setLiveBundle="makeLiveKnowledge"></history-List>
    </div>
    <progress-Message :progressMessage="entityPrepareStatus"></progress-Message>
    <hsvisual @experimentMap="saveMappingExpKB" @updateLearn="navTimeLearn" :datacollection="liveDataCollection" :options="liveOptions" :displayTime="liveTimeV" :navTime="liveNavTime"></hsvisual>
  </div>
</template>

<script>
  import liveMixinSAFEflow from '@/mixins/safeFlowAPI'
  import KnowledgeContext from '@/components/toolbar/knowledgeContext'
  import historyList from '@/components/toolbar/historyList.vue'
  import progressMessage from '@/components/toolbar/inProgress'
  import hsvisual from '@/components/healthscience/hsvisual'
  import { kBus } from '../../main.js'
  const moment = require('moment')
  const crypto = require('crypto')
  const bs58 = require('bs58')
  const hashObject = require('object-hash')

  export default {
    name: 'knowledge-live',
    components: {
      historyList,
      KnowledgeContext,
      progressMessage,
      hsvisual
    },
    props: {
      liveData: {
        type: Object
      },
      KLexperimentData: null
    },
    data () {
      return {
        learn:
        {
          name: 'learn',
          id: 'learn-status'
        },
        entityPrepareStatus:
        {
          active: false,
          text: 'Preparing visualisation'
        },
        activeEntity: '',
        activevis: '',
        hist:
        {
          name: 'View compute list',
          id: 'learn-history',
          active: false
        },
        historyData: this.$store.getters.startBundlesList,
        experimentData: [],
        bundleuuid: '',
        kContext: {},
        liveDataCollection: {},
        liveOptions: {},
        liveNavTime: [],
        liveTimeV: ''
      }
    },
    created () {
      kBus.$on('setVLanguage', (ckData) => {
        this.languageStatus(ckData)
      })
      kBus.$on('setVDevice', (ckData) => {
        this.deviceStatus(ckData)
      })
      kBus.$on('setVDatatypes', (ckData) => {
        this.datatypeStatus(ckData)
      })
      kBus.$on('setVScience', (ckData) => {
        this.scienceStatus(ckData)
      })
      kBus.$on('setVTime', (ckData) => {
        this.timeStatus(ckData)
      })
      kBus.$on('setVResolution', (ckData) => {
        this.resolutionStatus(ckData)
      })
      kBus.$on('setVDataCategory', (ckData) => {
        this.categoryStatus(ckData)
      })
    },
    computed: {
      bundleCounter: function () {
        return this.$store.state.bundleCounter
      }
    },
    mounted () {
      let sciStartEmpty = {}
      sciStartEmpty.prime = {'text': 'empty'}
      this.liveData.scienceLive = sciStartEmpty
      this.setNaveTime()
    },
    mixins: [liveMixinSAFEflow],
    methods: {
      async filterLearn (s) {
        // close the knowledge
        kBus.$emit('closeKnowledge')
        // get language, device, datatypes and sci comp bundles
        // pass on to SAFEflow to pass on entity manager
        this.activeEntity = this.liveData.scienceLive.prime.cnrl
        this.activevis = this.$store.getters.liveVis[0]
        const nowTime = moment()
        let realTime = moment.utc(nowTime)
        let startPeriodTime = moment.utc(nowTime).startOf('day')
        let updateTbundle = {}
        updateTbundle.timeseg = this.liveData.timeLive
        updateTbundle.startperiod = startPeriodTime
        updateTbundle.timevis = ['day']
        let liveBundle = {}
        liveBundle.cnrl = this.activeEntity
        liveBundle.startStatus = {'active': false, 'name': 'no'}
        liveBundle.language = this.liveData.languageLive
        liveBundle.devices = this.liveData.devicesLive
        liveBundle.datatypes = this.liveData.datatypesLive
        liveBundle.categories = this.liveData.categoryLive
        liveBundle.science = this.liveData.scienceLive
        liveBundle.realtime = realTime
        liveBundle.time = updateTbundle
        liveBundle.resolution = this.liveData.resolutionLive
        liveBundle.visualisation = ['vis-sc-1']
        // liveBundle.bid = this.$store.getters.liveBundleCounter
        // create unquie ID for kbundle and use to save
        let uuidBundle = this.createKBID(liveBundle)
        liveBundle.kbid = uuidBundle
        this.bundleuuid = uuidBundle
        // this.saveLearnHistory(liveBundle)
        this.$store.dispatch('actionStartKBundlesItem', liveBundle)
        // set message to UI IN-progress
        this.entityPrepareStatus.active = true
        let visDataBack = await this.learnStart(liveBundle)
        this.entityPrepareStatus.active = false
        this.liveDataCollection = visDataBack.liveDataCollection
        this.liveOptions = visDataBack.liveOptions
        console.log(visDataBack.kContext)
        this.liveTimeV = visDataBack.kContext.liveTime
        this.liveData.datatypesLive = []
      },
      saveLearnHistory (lBundle) {
        this.historyData.push(lBundle)
      },
      createKBID (addressIN) {
        // hash Object
        let kbundleHash = hashObject(addressIN)
        let tempTokenG = ''
        let salt = crypto.randomBytes(16).toString('base64')
        // let hashs = crypto.createHmac('sha256',salt).update(password).digest('base64')
        let hash = crypto.createHmac('sha256', salt).update(kbundleHash).digest()
        // const bytes = Buffer.from('003c176e659bea0f29a3e9bf7880c112b1b31b4dc826268187', 'hex')
        tempTokenG = bs58.encode(hash)
        // decode
        // const addressde = address
        // const bytes = bs58.decode(addressde)
        // console.log(bytes.toString('base64'))
        return tempTokenG
      },
      viewHistory (hist) {
        hist.active = !hist.active
        if (hist.active === true) {
          hist.name = 'Close compute list'
        } else {
          hist.name = 'View compute list'
        }
      },
      async navTimeLearn (uSeg) {
        let updateTbundle = {}
        // what KID is live?
        let bundList = this.$store.getters.startBundlesList
        for (let ukb of bundList) {
          if (ukb.kbid === this.bundleuuid) {
            updateTbundle = ukb
          }
        }
        let timeAsk = []
        timeAsk.push(uSeg.text)
        updateTbundle.timeseg = timeAsk
        updateTbundle.startperiod = 'relative'
        console.log('nav update bundle')
        console.log(updateTbundle)
        // pass on to learn safeFlow
        this.entityPrepareStatus.active = true
        let visDataBack = await this.learnStart(updateTbundle)
        // remove compute in progress Message
        this.$store.dispatch('actionstopComputeStatus', updateTbundle.kbid)
        this.entityPrepareStatus.active = false
        this.liveDataCollection = visDataBack.liveDataCollection
        this.liveOptions = visDataBack.liveOptions
        this.liveTimeV = visDataBack.kContext.liveTime
      },
      async makeLiveKnowledge (lBund) {
        // set live Bundle for context
        this.bundleuuid = lBund.kbid
        this.$store.dispatch('actionLiveBundle', lBund)
        const nowTime = moment()
        let updatestartPeriodTime = moment.utc(nowTime).startOf('day')
        this.$store.dispatch('actionUpdateStartTime', updatestartPeriodTime)
        this.liveData.scienceLive = {}
        this.liveData.scienceLive.cnrl = lBund.cnrl
        this.entityPrepareStatus.active = true
        let visDataBack = await this.learnStart(lBund)
        // remove compute in progress Message
        this.$store.dispatch('actionstopComputeStatus', lBund.kbid)
        this.entityPrepareStatus.active = false
        this.liveDataCollection = visDataBack.liveDataCollection
        this.liveOptions = visDataBack.liveOptions
        this.liveTimeV = visDataBack.kContext.liveTime
      },
      languageStatus (lIN) {
        this.liveData.languageLive = lIN
      },
      deviceStatus (dIN) {
        this.liveDevice(dIN)
      },
      liveDevice (liveD) {
        let deviceLive = []
        if (liveD.active === true) {
          deviceLive.push(liveD)
        } else if (liveD.active === false) {
          // remove device
          this.removeLiveElement(liveD.device_mac)
        }
        this.liveData.devicesLive = deviceLive
      },
      removeLiveElement (remove) {
        let array = this.liveData.devicesLive
        function arrayRemove (arr, value) {
          return arr.filter(function (ele) {
            return ele.device_mac !== value
          })
        }
        arrayRemove(array, remove)
        return true
      },
      datatypeStatus (ldt) {
        this.liveDataTypes(ldt)
      },
      liveDataTypes (liveDT) {
        if (liveDT.active === true) {
          this.liveData.datatypesLive.push(liveDT)
        } else if (liveDT.active === false) {
          // remove device
          this.removeLiveDT(liveDT.text)
        }
      },
      removeLiveDT (remove) {
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
        this.liveData.scienceLive = sIN
      },
      timeStatus (tIN) {
        if (tIN.active === true) {
          this.liveData.timeLive.push(tIN.text)
        } else if (tIN.active === false) {
          // remove device
          this.removeLiveTime(tIN)
        }
      },
      removeLiveTime (trIN) {
        let removeTimeArr = this.liveData.timeLive.filter(item => item !== trIN.text)
        this.liveData.timeLive = removeTimeArr
      },
      resolutionStatus (rIN) {
        if (rIN.active === true) {
          this.liveData.resolutionLive = rIN.text
        } else if (rIN.active === false) {
          // remove device
          this.liveData.resolutionLive = ''
        }
      },
      categoryStatus (catIN) {
        // this.liveData.categoryLive = catIN
        if (catIN.active === true) {
          this.liveData.categoryLive.push(catIN)
        } else if (catIN.active === false) {
          // remove device
          this.removeLiveCat(catIN.text)
        }
      },
      removeLiveCat (remove) {
        let array = this.liveData.categoryLive
        function arrayRemove (arr, value) {
          return arr.filter(function (ele) {
            return ele.text !== value
          })
        }
        let result = arrayRemove(array, remove)
        this.liveData.categoryLive = result
        return true
      },
      saveMappingExpKB (expMapIN) {
        console.log('prepare and save mapping Experiment to KBundles')
        let mappingEKB = {}
        mappingEKB.experimentCNRL = expMapIN
        mappingEKB.kbid = this.bundleuuid
        this.$store.dispatch('actionExperimentKBundlesItem', mappingEKB)
        this.SaveexperimentKbundles(mappingEKB)
      },
      setNaveTime () {
        this.liveNavTime = this.timeNav('datatime-index')
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
  border-top: 1px solid grey;
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

#live-knowledge-elements {
  background-color: #FBF4A9;
}
</style>

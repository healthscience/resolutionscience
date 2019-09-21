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
        <header>Time Period:</header>
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
    <knowledge-Context :kContext="kContext" @clearKbox="clearKnowledgeBox"></knowledge-Context>
    <div id="history" v-if="hist.active">
      <history-List :historyData="historyData" @setLiveBundle="makeLiveKnowledge"></history-List>
    </div>
    <progress-Message :progressMessage="entityPrepareStatus"></progress-Message>
    <!-- <hsvisual @experimentMap="saveMappingExpKB" @updateLearn="navTimeLearn" :datacollection="liveDataCollection" :options="liveOptions" :displayTime="liveTimeV" :navTime="liveNavTime" :saveExpKid="saveStatusEK"></hsvisual> -->
    <!-- <pastfuture></pastfuture> -->
    <div id="add-experiment">
      Add to experiment. Please select:
      <select v-model="liveexerimentList" @change="addToExperiment($event)">
        <option class="science-compute" v-for="expi in liveexerimentList" v-bind:value="expi.cnrl">
          {{ expi.contract.prime.text }}
        </option>
      </select>
      <div id="add-button">
        <button v-model="liveexerimentList" class="button-expadd" href="" id="add-exp-button" @click.prevent="experADD($event)">Add</button>
        <transition name="fade" >
          <div v-if="saveStatusEK.active === true" id="confirm-add-experiment">{{ saveStatusEK.text }}</div>
        </transition>
      </div>
    </div>
    <multipane class="custom-resizer" layout="vertical">
      <multipane-resizer></multipane-resizer>
      <div class="pane" :style="{ width: '50%', maxWidth: '100%' }">
        <div>
          <hsvisual @experimentMap="saveMappingExpKB" @updateLearn="navTimeLearn" :datacollection="liveDataCollection" :options="liveOptions" :displayTime="liveTimeV" :navTime="liveNavTime"></hsvisual>
        </div>
      </div>
      <multipane-resizer></multipane-resizer>
      <div class="pane" :style="{ flexGrow: 1, width: '10%', maxWidth: '100%' }">
        <div>
          <hsfuturevisual @experimentMap="saveMappingExpKB" @updateLearn="navTimeLearn" :datacollection="liveDataCollection" :options="liveOptions" :displayTime="liveTimeV" :navTime="liveNavTime"></hsfuturevisual>
        </div>
      </div>
    </multipane>
  </div>
</template>

<script>
  import liveMixinSAFEflow from '@/mixins/safeFlowAPI'
  import KnowledgeContext from '@/components/toolbar/knowledgeContext'
  import historyList from '@/components/toolbar/historyList.vue'
  import progressMessage from '@/components/toolbar/inProgress'
  import hsvisual from '@/components/healthscience/hsvisual'
  import hsfuturevisual from '@/components/healthscience/hsfuturevisual'
  import pastfuture from '@/components/healthscience/pastfuture'
  import { Multipane, MultipaneResizer } from 'vue-multipane'
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
      hsvisual,
      hsfuturevisual,
      Multipane,
      MultipaneResizer,
      pastfuture
    },
    props: {
      liveData: {
        type: Object
      },
      KLexperimentData: null
    },
    computed: {
      liveexerimentList: function () {
        return this.$store.state.experimentList
      }
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
        liveTimeV: '',
        timeStateLast: '',
        saveStatusEK: {},
        saveExpKid:
        {
          active: false,
          text: ''
        }
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
    mounted () {
      let sciStartEmpty = {}
      sciStartEmpty.prime = {'text': 'empty'}
      this.liveData.scienceLive = sciStartEmpty
      // let categoryEmpty = {}
      // categoryEmpty.categories = {'active': false, 'cnrl': 'none', 'text': 'none'}
      this.liveData.categoryLive.push({'active': false, 'cnrl': 'none', 'text': 'none'}) // categoryEmpty
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
        // set the Time for bundle
        let timeBundle = this.setTimeBundle()
        // has any category been selected?
        let categoryLive = []
        categoryLive = this.liveData.categoryLive
        let liveBundle = {}
        liveBundle.cnrl = this.activeEntity
        liveBundle.startStatus = {'active': false, 'name': 'no'}
        liveBundle.language = this.liveData.languageLive
        liveBundle.devices = this.liveData.devicesLive
        liveBundle.datatypes = this.liveData.datatypesLive
        liveBundle.categories = categoryLive
        liveBundle.science = this.liveData.scienceLive
        // liveBundle.realtime = timeBundle
        liveBundle.time = timeBundle
        liveBundle.resolution = this.liveData.resolutionLive
        liveBundle.visualisation = ['vis-sc-1']
        // create unquie ID for kbundle and use to save
        let uuidBundle = this.createKBID(liveBundle)
        liveBundle.kbid = uuidBundle
        this.bundleuuid = uuidBundle
        // this.saveLearnHistory(liveBundle)
        this.$store.dispatch('actionStartKBundlesItem', liveBundle)
        // set message to UI IN-progress
        this.entityPrepareStatus.active = true
        console.log('knowleget box bundle')
        console.log(liveBundle)
        let visDataBack = await this.learnStart(liveBundle)
        console.log('data back')
        console.log(visDataBack)
        this.entityPrepareStatus.active = false
        this.liveDataCollection = visDataBack.liveDataCollection
        this.liveOptions = visDataBack.liveOptions
        this.kContext = visDataBack.kContext
        // this.liveTimeV = visDataBack.kContext.liveTime
        this.liveTimeV = visDataBack.displayTime
      },
      setTimeBundle () {
        const nowTime = moment()
        let realTime = moment.utc(nowTime)
        let startPeriodTime = moment.utc(nowTime).startOf('day')
        let updateTbundle = {}
        updateTbundle.realtime = realTime
        updateTbundle.timeseg = this.liveData.timeLive
        updateTbundle.startperiod = startPeriodTime
        updateTbundle.timevis = this.liveData.timeLive
        // this.timeStateLast = startPeriodTime
        return updateTbundle
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
        console.log('time rlearn')
        console.log(uSeg)
        let updateTbundle = {}
        // what KID is live?
        let bundList = this.$store.getters.startBundlesList
        for (let ukb of bundList) {
          if (ukb.kbid === this.bundleuuid) {
            updateTbundle = ukb
          }
        }
        let timeAsk = []
        // did UI give nav segment or date from calendar?
        if (uSeg.text === 'selectd') {
          // convert time to correct format
          timeAsk.push(uSeg.selectDate)
        } else {
          // time setTimeSegments
          timeAsk.push(uSeg.text)
        }
        updateTbundle.time.timeseg = this.liveData.timeLive
        updateTbundle.time.timevis = timeAsk // timeAsk
        updateTbundle.time.startperiod = 'relative'
        updateTbundle.time.laststartperiod = this.liveTimeV
        // pass on to learn safeFlow
        this.entityPrepareStatus.active = true
        let visDataBack = await this.learnStart(updateTbundle)
        console.log('vis data back')
        console.log(visDataBack)
        // remove compute in progress Message
        this.$store.dispatch('actionstopComputeStatus', updateTbundle.kbid)
        this.entityPrepareStatus.active = false
        this.liveDataCollection = visDataBack.liveDataCollection
        this.liveOptions = visDataBack.liveOptions
        this.kContext = visDataBack.kContext
        this.liveTimeV = visDataBack.displayTime
      },
      async makeLiveKnowledge (lBund) {
        // set live Bundle for context
        // first close the computelist
        this.hist.active = false
        this.hist.name = 'View compute list'
        this.bundleuuid = lBund.kbid
        this.$store.dispatch('actionLiveBundle', lBund)
        // update bundle start time
        const nowTime = moment()
        let updatestartPeriodTime = moment.utc(nowTime).startOf('day')
        lBund.time.realtime = updatestartPeriodTime
        this.$store.dispatch('actionUpdateStartTime', updatestartPeriodTime)
        this.$store.dispatch('actionUpdateSciCompute', lBund.cnrl)
        this.entityPrepareStatus.active = true
        // set the active knowledge boxes
        this.setKnowledgtBox(lBund)
        // let updatelBund =
        let visDataBack = await this.learnStart(lBund)
        console.log('data back')
        console.log(visDataBack)
        // remove compute in progress Message
        this.$store.dispatch('actionstopComputeStatus', lBund.kbid)
        this.entityPrepareStatus.active = false
        this.liveDataCollection = visDataBack.liveDataCollection
        this.liveOptions = visDataBack.liveOptions
        this.kContext = visDataBack.kContext
        this.liveTimeV = visDataBack.displayTime
      },
      setKnowledgtBox (liveKbid) {
        // first clear existing knowledge in box
        this.clearKnowledgeBox()
        console.log('kbid setting live K box')
        console.log(liveKbid)
        this.languageStatus(liveKbid.language)
        this.deviceStatus(liveKbid.startStatus)
        for (let dI of liveKbid.devices) {
          this.liveDevice(dI)
        }
        for (let dtI of liveKbid.datatypes) {
          this.datatypeStatus(dtI)
        }
        this.scienceStatus(liveKbid.science)
        console.log('time')
        console.log(liveKbid.time)
        let timeBuild = {}
        timeBuild.active = true
        timeBuild.text = liveKbid.time.timeseg[0]
        this.timeStatus(timeBuild)
        let resolutionBuild = {}
        resolutionBuild.active = true
        resolutionBuild.text = liveKbid.resolution
        this.resolutionStatus(resolutionBuild)
        let categoriesBuild = {}
        categoriesBuild.active = true
        categoriesBuild.cnrl = liveKbid.categories[0].cnrl
        categoriesBuild.text = liveKbid.categories[0].text
        this.categoryStatus(categoriesBuild)
      },
      clearKnowledgeBox () {
        // but set category and compute variables
        this.liveData.languageLive = ''
        this.liveData.devicesLive = []
        this.liveData.datatypesLive = []
        this.liveData.scienceLive = ''
        this.liveData.resolutionLive = ''
        this.liveData.timeLive = []
        this.liveData.categoryLive = []
        // set defaults
        let sciStartEmpty = {}
        sciStartEmpty.prime = {'text': 'empty'}
        this.liveData.scienceLive = sciStartEmpty
        this.liveData.categoryLive.push({'active': false, 'cnrl': 'none', 'text': 'none'}) // categoryEmpty
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
        console.log(sIN)
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
        this.liveData.categoryLive = []
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
        if (result.length === 0) {
          result.push({'active': false, 'cnrl': 'none', 'text': 'none'})
        }
        this.liveData.categoryLive = result
        return true
      },
      async saveMappingExpKB (expMapIN) {
        let mappingEKB = {}
        mappingEKB.experimentCNRL = expMapIN
        mappingEKB.kbid = this.bundleuuid
        this.$store.dispatch('actionExperimentKBundlesItem', mappingEKB)
        let saveEK = await this.SaveexperimentKbundles(mappingEKB)
        if (saveEK.save === 'expkbundle') {
          this.saveStatusEK = {'active': true, 'text': 'saved'}
        }
      },
      setNaveTime () {
        this.liveNavTime = this.timeNav('datatime-index')
      },
      addToExperiment (exB) {
        console.log('add to expet')
        this.selectedExperiment = exB.target.value
      },
      experADD (expA) {
        // need to keep permanent store of experiments to Ecomponents linked (save, delete, update also)
        console.log('add save to dashboard')
        const localthis = this
        this.saveMappingExpKB(this.selectedExperiment)
        // this.$emit('experimentMap', this.selectedExperiment)
        setTimeout(function () {
          localthis.saveStatusEK.active = false
        }, 3000) // hide the message after 3 seconds
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
  border: 2px solid green;
  margin-top: 2em;
}

#live-context-datatypes li {
  display: block;
  border: 2px solid pink;
}

#live-knowledge-elements {
  background-color: #FBF4A9;
}

#add-exp-button {
  font-size: 1.4em;
  padding-left: 8px;
  padding-right: 8px;
}

.tg  {border-collapse:collapse;border-spacing:0;}
.tg td{width:40px;font-family:Arial, sans-serif;font-size:14px;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:black;}
.tg th{font-family:Arial, sans-serif;font-size:14px;font-weight:normal;padding:10px 5px;border-style:solid;border-width:1px;overflow:hidden;word-break:normal;border-color:black;}
.tg .tg-0pky{border-color:inherit;text-align:left;vertical-align:top}
.tg .tg-0lax{text-align:left;vertical-align:top}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s ease-out;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}

.custom-resizer {
  width: 100%;
  height: 800px;
}

.custom-resizer > .pane {
  text-align: left;
  padding: 1px;
  overflow: hidden;
  background: #eee;
  border: 1px solid #ccc;
}

.custom-resizer > .pane ~ .pane {
}

.custom-resizer > .multipane-resizer {
  margin: 0; left: 0;
  position: relative;

  &:before {
    display: block;
    content: "";
    width: 3px;
    height: 40px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin-top: -20px;
    margin-left: -1.5px;
    border-left: 1px solid #ccc;
    border-right: 1px solid #ccc;
  }

  &:hover {
    &:before {
      border-color: #999;
    }
  }
}
</style>

<template>
  <div id="live-view">
    DATA STRUCTURE
    <div id="live-knowledge-elements">
      <div id="live-knowledge-holder">
        <!-- <div v-if="liveData.languageLive" id="context-language" class="live-kelement">
          Language: <div class="live-item">{{ liveData.languageLive.word }}</div>
          <div id="learn-close"></div>
        </div>
        <div v-else id="live-context-language" class="live-kelement">Please set</div> -->
        <div id="live-context-devices" class="live-kelement">
          <header>Devices:</header>
            <ul>
              <li v-for="dev in liveData.devicesLive">
                 <div class="live-item">{{ dev.device_name }}</div>
              </li>
            </ul>
            <div v-if="feedback.devices" class="feedback">---</div>
        </div>
        <div id="live-context-datatypes" class="live-kelement">
          <header>X-axis fixed </header>
            <ul>
              <li id="bmp-data-sensor">
                <div class="live-item">Timestamp</div>
              </li>
            </ul>
          <header>Y-axis</header>
            <ul>
              <li id="bmp-data-sensor" v-for="dts in liveData.datatypesLive">
                <div class="live-item">{{ dts.text }}</div>
              </li>
            </ul>
            <div v-if="feedback.datatypes" class="feedback">---</div>
        </div>
        <div id="live-context-category" class="live-kelement">
          <header>Category</header>
            <ul>
              <li id="cat-items" v-for="catL in liveData.categoryLive">
                <div class="live-item">{{ catL.text }}</div>
              </li>
            </ul>
            <div v-if="feedback.categories" class="feedback">---</div>
        </div>
        <div v-if="liveData.scienceLive.prime" id="live-context-science" class="live-kelement">
          <header>Compute -</header>
          <div class="live-item">{{ liveData.scienceLive.prime.text || 'none' }}</div>
          <div v-if="feedback.science" class="feedback">---</div>
        </div>
        <div v-else id="live-context-science" class="live-kelement">Compute: not selected</div>
        <div id="context-time" class="live-kelement">
          <header>Time Period:</header>
            <ul>
              <li v-for="ts in liveData.timeLive">
                 <div class="live-item">{{ ts }}</div>
              </li>
            </ul>
            <div v-if="feedback.time" class="feedback">---</div>
        </div>
        <div id="context-resolution" class="live-kelement">
          <header>Resolution:</header>
            <div class="live-item">{{ liveData.resolutionLive }}</div>
            <div v-if="feedback.resolution" class="feedback">---</div>
        </div>
        <div id="live-learn" class="live-kelement">
          <div id="live-learn-container">
            <div id="learn">
              <button class="" href="" id="learn-button" @click.prevent="filterLearn(learn)">{{ learn.name }}</button>
            </div>
          </div>
        </div>
      </div>
      <div id="learn-close"></div>
    </div>
    <knowledge-Context :kContext="kContext" @clearKbox="clearKnowledgeBox"></knowledge-Context>
  </div>
</template>

<script>
  import Reactive from '@/components/charts/Reactive'
  import liveMixinSAFEflow from '@/mixins/safeFlowAPI'
  import scienceContribute from '@/components/healthscience/cnrl/scienceContribute.vue'
  import KnowledgeContext from '@/components/toolbar/knowledgeContext'
  import { kBus } from '../../main.js'
  const moment = require('moment')
  const crypto = require('crypto')
  const bs58 = require('bs58')
  const hashObject = require('object-hash')

  export default {
    name: 'knowledge-live',
    components: {
      Reactive,
      scienceContribute,
      KnowledgeContext
    },
    props: {
      liveData: {
        type: Object
      },
      KLexperimentData: null
    },
    computed: {
    },
    data () {
      return {
        learn:
        {
          name: 'learn',
          id: 'learn-status'
        },
        activeEntity: '',
        activevis: '',
        feedback:
        {
          devices: false,
          datatypes: false,
          categories: false,
          time: false,
          visulisation: false,
          resolution: false
        },
        experimentData: [],
        bundleuuid: '',
        liveDataCollection: {},
        liveTable: {},
        liveOptions: {},
        futureliveDataCollection: {},
        futureliveOptions: {},
        liveNavTime: [],
        liveTimeV: '',
        liveTimeVFuture: '',
        timeStateLast: '',
        buildTimeBundles: []
      }
    },
    created () {
      this.authorisation()
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
      this.liveData.categoryLive.push({'active': false, 'cnrl': 'none', 'text': 'none'}) // categoryEmpty
      this.setNaveTime()
    },
    mixins: [liveMixinSAFEflow],
    methods: {
      async authorisation () {
        let defaultAPI = '33221100'
        let authIN = this.$store.getters.liveSystem
        let authStatus = await this.checkAuthorisation(defaultAPI, authIN)
        if (authStatus === true) {
          console.log('yes authorisation passed')
        }
      },
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
        liveBundle.time = timeBundle
        liveBundle.resolution = this.liveData.resolutionLive
        liveBundle.visualisation = ['vis-sc-1', 'vis-sc-2'] // 'vis-sc-1',
        // check all the elements are filled correctly
        let checkElements = this.checkLiveElements(liveBundle)
        if (checkElements.status === true) {
          // clear any feedback
          this.feedback.devices = false
          this.feedback.datatypes = false
          this.feedback.categories = false
          this.feedback.science = false
          this.feedback.time = false
          this.feedback.visulisation = false
          this.feedback.resolution = false
          // create unquie ID for kbundle and use to save
          let uuidBundle = this.createKBID(liveBundle)
          liveBundle.kbid = uuidBundle
          this.bundleuuid = uuidBundle
          // this.saveLearnHistory(liveBundle)
          this.$store.dispatch('actionLiveBundle', liveBundle)
          // this.$store.dispatch('actionLiveBundleNav', liveBundle)
          this.$store.dispatch('actionStartKBundlesItem', liveBundle)
          // set message to UI IN-progress
          this.entityPrepareStatus.active = true
          let visDataBack = await this.learnStart(liveBundle)
          this.entityPrepareStatus.active = false
          this.liveDataCollection = visDataBack.liveDataCollection
          this.liveOptions = visDataBack.liveOptions
          // this.kContext = visDataBack.kContext
          this.liveTimeV = visDataBack.displayTime
          this.liveTimeVFuture = visDataBack.displayTimeF
          this.liveTable = visDataBack.table
          // start the future
          // this.startFuture(liveBundle, visDataBack.displayTimeF)
        } else {
          // prompt what need selected
          console.log('elelment not selelted')
        }
      },
      checkLiveElements (bundle) {
        let statusCheck = {}
        statusCheck.status = true
        statusCheck.feedback = []
        this.feedback.devices = false
        this.feedback.datatypes = false
        this.feedback.categories = false
        this.feedback.science = false
        this.feedback.time = false
        this.feedback.visulisation = false
        this.feedback.resolution = false
        // check all filled
        if (bundle.cnrl !== undefined && bundle.cnrl.length === 0) {
          statusCheck.feedback.push('cnrl')
          statusCheck.status = false
        }
        if (bundle.language.length === 0) {
          statusCheck.feedback.push('language')
          statusCheck.status = false
        }
        if (bundle.devices.length === 0) {
          statusCheck.feedback.push('devices')
          statusCheck.status = false
          this.feedback.devices = true
        }
        if (bundle.datatypes.length === 0) {
          statusCheck.feedback.push('datatypes')
          statusCheck.status = false
          this.feedback.datatypes = true
        }
        if (bundle.categories.length < 1) {
          statusCheck.feedback.push('categories')
          statusCheck.status = false
          this.feedback.categories = true
        }
        if (bundle.science.prime.text === 'empty') {
          statusCheck.feedback.push('science')
          statusCheck.status = false
          this.feedback.science = true
        }
        if (bundle.time.timeseg.length === 0) {
          statusCheck.feedback.push('time')
          statusCheck.status = false
          this.feedback.time = true
        }
        if (bundle.resolution.length === 0) {
          statusCheck.feedback.push('resolution')
          statusCheck.status = false
          this.feedback.resolution = true
        }
        if (bundle.visualisation.length === 0) {
          statusCheck.feedback.push('visualisation')
          statusCheck.status = false
          this.feedback.visulisation = true
        }
        return statusCheck
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
        return updateTbundle
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
      async startFuture (liveBundle, fTime) {
        // start the future
        liveBundle.time.startperiod = 'simulateData'
        liveBundle.time.futureperiod = moment(fTime)
        let visDataBack = await this.learnStart(liveBundle)
        this.futureliveDataCollection = visDataBack.liveDataCollection
        this.futureliveOptions = visDataBack.liveOptions
        // this.futurekContext = visDataBack.kContext
        // this.liveTimeV = visDataBack.displayTime
        this.liveTimeVFuture = visDataBack.displayTimeF
      },
      saveLearnHistory (lBundle) {
        this.historyData.push(lBundle)
      },
      async learnManager (updateTbundle) {
        let visDataBack = await this.learnStart(updateTbundle)
        // remove compute in progress Message
        this.$store.dispatch('actionstopComputeStatus', updateTbundle.kbid)
        this.entityPrepareStatus.active = false
        this.liveDataCollection = visDataBack.liveDataCollection
        this.liveOptions = visDataBack.liveOptions
        // this.kContext = visDataBack.kContext
        this.liveTimeV = visDataBack.displayTime
        this.liveTimeVFuture = visDataBack.displayTimeF
        this.liveTable = visDataBack.table
        // this.startFuture(updateTbundle, visDataBack.displayTimeF)
      },
      setKnowledgtBox (liveKbid) {
        // first clear existing knowledge in box
        this.clearKnowledgeBox()
        this.languageStatus(liveKbid.language)
        this.deviceStatus(liveKbid.startStatus)
        for (let dI of liveKbid.devices) {
          this.liveDevice(dI)
        }
        for (let dtI of liveKbid.datatypes) {
          this.datatypeStatus(dtI)
        }
        this.scienceStatus(liveKbid.science)
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
        // pass on info to open knowledge
        kBus.$emit('newLiveKBundle', liveKbid)
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
        this.liveData.scienceLive = sIN
      },
      timeStatus (tIN) {
        if (tIN.active === true) {
          this.liveData.timeLive = []
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
          this.liveData.categoryLive = []
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
      experADD (expA) {
        // need to keep permanent store of experiments to Ecomponents linked (save, delete, update also)
        const localthis = this
        console.log(this.selectedExperiment)
        this.saveMappingExpKB(this.selectedExperiment)
        // this.$emit('experimentMap', this.selectedExperiment)
        setTimeout(function () {
          localthis.saveStatusEK.active = false
        }, 3000) // hide the message after 3 seconds
      },
      setNaveTime () {
        // this.liveNavTime = this.timeNav('datatime-index')
      },
      async saveMappingExpKB (expMapIN) {
        let mappingEKB = {}
        mappingEKB.experimentCNRL = expMapIN
        mappingEKB.kbid = this.bundleuuid
        this.$store.dispatch('actionExperimentKBundlesItem', mappingEKB)
        this.$store.dispatch('actionUpdateKentitiesByKID', mappingEKB)
        let saveEK = await this.SaveexperimentKbundles(mappingEKB)
        if (saveEK.save === 'expkbundle') {
          this.saveStatusEK = {'active': true, 'text': 'saved'}
        }
      },
      viewHistoryLive (ch) {
        this.computehist = ch
      },
      startStatusSave (se) {
        // change start status and save or delete settings
        this.$store.dispatch('actionUpdateBundleItem', this.activeEntity)
        let updateBundle = this.$store.getters.startBundlesList
        for (let iB of updateBundle) {
          if (iB.kbid === this.activeEntity) {
            this.saveStartBundle(iB)
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

#learn-close {
  clear:both;
}

#live-learn-container {
  margin: 20px;
}

#learn-button {
  font-size: 1.6em;
  padding: .25em;

}

#history {
  border-top: 1px solid grey;
  margin-top: 2em;
}

#live-context-datatypes li {
  display: block;
  border: 0px solid pink;
}

#live-knowledge-elements {
  border: 0px solid blue;
  background-color: #eae6ed;
}

#live-knowledge-holder {
  float: left;
  border: 1px solid purple;
  background-color: white;
  margin: 6px;
}

.live-kelement {
  display: inline-block;
  vertical-align: top;
  border: 0px solid red;
  margin-left: 20px;
  width: 180px;
}

.live-kelement header {
  background-color: #d7e6f5;
  border-bottom: 2px dotted #6F6B63;
  margin: 4px;
  font-weight: normal;
}

.live-item {
  font-weight: bold;
  border: 0px solid black;
}

.context-selecttime {
  display: inline;
  margin: 1em;
  min-height: 40px;
}

#k-toolkit {
  border: 2px solid grey;
}

#add-exp-button {
  font-size: 1.4em;
  padding-left: 8px;
  padding-right: 8px;
}

#add-experiment,#time-select,#save-component {
  display: inline-block;
}

.feedback {
  background-color: red;
  vertical-align: bottom;
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
  height: 4000px;
}

.custom-resizer > .pane {
  text-align: left;
  padding: 1px;
  overflow: scroll;
  overflow-y:scroll;
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

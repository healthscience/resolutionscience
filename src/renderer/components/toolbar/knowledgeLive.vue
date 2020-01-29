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
        <div id="context-results" class="live-dtresults">
          <header>Results:</header>
            <div class="live-dtresults">auto {{ }}</div>
        </div>
      </div>
      <a href="#" >add</a>
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
      saveLearnHistory (lBundle) {
        this.historyData.push(lBundle)
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
      },
      filterDeviceActive () {
        if (this.device1.active === true) {
          this.activedevice = this.device1.id
        } else if (this.device2.active === true) {
          this.activedevice = this.device2.id
        }
      },
      filterSensorActive () {
        if (this.sensor1.active === true) {
          this.activesensor = this.sensor1.id
        } else if (this.sensor2.active === true) {
          this.activesensor = this.sensor2.id
        }
      },
      filterScienceActive () {
        if (this.compute1.active === true) {
          this.activecompute = this.compute1.id
        } else if (this.compute2.active === true) {
          this.activecompute = this.compute2.id
        } else if (this.compute3.active === true) {
          this.activecompute = this.compute3.id
        } else if (this.compute4.active === true) {
          this.activecompute = this.compute4.id
        }
      },
      filterVisActive () {
        if (this.vis1.active === true) {
          this.activevis = this.vis1.id
        } else if (this.vis2.active === true) {
          this.activevis = this.vis2.id
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

.live-dtresults {
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

</style>

<template>
  <div id="nxp-toolbar">Controls over NXPs
    <div id="nxp-master-toolbar">
      <select v-model="liveexerimentList" class="button-expadd" href="" id="add-exp-button" @change="selectNXP($event)">
        <option class="science-nxp" v-for="expi in liveexerimentList" v-bind:value="expi.prime.cnrl">
          {{ expi.prime.text }}
        </option>
      </select>
      <div class="control-buttons" id="new-button">
        <button v-model="newNXP" class="button-new-nxp" href="" id="new-exp-button" @click.prevent="nxpNew($event)">New</button>
      </div>
      <div class="control-buttons">
        <button v-model="viewCNRL" class="button-view-cnrl" href="" id="cnrl-view-button" @click.prevent="viewCNRLlibrary(viewCNRL)">{{ viewCNRL.name }}</button>
      </div>
      <div class="control-buttons">
        <button v-model="computehist" class="button-view-computelist" href="" id="computelist-view-button" @click.prevent="viewComputeHistory(computehist)">{{ computehist.name }}</button>
      </div>
      <cnrl-controls v-if="viewCNRL.active" class="control-buttons"></cnrl-controls>
      <div id="history" v-if="computehist.active">
        <history-List class="control-buttons" :historyData="historyData" @setLiveBundle="makeLiveKnowledge"></history-List>
      </div>
      <div id="live-learn" class="control-buttons">
        <div id="live-learn-container">
          <div id="learn">
            <button class="" href="" id="learn-button" @click.prevent="filterLearn(learn)">{{ learn.name }}</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import cnrlControls from '../cnrl/cnrlControls.vue'
  import historyList from '@/components/healthscience/historyList.vue'
  import { kBus } from '../../../main.js'
  const moment = require('moment')

  export default {
    name: 'nxp-controls',
    components: {
      cnrlControls,
      historyList
    },
    computed: {
      liveexerimentList: function () {
        return this.$store.state.experimentList
      },
      historyData: function () {
        return this.$store.state.startBundles
      }
    },
    data () {
      return {
        learn:
        {
          name: 'learn',
          id: 'learn-status'
        },
        saveExpKid:
        {
          active: false,
          text: ''
        },
        newNXP:
        {
          active: false,
          text: 'NXP'
        },
        viewCNRL:
        {
          active: false,
          name: 'view CNRL'
        },
        CNRLdata: [],
        computehist:
        {
          name: 'View compute list',
          id: 'learn-history',
          active: false
        }
      }
    },
    created () {
    },
    mounted () {
    },
    methods: {
      selectNXP (exB) {
        // dispatch select to store
        console.log('select NXP')
        console.log(exB.target.value)
        this.$store.dispatch('actionSetNXP', exB.target.value)
      },
      viewCNRLlibrary (cnrlv) {
        cnrlv.active = !cnrlv.active
        if (cnrlv.active === true) {
          this.viewCNRL.name = 'Close CNRL'
        } else {
          this.viewCNRL.name = 'View CNRL'
        }
      },
      viewComputeHistory (hist) {
        hist.active = !hist.active
        if (hist.active === true) {
          this.computehist.name = 'Close compute list'
        } else {
          this.computehist.name = 'View compute list'
        }
        this.$emit('viewHistory', hist)
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
      async navTimeLearn (uSeg) {
        let updateTbundle = {}
        let timeAsk = []
        // did UI give nav segment or date from calendar?
        if (uSeg.text === 'selectd') {
          updateTbundle.visualisation = ['vis-sc-1', 'vis-sc-2']
          // convert time to correct format
          timeAsk.push('day')
          let updateTime = {}
          updateTime.startperiod = uSeg.selectDate
          updateTime.timeseg = this.liveData.timeLive
          updateTime.timevis = timeAsk
          updateTime.laststartperiod = this.liveTimeV
          updateTbundle.time = updateTime
          this.$store.dispatch('actionLiveBundleNav', updateTbundle)
          let updatedBundleSet = this.$store.getters.liveBundle
          this.entityPrepareStatus.active = true
          this.learnManager(updatedBundleSet)
        } else if (uSeg.text === 'timeList') {
          let updateTime = {}
          updateTime.startperiod = uSeg.selectDate
          updateTime.timeseg = this.liveData.timeLive
          updateTime.timevis = timeAsk
          updateTime.laststartperiod = this.liveTimeV
          updateTbundle.time = updateTime
          this.prepareMultiLearn(updateTbundle, uSeg.timelist)
        } else {
          // time setTimeSegments
          // updateTbundle.visualisation = ['vis-sc-1', 'vis-sc-2']
          timeAsk.push(uSeg.text)
          // timeAsk.push('day')
          let updateTimen = {}
          updateTimen.startperiod = 'relative'
          updateTimen.timeseg = this.liveData.timeLive
          updateTimen.timevis = timeAsk
          updateTimen.laststartperiod = this.liveTimeV
          updateTbundle.time = updateTimen
          this.$store.dispatch('actionLiveBundleNav', updateTbundle)
          let updatedBundleSetN = this.$store.getters.liveBundle
          this.entityPrepareStatus.active = true
          this.learnManager(updatedBundleSetN)
        }
        // pass on to learn safeFlow
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
      async prepareMultiLearn (liveKB, timeList) {
        let updateTbundle = {}
        let timeAsk = []
        this.buildTimeBundles = []
        for (let tl of timeList) {
          let updateTime = {}
          timeAsk.push('day')
          updateTime.startperiod = tl
          updateTime.timeseg = this.liveData.timeLive
          updateTime.timevis = timeAsk
          updateTime.laststartperiod = this.liveTimeV
          updateTbundle.time = updateTime
          this.$store.dispatch('actionLiveBundleNav', updateTbundle)
          let updatedBundleSet = this.$store.getters.liveBundle
          let visDataBack = await this.learnStart(updatedBundleSet)
          this.buildTimeBundles.push(visDataBack)
        }
        return true
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
      nxpNew () {
        console.log('set up new NXP')
        this.$store.dispatch('actionNewNXP', true)
      }
    }
  }
</script>

<style>
.control-buttons {
  display: inline-block;
}

#learn-button {
  font-size: 1.6em;
  padding: .25em;

}

</style>

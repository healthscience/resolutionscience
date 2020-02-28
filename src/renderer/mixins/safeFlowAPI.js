import SAFEflow from '../safeflow/safeFlow.js'
const moment = require('moment')

export default {
  data () {
    return {
      chartmessage: {}
    }
  },
  computed: {
    safeAPI: function () {
      let liveFlow = new SAFEflow()
      return liveFlow
    }
  },
  methods: {
    async connectNSnetwork (authType, authBundle) {
      // offline
      // connected annon
      // first time setup self verification
      // connect self verified
      if (authType === 'safenetwork') {
        // implement in network release see DIY repo on github.
      } else if (authType === 'cloud') {
        await this.startCycle(authBundle)
      }
    },
    async startCycle (authIN) {
      // AUTHORISATION KLB entry or non for network KBLedger
      let defaultAPI = '33221100'
      let authStatus = await this.checkAuthorisation(defaultAPI, authIN)
      if (authStatus === true) {
        // What network experiments entries are indexed in KBLedger?
        this.safeAPI.startKBL()
        // this.startNetworkExpMappedKbundles()
        // this.startKSetting()
        // Independently extract devcies, datatypes, computes etc for Peer
        // await this.deviceContext()
        // this.datatypeContext()
        // this.cnrlComputeIndex()
        // this.timeNav('time-index')
        // cnrl indexes data
        // this.GETdatatypeList()
      }
    },
    async checkAuthorisation (defaultAPI, authBundle) {
      let auth = false
      auth = await this.safeMixin.networkAuthorisation(defaultAPI, authBundle)
      return auth
    },
    async startNetworkExpMappedKbundles () {
      let mappedNetworkExpKbundles = await this.safeMixin.experimentKbundles('retreive')
      // extract the unique CNRL network experiment ids and look up info.
      let uniqueNXP = [...new Set(mappedNetworkExpKbundles.map(x => x.experimentCNRL))]
      // lookup CNRL for full info on the NXP
      let NXPlist = []
      for (let inxp of uniqueNXP) {
        let cnrlNXP = this.safeMixin.cnrlLookup(inxp)
        NXPlist.push(cnrlNXP)
      }
      // set via store and then pick up in historyData
      this.$store.dispatch('actionExperimentList', NXPlist)
      this.$store.dispatch('actionExperimentKBundles', mappedNetworkExpKbundles)
      // what other NXPs are available on the network?
      this.liveNetworkExperiments()
    },
    async startKSetting () {
      let startKset = await this.safeMixin.startSettings('retreive', null)
      // set via store and then pick up in historyData
      this.$store.dispatch('actionStartKBundles', startKset)
      this.startKup()
    },
    startKup () {
      const nowTime = moment()
      let startPeriodTime = moment.utc(nowTime).startOf('day')
      let MSstartTime = moment(startPeriodTime).format('x')
      this.$store.dispatch('actionComputeStatus', MSstartTime)
    },
    liveNetworkExperiments () {
      let experimentList = this.safeMixin.cnrlExperimentIndex()
      this.$store.dispatch('actionNetworkExperimentList', experimentList)
    },
    async deviceContext () {
      const deviceFlag = 'device'
      let deviceList = await this.safeMixin.toolkitContext(deviceFlag)
      this.$store.dispatch('actionDeviceDataAPI', deviceList)
    },
    async datatypeContext () {
      // make call to set start dataType for the device sensors
      const dataTypeFlag = 'dataType'
      let livePeerDevices = this.$store.getters.liveContext.device
      let datatypeList = await this.safeMixin.toolkitContext(dataTypeFlag, livePeerDevices)
      this.$store.dispatch('actionSetDataTypes', datatypeList)
    },
    cnrlComputeIndex () {
      // call the CNRL api and get network science active
      let startScienceCompute = this.safeMixin.cnrlNetworkComputeIndex()
      this.$store.dispatch('actionCNRLcompute', startScienceCompute)
    },
    timeRange () {
      let rangeHolder = {}
      rangeHolder.startTime = this.toolbarData.liveOptions.analysisStart
      rangeHolder.endTime = this.toolbarData.liveOptions.analysisEnd
      rangeHolder.active = true
      return rangeHolder
    },
    timeNav (navT) {
      let navTimelist = []
      navTimelist = this.safeMixin.cnrlTimeIndex(navT)
      this.$store.dispatch('actionTIMEindex', navTimelist)
    },
    GETexperimentsList () {
      let nxpList = this.safeMixin.cnrlExperimentIndex()
      this.$store.dispatch('actionNXPindex', nxpList)
    },
    GETdatatypeList () {
      let dtList = this.safeMixin.cnrlNetworkDatatypeIndex()
      this.$store.dispatch('actionDTlist', dtList)
    },
    setFutureUItime (curTime) {
      let futureTime = curTime + 86400
      let fTimeFormatted = moment(futureTime * 1000).format('LLLL')
      return fTimeFormatted
    },
    saveStartBundle (bund) {
      // need up date startStatus Object
      this.safeMixin.startSettings('save', bund)
    },
    removeStartBundle (bund) {
      // need up date startStatus Object
      console.log('remove')
      this.safeMixin.startSettings('remove', bund)
    },
    removeStartDashboard (bund) {
      // need up date startStatus Object
      console.log('removedash')
      this.safeMixin.startSettings('removedash', bund)
    },
    async SaveexperimentKbundles (mapEKb) {
      let saveStatus = await this.safeMixin.experimentKbundles('save', mapEKb)
      return saveStatus
    },
    async mappedKBLexp () {
      let lastestMappedLedger = await this.safeMixin.experimentKbundles('retreive')
      return lastestMappedLedger
    },
    async filterLearn (s) {
      // close the knowledge
      // kBus.$emit('closeKnowledge')
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
        // let uuidBundle = this.createKBID(liveBundle)
        // liveBundle.kbid = uuidBundle
        // this.bundleuuid = uuidBundle
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
    async learnStart (lBundle) {
      // console.log('start Learning')
      // console.log(lBundle)
      let returnVISvue = {}
      this.chartmessage.text = 'Visualisation being prepared'
      this.chartmessage.active = true
      this.liveBundle = lBundle
      this.activeEntity = lBundle.kbid
      // set the visualisation require (need to be more complex ie. type, type chart colors etc)
      this.activevis = this.$store.getters.liveVis[0]
      // make the Entity
      await this.safeMixin.scienceEntities(lBundle)
      // this.learnListening()
      let entityGetter = await this.safeMixin.entityGetter(this.activeEntity, 'vis-sc-1')
      let entityGetterTable = await this.safeMixin.entityGetter(this.activeEntity, 'vis-sc-2')
      this.chartmessage.active = false
      // get the table visulisation
      returnVISvue = await this.diplayFilter(this.activeEntity, 'vis-sc-1', entityGetter)
      returnVISvue.table = entityGetterTable
      return returnVISvue
    },
    async makeLiveKnowledge (lBund) {
      // set live Bundle for context
      // first close the computelist
      this.computehist.active = false
      this.computehist.name = 'View compute list'
      this.bundleuuid = lBund.kbid
      this.$store.dispatch('actionLiveBundle', lBund)
      // update bundle start time
      const nowTime = moment()
      let updatestartPeriodTime = moment.utc(nowTime).startOf('day')
      this.$store.dispatch('actionUpdateStartTime', updatestartPeriodTime)
      this.$store.dispatch('actionUpdateSciCompute', lBund.cnrl)
      this.entityPrepareStatus.active = true
      // set the active knowledge boxes
      // lBund.visualisation = ['vis-sc-1', 'vis-sc-2']
      let updatedKBundleSet = this.$store.getters.liveBundle
      this.setKnowledgtBox(updatedKBundleSet)
      let visDataBack = await this.learnStart(updatedKBundleSet)
      // remove compute in progress Message
      this.$store.dispatch('actionstopComputeStatus', updatedKBundleSet.kbid)
      this.entityPrepareStatus.active = false
      this.liveDataCollection = visDataBack.liveDataCollection
      this.liveOptions = visDataBack.liveOptions
      // this.kContext = visDataBack.kContext
      this.liveTimeV = visDataBack.displayTime
      this.liveTimeVFuture = visDataBack.displayTimeF
      this.liveTable = visDataBack.table
      // this.startFuture(lBund, visDataBack.displayTimeF)
    },
    learnUpdate (uSeg) {
      let updateTbundle = {}
      let timeAsk = []
      timeAsk.push(uSeg.text)
      updateTbundle.timevis = timeAsk
      updateTbundle.startperiod = 'relative'
      updateTbundle.timeseg = []
      const nowTime = moment()
      let realTime = moment.utc(nowTime)
      let liveBundleUpdate = {}
      liveBundleUpdate.cnrl = this.liveBundle.cnrl
      liveBundleUpdate.language = this.liveBundle.language
      liveBundleUpdate.devices = this.liveBundle.devices
      liveBundleUpdate.datatypes = this.liveBundle.datatypes
      liveBundleUpdate.categories = this.liveBundle.categories
      liveBundleUpdate.science = this.liveBundle.science
      liveBundleUpdate.time = updateTbundle
      liveBundleUpdate.realtime = realTime
      liveBundleUpdate.resolution = this.liveBundle.resolution
      liveBundleUpdate.visualisation = this.liveBundle.visualisation
      this.learnStart(liveBundleUpdate)
    },
    toolsSwitch (tss) {
      if (tss === true) {
        let updateCopyTemp = this.liveDataCollection
        this.liveDataCollection = {}
        let updateOptions = this.liveOptions
        updateOptions.annotation = this.liveAnnotations
        this.liveOptions = updateOptions
        this.liveDataCollection = updateCopyTemp
      } else if (tss === false) {
        this.liveOptions.annotation = {}
      }
    },
    async makeELive (status) {
      let expCNRL = status.target.id
      this.liveExpActive = expCNRL
      let expStateLive = this.experimentState(expCNRL)
      // are any of the other experiments OPEN?  If so keep them open
      if (this.activeKentities[expCNRL].length > 0) {
        if (status.target.checked === true) {
          this.setProgressMessage(expCNRL)
          let expDataFresh = await this.learnWork(expCNRL, expStateLive)
          let expState = {}
          expState.cnrl = expCNRL
          expState.status = true
          expState.dashKBlist = expDataFresh
          expState.contract = expStateLive
          this.$set(this.eKBundle, expCNRL, expState)
          this.StopprogressMessage(expCNRL)
        } else {
          // this.removeCNRLlist(expCNRL)
          let expState = {}
          expState.cnrl = expCNRL
          expState.status = false
          expState.dashKBlist = []
          expState.contract = expStateLive
          this.$set(this.eKBundle, expCNRL, expState)
        }
      } else {
        console.log('nothing set to show')
      }
    },
    async learnWork (expCNRL, expStateLive) {
      let prepareDashList = []
      let currentEntities = this.startBundlesList
      let liveBundles = this.activeKentities[expCNRL]
      // console.log(currentEntities)
      // console.log(liveBundles)
      for (let expEB of liveBundles) {
        for (let iee of currentEntities) {
          if (expEB === iee.kbid) {
            if (iee) {
              let visDataBack = await this.learnStart(iee)
              prepareDashList.push(visDataBack)
            } else {
              // updateStatus = false
            }
          }
        }
      }
      return prepareDashList
    },
    experimentState (expCNRL) {
      // match to contract CNRL
      let liveContract = {}
      for (let lx of this.experimentList) {
        if (lx.prime.cnrl === expCNRL) {
          liveContract = lx
        }
      }
      return liveContract
    },
    updateStoreExpStateTrue (expCNRL, expStateLive, learnDlist) {
      let expState = {}
      expState.cnrl = expCNRL
      expState.view = true
      expState.dashKBlist = learnDlist
      expState.contract = expStateLive
      // this.$store.dispatch('actionUpdateExperiment', expState)
    },
    updateStoreExpStateFalse (expCNRL, expStateLive) {
      let expState = {}
      expState.cnrl = expCNRL
      expState.view = false
      expState.dashKBlist = []
      expState.contract = expStateLive
      // this.$store.dispatch('actionUpdateExperimentC', expState)
      return true
    },
    setProgressMessage (CNRL) {
      let progressSet = {}
      progressSet.active = true
      progressSet.cnrl = CNRL
      progressSet.text = 'Preparing visualisation'
      this.$store.dispatch('actionExperimentProgressStatus', progressSet)
    },
    StopprogressMessage (CNRL) {
      let progressSet = {}
      progressSet.active = false
      progressSet.cnrl = CNRL
      progressSet.text = 'Preparing visualisation'
      this.$store.dispatch('actionExperimentProgressStatusFalse', progressSet)
    },
    removeCNRLlist (expCNRL) {
      let updateCNRLlist = []
      for (let exc of this.CNRLactiveList) {
        if (exc !== expCNRL) {
          updateCNRLlist.push()
        }
      }
      this.CNRLactiveList = updateCNRLlist
    },
    leaveClearExpClose () {
      // set experiment and progress Status to false
      for (let expCNRL of this.CNRLactiveList) {
        let expStateLive = this.experimentState(expCNRL)
        this.updateStoreExpStateFalse(expCNRL, expStateLive)
        // this.StopprogressMessage(expCNRL)
      }
    },
    async diplayFilter (aEID, aVis, entityGetter) {
      // setup return vis Object
      let visObjectVUE = {}
      if (aVis === 'vis-sc-1') {
        if (entityGetter.chartMessage === 'computation in progress') {
        } else if (entityGetter.chartMessage === 'vis-report') {
          let recoveryStart = {}
          recoveryStart.seenStatus = true
          recoveryStart.hrcdata = entityGetter.hrcReport
          this.recoveryData = recoveryStart
        } else {
          this.chartmessage.text = 'computation up-to-date'
          this.options2 = entityGetter.liveChartOptions
          this.datacollection2 = entityGetter.chartPackage
          this.liveTimeV2 = moment(entityGetter.displayTime * 1000).format('LLLL')
          // this.liveanalysisStart = entityGetter.selectTimeStart
          this.liveSelectTime = this.liveanalysisStart
          let AvgDstart = await this.getAverages(aEID)
          this.options2.annotation.annotations[0].value = AvgDstart.avgdhr
          this.options2.annotation.annotations[1].value = AvgDstart.avgdrhr
          // visObjectVUE.kContext = this.liveanalysisStart
          visObjectVUE.displayTime = this.liveTimeV2
          visObjectVUE.displayTimeF = this.setFutureUItime(entityGetter.displayTime)
          visObjectVUE.liveOptions = this.options2
          visObjectVUE.liveDataCollection = this.datacollection2
        }
      } else if (this.activevis === 'vis-sc-2') {
        // localthis.tableHTML = entityGetter.table
      } else if (this.activevis === 'vis-sc-3') {
        // localthis.simulationHeart = entityGetter.heart
        // localthis.simulationMovement = entityGetter.heart
        // localthis.simulationTime = entityGetter.time
      }
      return visObjectVUE
    },
    learnListening () {
      var localthis = this
      // listening to give peer info. on computation statusTime
      this.safeMixin.liveEManager.on('computation', function (cState) {
        if (cState === 'in-progress') {
          localthis.chartmessage.text = cState
        } else {
          localthis.chartmessage.text = 'computation up-to-date'
        }
      })
    },
    async getAverages (eid) {
      // update latest daily average HR
      let AvgDailyHolder = {}
      let currentAHR = await this.safeMixin.entityCurrentAverageHR(eid, 'none')
      let newARHR = await this.safeMixin.entityCurrentAverageHR(eid, 'cnrl-8356388727')
      // let newARHR = 55
      AvgDailyHolder.avgdhr = currentAHR
      AvgDailyHolder.avgdrhr = newARHR
      // console.log(this.liveOptions)
      // this.liveOptions.annotation.annotations[0].value = newAHR
      // this.liveOptions.annotation.annotations[1].value = newARHR
      return AvgDailyHolder
    }
  }
}

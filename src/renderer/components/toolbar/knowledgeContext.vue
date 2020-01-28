<template>
  <div id="knowledge-context">
    <div id="context-knowledge-holder">
      <div id="knowlege-boxes" v-if="ok.active">
        <!-- <div id="context-language">
          <ul>
            <li v-for="sk in knowledge" class="context-horizontal">
              <a href="" id="" @click.prevent="selectKnowledge(sk)" v-bind:class="{ 'active': sk.active}">{{ sk.name }}</a>
            </li>
          </ul>
          <div id="language-words">
            <a href="" id="" @click.prevent="selectLanguage(kwords)">{{ kwords.word }} {{ kwords.wordconnect }}</a>
          </div>
        </div> -->
        <div id="context-devices" class="context-box">
          <header>Devices:</header>
            <ul>
              <li class="knowledge-item" v-for="dev in devices">
                <a href="#" @click.prevent="selectDevice(dev)" v-bind:class="{ 'active': dev.active}">{{ dev.device_name }}</a>
              </li>
            </ul>
        </div>
        <div id="context-datatypes" class="context-box">
          <header>Datatypes</header>
            <ul>
              <li id="data-type-live" class="knowledge-item" v-for="dts in datatypes">
                <a class="" href="" id="bmp-data" @click.prevent="selectDatatypes(dts)" v-bind:class="{ 'active': dts.active}">{{ dts.text }}</a>
              </li>
            </ul>
        </div>
        <div id="context-category" class="context-box">
          <header>Category</header>
          <ul>
            <li id="data-type-live" class="knowledge-item" v-for="cdt in cdtypes">
              <a class="" href="" id="bmp-data" @click.prevent="selectCatTD(cdt)" v-bind:class="{ 'active':cdt.active }">{{ cdt.text }}</a>
            </li>
          </ul>
        </div>
        <div id="context-time" class="context-box">
          <header>Time Period:</header>
            <ul>
              <li v-if="timeOptions" v-for="t in timeOptions" class="context-time">
                <a href="" id="" @click.prevent="selectTime(t)" v-bind:class="{ 'active': t.active}" class="knowledge-item">{{ t.text }}</a>
              </li>
            </ul>
        </div>
        <div id="context-resolution" class="context-box">
          <header>Resolution:</header>
            <ul>
              <li v-for="r in resolution" class="context-time">
                <a href="" id="" @click.prevent="selectResolution(r)" v-bind:class="{ 'active': r.active}" class="knowledge-item">{{ r.text }}</a>
              </li>
            </ul>
        </div>
      </div>
      <div id="select-knowledge">
        <a href="" id="open-knowledge" @click.prevent="openKnowledge(ok)" v-bind:class="{ 'active': ok.active}">{{ ok.name }}</a>
      </div>
    </div>
    <div id="clear-data-box"></div>
  </div>
</template>

<script>
  import liveMixinSAFEflow from '@/mixins/safeFlowAPI'
  import { kBus } from '../../main.js'
  const shell = require('electron').shell

  export default {
    name: 'knowledge-context',
    components: {
    },
    props: {
      kContext: {
        type: Object
      }
    },
    data () {
      return {
        knowledge:
        [{
          name: 'human',
          id: 'cnrl-k1',
          active: false
        },
        {
          name: 'world',
          id: 'cnrl-k2',
          active: false
        },
        {
          name: 'mindmap',
          id: 'cnrl-k3',
          active: false
        }],
        ok:
        {
          name: 'OPEN Data',
          id: 'learn-status',
          active: false
        },
        liveScience: {},
        knowledgeSummary: '',
        datatypes: [],
        scidtypes: [],
        cdtypes: [],
        scoptions: [],
        selectedCompute: 'A',
        sciencedataMapping: {},
        kwords: {},
        subcontextholder: [],
        subcontext: [],
        resolution:
        [{
          text: 'per minute',
          id: 'cnrl-r1',
          active: false
        }],
        livedtypes: [],
        startLine: '1',
        stopLine: '2'
      }
    },
    created () {
      kBus.$on('closeKnowledge', (cData) => {
        this.ok.active = true
        this.openKnowledge(this.ok)
      })
      kBus.$on('newLiveKBundle', (KBdata) => {
        this.updateKBcontext(KBdata)
      })
    },
    computed: {
      devices: function () {
        return this.$store.getters.liveContext.device
      },
      datatypesAvailable: function () {
        return this.$store.state.context.datatypes
      },
      computeAvailable: function () {
        return this.$store.state.compute
      },
      timeOptions: function () {
        return this.$store.state.selectTime
      }
    },
    mounted () {
    },
    mixins: [liveMixinSAFEflow],
    methods: {
      openKnowledge (ok) {
        ok.active = !ok.active
        if (ok.active === true) {
          ok.name = 'Close Data'
          // this.$emit('clearKbox')
        } else {
          ok.name = 'OPEN Data'
        }
      },
      selectKnowledge (k) {
        k.active = !k.active
        // display language for
        this.displayLanugage(k.id)
      },
      displayLanugage (cnrlID) {
        // loop over match and display words or display human body graphic
        this.kwords = []
        // let lanuageCNRL = this.GETcnrlLivingKnowledge(cnrlID)
        // let wordsPlacer = {}
        // wordsPlacer.word = lanuageCNRL.prime.word
        // wordsPlacer.wordconnect = lanuageCNRL.prime[1].word
        // this.kwords = wordsPlacer
      },
      selectLanguage (l) {
        l.active = !l.active
        kBus.$emit('setVLanguage', l)
        // this.$emit('setVLanguage', l)
      },
      selectDevice (s) {
        this.$store.dispatch('actionUpateDeviceState', s)
        kBus.$emit('setVDevice', s)
        this.dataTypeDevice(s)
      },
      selectDatatypes (std) {
        this.$store.dispatch('actionUpateDTState', std)
        kBus.$emit('setVDatatypes', std)
      },
      selectSciDatatypes (std) {
        std.active = !std.active
        kBus.$emit('setVDatatypes', std)
      },
      selectResolution (r) {
        r.active = !r.active
        kBus.$emit('setVResolution', r)
      },
      languageContext () {
        // let refContext = 'human'
        // let lanuageCNRL = this.GETcnrlLivingKnowledge(refContext)
        // this.kwords = lanuageCNRL
      },
      dataTypeDevice (devC) {
        console.log('dt per devcies')
        console.log(devC)
        console.log(this.datatypesAvailable)
        this.datatypes = this.datatypesAvailable[devC.device_mac].datatypes
        // check if categories exist for this DT?
        this.cdtypes = [] // this.extractCategories(this.datatypesAvailable[devC.device_mac].sourcedts)
      },
      extractCategories (sourceDTs) {
        let categories = []
        for (let cts of sourceDTs.categories) {
          console.log(cts)
        }
        return categories
      },
      updateComputeDTs (computeIN) {
        console.log(computeIN)
        this.activeEntity = computeIN
        // match to CNRL compute contract
        let computeContract = {}
        for (let ccL of this.computeAvailable) {
          if (computeIN === ccL.prime.cnrl) {
            computeContract = ccL
          }
        }
        // this.liveScience.livingpaper = computeContract.livingpaper
        kBus.$emit('setVScience', computeContract)
      },
      compareDataTypes (sciArr, devArr) {
        // compare two array datatypes and return common to setBoth
        let commonHolder = []
        for (let sci of sciArr) {
          for (let dev of devArr) {
            if (sci === dev) {
              commonHolder.push({'cnrl': sci, 'text': 'word'})
            }
          }
        }
        this.livedtypes = commonHolder
        return commonHolder
      },
      selectCatTD (cIN) {
        cIN.active = !cIN.active
        kBus.$emit('setVDataCategory', cIN)
      },
      subContext () {
        this.subcontext = this.subcontextholder.columncodes
      },
      selectTime (tIN) {
        // dispatch to store up update state of time options
        this.$store.dispatch('actionUpateTimeOption', tIN)
        let tt = {}
        if (tIN.text === 'SELECT') {
          // display start end endPoint
          tt.active = tIN.active
          tt.text = tIN.text
          tt.start = this.kContext.analysisStart
          tt.end = this.kContext.analysisEnd
          kBus.$emit('setVTime', tt)
        } else {
          kBus.$emit('setVTime', tIN)
        }
      },
      livingPaper () {
        shell.openExternal(this.liveScience.livingpaper)
      },
      listenkBus () {
        // console.log(kBus)
      },
      updateKBcontext (kbl) {
        console.log('update the open knowledge')
        console.log(kbl)
        // set device
        /* let keepDevices = []
        // remove or update status of existing device
        for (let dvl of this.devices) {
          for (let adev of kbl.devices) {
            if (dvl.device_mac !== adev.device_mac) {
              dvl.active = false
              keepDevices.push(dvl)
            } else {
              dvl.active = true
              keepDevices.push(dvl)
            }
          }
        }
        this.$store.dispatch('actionDeviceUpdateOK', keepDevices)
        // updated linked datatypes to this device
        this.datatypes = kbl.datatypes
        // set the timeperiod
        let timeOptions = this.timeNav('time-index')
        let updatedTimeSeg = []
        for (let timo of timeOptions) {
          for (let itim of kbl.time.timeseg) {
            if (timo.text !== itim) {
              timo.active = false
              updatedTimeSeg.push(timo)
            } else {
              timo.active = true
              updatedTimeSeg.push(timo)
            }
          }
        }
        this.selectTime = updatedTimeSeg
        // set resolution
        this.resolution[0].active = true */
      }
    }
  }
</script>

<style>
#knowledge-context {
  margin-left: 0em;
  border: 0px solid orange;
}

#context-knowledge-holder {
  margin-left: 5px;
}

.active{
  background-color:#8ec16d;
  color: purple;
}

.context-horizontal {
  display: inline;
  margin: 1em;
  min-height: 40px;
}

#select-knowledge {
  float: right;
  margin-left: 1em;
}

#knowlege-boxes {
  background-color: #eae6ed;
  margin: 0em;
}

#data-boxes {
  border: 0px solid orange;
}

.context-box {
  display: inline-block;
  vertical-align: top;
  border-right: 1px dashed #f4f0f7;
  margin-left: 20px;
  width: 180px;
}

.context-box header {
  background-color: #eae6ed;
  border-bottom: 2px dotted #6F6B63;
  margin: 4px;
}

.knowledge-item {
  display: block;
  font-weight: bold;
  border: 0px solid black;
  margin-bottom: 10px;
}

.context-box-science {
  float: left;
  width: 56%;
  padding: 1em;
  border: 1px solid grey;
}

.context-time {
  display: inline;
  margin: 1em;
  min-height: 40px;
}

#clear-data-box {
  clear: both;
}

#open-knowledge {
  display: block;
  background-color: #eae6ed; /* #c4afdb;*/
  height: 40px;
  width: 200px;
  padding-left: 10px;
  padding-top: 10px;
  border: 0px solid black;
}

#open-knowledge.active {
  background-color: #eae6ed;
  color: purple;
}

#history-box {
  float: right;
  border: 0px solid green;
  margin: 10px;
}
</style>

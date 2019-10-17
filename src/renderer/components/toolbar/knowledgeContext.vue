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
          <!-- <header>Live Datatypes</header>
          <ul>
            <li id="data-type-live" class="knowledge-item" v-for="lts in livedtypes">
              <a class="" href="" id="cnrl-data" @click.prevent="selectDatatypes(sdts)" v-bind:class="{ 'active': false }" >{{ lts.text }}</a>
            </li>
          </ul> -->
          <header>Science Datatypes</header>
          <ul>
            <li id="data-type-live" class="knowledge-item" v-for="sdts in scidtypes">
              <a class="" href="" id="bmp-data" @click.prevent="selectSciDatatypes(sdts)" v-bind:class="{ 'active':sdts.active }">{{ sdts.text }}</a>
            </li>
          </ul>
          <header>Device DataTypes - </header>
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
        <div id="context-science" class="context-box">
          <header>Science Computations - </header>
            <ul>
              <li >
                <select v-model="selectedCompute" @change="updateSciDTs(selectedCompute)">
                <option class="science-compute" v-for="scoption in scoptions" v-bind:value="scoption.cid">
                  {{ scoption.text }}
                </option>
              </select>
              </li>
              <li>
                <a href="" id="liveScience.livingpaperLiving" @click.prevent="livingPaper()">Paper: </a>
              </li>
            </ul>
        </div>
        <div id="context-time" class="context-box">
          <header>Time Period:</header>
            <ul>
              <li v-if="timeSeg" v-for="t in timeSeg" class="context-time">
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
      <div id="history-box">
        <div id="history-learn" class="live-kelement2">
          <div id="history-learn-container">
            <div id="history-view">
              <a href="" id="history-button" @click.prevent="viewHistory(hist)" v-bind:class="{ 'active': hist.active}">{{ hist.name }}</a>
            </div>
          </div>
        </div>
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
          name: 'OPEN KNOWLEDGE',
          id: 'learn-status',
          active: false
        },
        hist:
        {
          name: 'View compute list',
          id: 'learn-history',
          active: false
        },
        liveScience: {},
        knowledgeSummary: '',
        sensors: [],
        datatypes: [],
        scidtypes: [],
        cdtypes: [],
        scoptions: [],
        selectedCompute: 'A',
        sciencedataMapping: {},
        kwords: {},
        subcontextholder: [],
        subcontext: [],
        timeSeg: [],
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
      this.setAccess()
      kBus.$on('closeKnowledge', (cData) => {
        this.ok.active = true
        this.openKnowledge(this.ok)
      })
    },
    computed: {
      devices: function () {
        return this.$store.getters.liveContext.device
      }
    },
    mounted () {
    },
    mixins: [liveMixinSAFEflow],
    methods: {
      setAccess () {
        this.languageContext()
        this.scienceContext()
        // this.deviceContext()
        this.timeContext()
      },
      openKnowledge (ok) {
        ok.active = !ok.active
        if (ok.active === true) {
          ok.name = 'Close Knowledge'
          // this.$emit('clearKbox')
        } else {
          ok.name = 'OPEN KNOWLEDGE'
        }
      },
      selectKnowledge (k) {
        k.active = !k.active
        // display language for
        this.displayLanugage(k.id)
      },
      timeContext () {
        // call the CNRL for time segment option live in SAFEnetwork
        this.timeSeg = this.timeNav('time-index')
      },
      displayLanugage (cnrlID) {
        // loop over match and display words or display human body graphic
        this.kwords = []
        let lanuageCNRL = this.GETcnrlLivingKnowledge(cnrlID)
        let wordsPlacer = {}
        wordsPlacer.word = lanuageCNRL.prime.word
        // wordsPlacer.wordconnect = lanuageCNRL.prime[1].word
        this.kwords = wordsPlacer
      },
      selectLanguage (l) {
        l.active = !l.active
        kBus.$emit('setVLanguage', l)
        // this.$emit('setVLanguage', l)
      },
      selectDevice (s) {
        s.active = !s.active
        kBus.$emit('setVDevice', s)
        this.dataTypeDevice(s)
      },
      selectDatatypes (std) {
        std.active = !std.active
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
        let refContext = 'human'
        let lanuageCNRL = this.GETcnrlLivingKnowledge(refContext)
        this.kwords = lanuageCNRL
      },
      deviceContext () {
        this.devices = this.$store.getters.liveContext.device
      },
      dataTypeDevice (devC) {
        let devDTHolder = []
        let deviceDTypes = this.GETcnrlDeviceDTs(devC.cnrl)
        devDTHolder.push(deviceDTypes)
        this.datatypes = devDTHolder[0].datatypes
      },
      dataType () {
        // make call to set start dataType for the device sensors
        const localthis = this
        let sciDTHolder = []
        let cnrlIDholderSci = []
        // loop over science for this context and display range of datatypes, sub types and match to sensor thus device
        for (let scLiv of this.scoptions) {
          let sciDTypes = this.cnrlLookup(scLiv.cid)
          sciDTHolder.push(sciDTypes.tableStructure)
        }
        // extract CNRL ids for science
        for (let cnrli of localthis.scidtypes) {
          for (let cnlist of cnrli) {
            cnrlIDholderSci.push(cnlist.cnrl)
          }
        }
        // take the two start points and see what is in common
        // this.compareDataTypes(cnrlIDholderSci, cnrlIDholderDev)
      },
      scienceContext () {
        // set the first science priority on start of RS
        this.scoptions = this.$store.getters.liveScience
      },
      updateSciDTs (sciIN) {
        this.activeEntity = sciIN
        // use cid to look up datatype for this scienceEntities
        let sciDTypesSelect = this.GETcnrlScienceDTs(sciIN)
        sciDTypesSelect.cnrl = sciIN
        this.scidtypes = sciDTypesSelect.datatypes
        this.cdtypes = sciDTypesSelect.categories
        this.liveScience.livingpaper = sciDTypesSelect.contract.livingpaper
        kBus.$emit('setVScience', sciDTypesSelect.contract)
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
        tIN.active = !tIN.active
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
      viewHistory (hist) {
        hist.active = !hist.active
        if (hist.active === true) {
          hist.name = 'Close compute list'
        } else {
          hist.name = 'View compute list'
        }
        this.$emit('viewHistory', hist)
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
  background-color: #dfc8f7;
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
  background-color: #d7e6f5;
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
  background-color: #c4afdb;
  height: 40px;
  width: 200px;
  padding-left: 10px;
  padding-top: 10px;
  border: 0px solid black;
}

#open-knowledge.active {
  background-color:#8ec16d;
  color: purple;
}

#history-box {
  float: right;
  border: 1px solid green;
  margin: 10px;
}
</style>

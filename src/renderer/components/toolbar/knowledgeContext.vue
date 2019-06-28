<template>
  <div id="knowledge-view">
    <div id="select-knowledge">
      <a href="" id="open-knowledge" @click.prevent="openKnowledge(ok)" v-bind:class="{ 'active': ok.active}">{{ ok.name }}</a>
    </div>
    <div id="knowlege-boxes" v-if="ok.active">
      <div id="context-language">
        <ul>
          <li v-for="sk in knowledge" class="context-horizontal">
            <a href="" id="" @click.prevent="selectKnowledge(sk)" v-bind:class="{ 'active': sk.active}">{{ sk.name }}</a>
          </li>
        </ul>
        <div id="language-words">
          <a href="" id="" @click.prevent="selectLanguage(kwords)">{{ kwords.word }} {{ kwords.wordconnect }}</a>
        </div>
      </div>
      <div id="data-boxes">
        <div id="context-devices" class="context-box">
          <header>Devices:</header>
            <ul>
              <li v-for="dev in devices"> {{ dev[0] }}
                <a href="" id="" @click.prevent="selectDevice(dev)" v-bind:class="{ 'active': dev.active}">{{ dev.device_name }}</a>
              </li>
            </ul>
        </div>
        <div id="context-datatypes" class="context-box">
          <header>Live Datatypes</header>
          <ul>
            <li id="data-type-live" v-for="lts in livedtypes">
              <a class="" href="" id="cnrl-data" @click.prevent="selectDatatypes(sdts)" v-bind:class="{ 'active': false }">{{ lts.text }}</a>
            </li>
          </ul>
          <header>Science Datatypes</header>
          <ul>
            <li id="data-type-live" v-for="sdts in scidtypes">
              <a class="" href="" id="bmp-data" @click.prevent="selectSciDatatypes(sdts)" v-bind:class="{ 'active':sdts.active }">{{ sdts.text }}</a>
            </li>
          </ul>
          <header>Categories</header>
          <ul>
            <li id="data-type-live" v-for="cdt in cdtypes">
              <a class="" href="" id="bmp-data" @click.prevent="selectCatTD(cdt)" v-bind:class="{ 'active':cdt.active }">{{ cdt.text }}</a>
            </li>
          </ul>
          <header>Device DataTypes - </header>
            <ul>
              <li id="data-type-live" v-for="dts in datatypes">
                <a class="" href="" id="bmp-data" @click.prevent="selectDatatypes(dts)" v-bind:class="{ 'active': dts.active}">{{ dts.text }}</a>
                <!-- <a class="" href="" id="sub-data" @click.prevent="subContext(dts)" v-bind:class="{ 'active': dts.active}"> >>> </a>
                 <div id="sub-context-holder">
                  <ul>
                    <li v-for="subC in subcontext">
                      <a class="" href="" id="" @click.prevent="subContext(sen)" v-bind:class="{ 'active': subC.active}"> {{ subC }} </a>
                    </li>
                  </ul>
                </div> -->
              </li>
            </ul>
        </div>
        <div id="context-science" class="context-box-science">
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
                Living Paper: <a href="" @click.prevent="livingPaper()">{{ liveScience.livingpaper }}</a>
              </li>
            </ul>
            <div id="context-time">
              <header>Time:</header>
                <ul>
                  <li v-for="t in timeSeg" class="context-time">
                    <a href="" id="" @click.prevent="selectTime(t)" v-bind:class="{ 'active': t.active, 'text-danger': hasError}">{{ t.text }}</a>
                  </li>
                </ul>
                <div v-if="timeSelect !== undefine" id="time-select" >
                  <div id="start-point" class="context-time">Start: {{ kContext.analysisStart }}</div>
                  <div id="end-point" class="context-time">End: {{ kContext.analysisEnd }}</div>
                </div>
            </div>
            <div id="context-resolution">
              <header>Resolution:</header>
                <ul>
                  <li v-for="r in resolution" class="context-time">
                    <a href="" id="" @click.prevent="selectResolution(r)" v-bind:class="{ 'active': r.active}">{{ r.text }}</a>
                  </li>
                </ul>
            </div>
        </div>
        <div id="clear-data-box"></div>
      </div>
    </div>
  </div>
</template>

<script>
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
        liveScience: {},
        knowledgeSummary: '',
        devices: [],
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
        timeSelect: true,
        livedtypes: [],
        startLine: '1',
        stopLine: '2'
      }
    },
    created () {
      this.setAccess()
      kBus.$on('closeKnowledge', (cData) => {
        this.openKnowledge(this.ok)
      })
    },
    computed: {
      system: function () {
        return this.$store.state.system
      },
      safeFlow: function () {
        return this.$store.state.safeFlow
      },
      context: function () {
        return this.$store.state.context
      }
    },
    mounted () {
    },
    methods: {
      setAccess () {
        this.liveSafeFlow = this.safeFlow
        this.languageContext()
        this.scienceContext()
        this.deviceContext()
        this.timeContext()
      },
      openKnowledge (ok) {
        ok.active = !ok.active
        if (ok.active === true) {
          ok.name = 'Close Knowledge'
        } else {
          ok.name = 'OPEN KNOWLEDGE'
        }
      },
      selectKnowledge (k) {
        console.log(k)
        k.active = !k.active
        // display language for
        this.displayLanugage(k.id)
      },
      timeContext () {
        // call the CNRL for time segment option live in SAFEnetwork
        this.timeSeg = this.liveSafeFlow.cnrlTimeIndex('time-index')
      },
      displayLanugage (cnrlID) {
        // loop over match and display words or display human body graphic
        // console.log('inplang')
        this.kwords = []
        let lanuageCNRL = this.liveSafeFlow.cnrlLivingKnowledge(cnrlID)
        console.log(lanuageCNRL)
        let wordsPlacer = {}
        wordsPlacer.word = lanuageCNRL.prime.word
        // wordsPlacer.wordconnect = lanuageCNRL.prime[1].word
        this.kwords = wordsPlacer
      },
      selectLanguage (l) {
        // console.log(l)
        l.active = !l.active
        kBus.$emit('setVLanguage', l)
        // this.$emit('setVLanguage', l)
      },
      selectDevice (s) {
        // console.log(s)
        s.active = !s.active
        kBus.$emit('setVDevice', s)
        // display datatypes for this device source
        this.dataTypeDevice()
      },
      selectDatatypes (std) {
        console.log('datatype selected')
        console.log(std)
        std.active = !std.active
        kBus.$emit('setVDatatypes', std)
      },
      selectSciDatatypes (std) {
        // console.log('science data types set')
        // console.log(std)
        std.active = !std.active
        kBus.$emit('setVDatatypes', std)
      },
      selectResolution (r) {
        // console.log(r)
        r.active = !r.active
        kBus.$emit('setVResolution', r)
      },
      languageContext () {
        let refContext = 'human'
        let lanuageCNRL = this.liveSafeFlow.cnrlLivingKnowledge(refContext)
        // console.log('semanics')
        // console.log(lanuageCNRL)
        this.kwords = lanuageCNRL
      },
      deviceContext () {
        var localthis = this
        function callbackC (dataH) {
          // console.log('fresh update---')
          // console.log(dataH)
          localthis.devices = dataH
          // console.log('start deviceslist')
          // setting dataType Smartcontract CNRL id  (needs to be extract and mapp to storageAPI)
          localthis.devices[0].cnrl = 'cnrl-33221101'
          localthis.devices[1].cnrl = 'cnrl-33221101'
          console.log(dataH)
          localthis.$store.commit('setDevice', dataH)
        }
        const deviceSet = localthis.$store.getters.liveContext.device
        console.log('device context')
        console.log(deviceSet)
        // has the device context been set already?  Assume no for NOW
        if (deviceSet.length > 678) {
          this.devices = deviceSet
          console.log('device settings')
          console.log(this.devices)
        } else {
          // make call to set start dataContext for this pubkey
          const flag = 'device'
          this.liveSafeFlow.toolkitContext(flag, callbackC)
          // console.log('device callsettings')
        }
        console.log(this.devices)
      },
      dataTypeDevice () {
        console.log('device data types build')
        console.log(this.devices)
        let devDTHolder = []
        let cnrlIDholderDev = []
        // repeat for datatyes coming from the mobile app CRNL contract
        for (let devCdt of this.devices) {
          console.log('devices')
          console.log(devCdt)
          let deviceDTypes = this.liveSafeFlow.cnrlDeviceDTs(devCdt.cnrl)
          devDTHolder.push(deviceDTypes)
        }
        console.log('device DTs')
        console.log(devDTHolder)
        this.datatypes = devDTHolder[0].datatypes
        for (let cnrldi of this.datatypes) {
          for (let cnd of cnrldi) {
            for (let cns of cnd) {
              cnrlIDholderDev.push(cns.cnrl)
            }
          }
        }
      },
      dataType () {
        // make call to set start dataType for the device sensors
        // console.log('start data type')
        const localthis = this
        let sciDTHolder = []
        let cnrlIDholderSci = []
        // loop over science for this context and display range of datatypes, sub types and match to sensor thus device
        for (let scLiv of this.scoptions) {
          let sciDTypes = this.liveSafeFlow.cnrlLookup(scLiv.cid)
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
        // console.log(this.scoptions)
      },
      updateSciDTs (sciIN) {
        // console.log('science has changed')
        this.activeEntity = sciIN
        // use cid to look up datatype for this scienceEntities
        let sciDTypesSelect = this.liveSafeFlow.cnrlScienceDTs(sciIN)
        console.log('science contract')
        console.log(sciDTypesSelect)
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
        console.log('categorisation of data type')
        cIN.active = !cIN.active
        console.log(cIN)
        kBus.$emit('setVDataCategory', cIN)
      },
      subContext () {
        // console.log('sub data types')
        // console.log(this.subcontextHolder)
        // console.log(this.subcontextHolder.columncodes)
        this.subcontext = this.subcontextholder.columncodes
      },
      selectTime (tIN) {
        // console.log('time set')
        tIN.active = !tIN.active
        // console.log(tIN)
        let tt = {}
        if (tIN.text === 'SELECT') {
          // display start end endPoint
          tt.active = tIN.active
          tt.text = tIN.text
          tt.start = this.kContext.analysisStart
          tt.end = this.kContext.analysisEnd
          // console.log(tt)
          kBus.$emit('setVTime', tt)
        } else {
          kBus.$emit('setVTime', tIN)
        }
      },
      livingPaper () {
        shell.openExternal(this.liveScience.livingpaper)
      },
      listenkBus () {
        console.log(kBus)
      }
    }
  }
</script>

<style>
.active{
  background-color:#8ec16d;
  color: white;
}

.context-horizontal {
  display: inline;
  margin: 1em;
  min-height: 40px;
}

#knowledge-view {
  border: 1px solid orange;
}

#context-devices {
  margin:1em;
}

#select-knowledge {
  border: 1px solid green;
  margin: 1em;
}

#knowlege-boxes {
  border: 1px solid blue;
  margin: 2em;
}

#data-boxes {
  border: 1px solid orange;
}

.context-box {
  float: left;
  width: 20%;
  padding: 1em;
  border: 2px solid grey;
}

.context-box-science {
  float: left;
  width: 56%;
  padding: 1em;
  border: 2px solid grey;
}

.context-time {
  display: inline;
  margin: 1em;
  min-height: 40px;
}

#clear-data-box {
  clear: both;
}
</style>

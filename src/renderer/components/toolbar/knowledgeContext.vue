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
              <li v-for="dev in devices">
                <a href="" id="" @click.prevent="selectContext(dev)" v-bind:class="{ 'active': dev.active}">{{ dev.device_name }}</a>
              </li>
            </ul>
        </div>
        <div id="context-datatypes" class="context-box">
          <header>Live Datatypes</header>
          <ul>
            <li id="data-type-live" v-for="lts in livedtypes">
              <a class="" href="" id="cnrl-data" @click.prevent="selectContext(sdts)" v-bind:class="{ 'active': lts.active }">{{ lts.text }}</a>
              <!-- <a class="" href="" id="sub-data" @click.prevent="subContext(sdts)" v-bind:class="{ 'active': sdts.active}"> >>> </a>
              <div id="sub-context-holder">
                <ul>
                  <li v-for="subC in subcontext">
                    <a class="" href="" id="" @click.prevent="subContext(sen)" v-bind:class="{ 'active': subC.active}"> {{ subC }} </a>
                  </li>
                </ul>
              </div> -->
            </li>
          </ul>
          <header>Science Datatypes</header>
          <ul>
            <li id="data-type-live" v-for="sdts in scidtypes[0]">
              <a class="" href="" id="bmp-data" @click.prevent="selectContext(sdts)" v-bind:class="{ 'active': sdts.active }">{{ sdts.text }}</a>
              <!-- <a class="" href="" id="sub-data" @click.prevent="subContext(sdts)" v-bind:class="{ 'active': sdts.active}"> >>> </a>
              <div id="sub-context-holder">
                <ul>
                  <li v-for="subC in subcontext">
                    <a class="" href="" id="" @click.prevent="subContext(sen)" v-bind:class="{ 'active': subC.active}"> {{ subC }} </a>
                  </li>
                </ul>
              </div> -->
            </li>
          </ul>
          <header>Device DataTypes - </header>
            <ul>
              <li id="data-type-live" v-for="dts in datatypes[0][0]">
                <a class="" href="" id="bmp-data" @click.prevent="selectContext(dts)" v-bind:class="{ 'active': dts.active}">{{ dts.text }}</a>
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
              <li>
                Experiment status: n=1
              </li>
            </ul>
            <div id="context-time">
              <header>Time:</header>
                <ul>
                  <li v-for="t in timeSeg" class="context-time">
                    <a href="" id="" @click.prevent="selectTime(t)" v-bind:class="{ 'active': t.active}">{{ t.text }}</a>
                  </li>
                </ul>
                <div v-if="timeSelect !== undefine" id="time-select" >
                  <div id="start-point" class="context-time">Start: {{ startLine }}</div>
                  <div id="end-point" class="context-time">End: {{ stopLine }}</div>
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
  import SAFEflow from '../../safeflow/safeFlow.js'
  const shell = require('electron').shell

  export default {
    name: 'knowledge-context',
    components: {
    },
    props: {
      knowledgeData: {
        type: Object
      },
      inputData: {
        type: Object
      }
    },
    data () {
      return {
        knowledge:
        [{
          name: 'human',
          id: 'cnrl-k1',
          active: true
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
        scoptions: [],
        selectedCompute: 'A',
        sciencedataMapping: {},
        kwords: {},
        subcontextholder: [],
        subcontext: [],
        timeSeg:
        [{
          text: 'day',
          id: 'cnrl-t1',
          active: true
        },
        {
          text: 'week',
          id: 'cnrl-t2',
          active: true
        },
        {
          text: 'month',
          id: 'cnrl-t3',
          active: true
        },
        {
          text: 'year',
          id: 'cnrl-t4',
          active: true
        },
        {
          text: 'SELECT',
          id: 'cnrl-t5',
          active: true
        }],
        resolution:
        [{
          text: 'per minute',
          id: 'cnrl-r1',
          active: true
        }],
        timeSelect: true,
        livedtypes: []
      }
    },
    created () {
      this.setAccess()
      this.scienceContext()
      this.languageContext()
      this.deviceContext()
      this.knowledgeData.seenStatus = true
    },
    computed: {
      safeFlow: function () {
        return this.$store.state.safeFlow
      },
      system: function () {
        return this.$store.state.system
      },
      tools: function () {
        return this.$store.state.tools
      },
      context: function () {
        return this.$store.state.context
      }
    },
    mounted () {
      this.startTools()
    },
    methods: {
      setAccess () {
        this.liveSafeFlow = new SAFEflow(this.system)
      },
      startTools () {
        this.liveTools = this.$store.getters.liveTools
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
      displayLanugage (cnrlID) {
        // loop over match and display words or display human body graphic
        console.log('inplang')
        this.kwords = []
        let lanuageCNRL = this.liveSafeFlow.cnrlSemanticKnowledge(cnrlID)
        console.log(lanuageCNRL)
        let wordsPlacer = {}
        wordsPlacer.word = lanuageCNRL.prime.word
        // wordsPlacer.wordconnect = lanuageCNRL.prime[1].word
        this.kwords = wordsPlacer
      },
      selectLanguage (l) {
        console.log(l)
        l.active = !l.active
        this.$emit('languageSet', l)
      },
      selectContext (s) {
        console.log(s)
        s.active = !s.active
        this.$emit('knowledgeSet', s)
      },
      selectResolution (r) {
        console.log(r)
        r.active = !r.active
        this.$emit('resolutionSet', r.text)
      },
      languageContext () {
        let refContext = 'human'
        let lanuageCNRL = this.liveSafeFlow.cnrlSemanticKnowledge(refContext)
        console.log('semanics')
        console.log(lanuageCNRL)
        this.kwords = lanuageCNRL
      },
      deviceContext () {
        var localthis = this
        function callbackC (dataH) {
          localthis.devices = dataH
          console.log('start deviceslist')
          localthis.devices[0].cnrl = 'cnrl-33221101'
          console.log(localthis.devices)
          localthis.$store.commit('setDevice', dataH)
          localthis.dataType()
        }
        const deviceSet = localthis.$store.getters.liveContext.device
        // has the device context been set already?
        if (deviceSet.length > 1) {
          localthis.devices = deviceSet
          console.log('device settings')
          console.log(this.devices)
        } else {
          // make call to set start dataContext for this pubkey
          const flag = 'device'
          this.liveSafeFlow.toolkitContext(flag, callbackC)
          console.log('device callsettings')
          console.log(this.devices)
        }
        console.log(this.devices)
      },
      dataType () {
        // make call to set start dataType for the device sensors
        console.log('start data type')
        const localthis = this
        let sciDTHolder = []
        let devDTHolder = []
        let cnrlIDholderSci = []
        let cnrlIDholderDev = []
        // loop over science for this context and display range of datatypes, sub types and match to sensor thus device
        for (let scLiv of this.scoptions) {
          let sciDTypes = this.liveSafeFlow.cnrlLookup(scLiv.cid)
          sciDTHolder.push(sciDTypes.tableStructure)
          /* if (sciDTypes.subsource.length > 1) {
            let sourceDTypes = this.liveSafeFlow.liveCNRL.subSource(sciDTypes.subsource)
            console.log('sub datatypes')
            console.log(sourceDTypes)
            // this.subcontextholder.push(sourceDTypes.prime)
          } */
        }
        localthis.scidtypes = sciDTHolder
        // extract CNRL ids for science
        for (let cnrli of localthis.scidtypes) {
          for (let cnlist of cnrli) {
            cnrlIDholderSci.push(cnlist.cnrl)
          }
        }
        // repeat for datatyes coming from the mobile app CRNL contract
        for (let devCdt of this.devices) {
          let devDTypes = this.liveSafeFlow.cnrlLookup(devCdt.cnrl)
          devDTHolder.push(devDTypes.tableStructure)
          // next are there further details on ie. follow subsource refContext
          /* if (devDTypes.type === 'dtpackaging') {
            console.log('extra data types')
            let tdtHolder = []
            for (let tdt of devDTypes.tableStructure) {
              console.log('table datatypes')
              console.log(tdt)
              // console.log(devDTypes.tableStructure)
              /* for (let dtts of devDTypes.tableStructure) {
                console.log(tdt)
                console.log(dtts)
                console.log('extract dt from table')
                console.log(dtts[tdt])
                // localthis.subcontextholder.push(devDTypes.prime)
                tdtHolder.push(dtts[tdt])
              }
            }
            console.log('table DT holder')
            console.log(tdtHolder)
            localthis.datatypes.push(tdtHolder)
          } else {
            console.log('further CNRL found')
            let subsubDTypes = this.liveSafeFlow.cnrlLookup(devDTypes.cnrl)
            console.log(subsubDTypes)
            localthis.subcontextholder.push(subsubDTypes.prime)
            localthis.datatypes.push(devDTypes.prime)
          } */
        }
        console.log('device DTs')
        this.datatypes = devDTHolder
        for (let cnrldi of this.datatypes) {
          for (let cnd of cnrldi) {
            for (let cns of cnd) {
              cnrlIDholderDev.push(cns.cnrl)
            }
          }
        }
        // take the two start points and see what is in common
        this.compareDataTypes(cnrlIDholderSci, cnrlIDholderDev)
        console.log('datatype GROUP')
        console.log(localthis.scidtypes)
        console.log(this.datatypes)
        // console.log(this.subcontextholder)
        /* function callbackT (dataH) {
          localthis.sensors = dataH
          localthis.$store.commit('setDatatype', dataH)
        }
        const datatypeSet = localthis.$store.getters.liveContext.datatype
        console.log(datatypeSet)
        // has the device context been set already?
        if (datatypeSet.length > 1) {
          console.log('already set dt')
          console.log(localthis.activeEntity)
          localthis.sciencedataMapping[localthis.activeEntity] = datatypeSet
          console.log(localthis.sciencedataMapping[localthis.activeEntity])
          localthis.sensors = localthis.sciencedataMapping[localthis.activeEntity]
        } else {
          console.log('NOT already set dt')
          const flag = 'datatype'
          this.liveSafeFlow.toolkitContext(flag, callbackT)
        } */
      },
      scienceContext () {
        // set the first science priority on start of RS
        this.scoptions = this.$store.getters.liveScience
        console.log(this.scoptions)
        this.$store.commit('setScience', this.scoptions[0])
      },
      updateSciDTs (sciIN) {
        console.log('science has changed')
        this.activeEntity = sciIN
        // use cid to look up datatype for this scienceEntities
        let sciDTypesSelect = this.liveSafeFlow.cnrlLookup(sciIN)
        sciDTypesSelect.cnrl = sciIN
        console.log('science contract')
        console.log(sciDTypesSelect)
        this.liveScience.livingpaper = sciDTypesSelect.livingpaper
        // trace back to source dataTypes (ie does have mobile source?)
        // let sourceDTypes = this.liveSafeFlow.liveCNRL.subSource(sciDTypes.subsource)
        // this.subcontextholder = sourceDTypes
        // console.log('mobile source CNRL')
        // console.log(sourceDTypes)
        this.$emit('scienceSet', sciDTypesSelect)
        // this.sensors = sciDTypes.prime
        // this.resolutionSet = sciDTypes.resolution[0].text
        // this.$store.commit('setDatatype', sciDTypes.prime)
        // this.$store.commit('setResolutiontype', sciDTypes.resolution)
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
        console.log('common holder')
        console.log(commonHolder)
        this.livedtypes = commonHolder
        return commonHolder
      },
      subContext () {
        console.log('sub data types')
        console.log(this.subcontextHolder)
        console.log(this.subcontextHolder.columncodes)
        this.subcontext = this.subcontextholder.columncodes
      },
      selectTime (tIN) {
        // if select show slider on chart
        console.log('time set')
        console.log(tIN)
        if (tIN === 'SELECT') {
          // display start end endPoint
        } else {
          this.$emit('timeSet', tIN)
        }
      },
      livingPaper () {
        shell.openExternal(this.liveScience.livingpaper)
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

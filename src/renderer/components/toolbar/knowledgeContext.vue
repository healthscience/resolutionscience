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
          <header>DataTypes - </header>
            <ul>
              <li id="bmp-data-sensor" v-for="sen in sensors">
                <a class="" href="" id="bmp-data" @click.prevent="selectContext(sen)" v-bind:class="{ 'active': sen.active}">{{ sen.text }}</a>
                <a class="" href="" id="sub-data" @click.prevent="subContext(sen)" v-bind:class="{ 'active': sen.active}"> >>> </a>
                <div id="sub-context-holder">
                  <ul>
                    <!-- <li v-for="subC in subcontext">
                      <a class="" href="" id="" @click.prevent="subContext(sen)" v-bind:class="{ 'active': subC.active}"> {{ subC }} </a>
                    </li> -->
                  </ul>
                </div>
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
              <!--<span>Selected: {{ selectedCompute }}</span>-->
              </li>
              <li>
                Living Paper: <a href="https://docs.google.com/document/d/11JWcbBrwgLIqPc7V7GpI_WbACuIS_4h630zdT66Re3s/edit?usp=sharing" @click.prevent="livingPaper()">Recovery Heart Rate</a>
              </li>
              <li>
                Experiment status: n=1
              </li>
            </ul>
            <div id="context-time">
              <header>Time:</header>
                <ul>
                  <li v-for="t in timeSeg" class="context-time">
                    <a href="" id="" @click.prevent="selectTime(t)" v-bind:class="{ 'active': t.active}">{{ t.name }}</a>
                  </li>
                </ul>
                <div v-if="timeSelect !== undefine" id="time-select" >
                  <div id="start-point">Start point: {{ startLine }}</div>
                  <div id="end-point">End point: {{ stopLine }}</div>
                </div>
            </div>
            <div id="context-resolution">
              <header>Resolution:</header>
                <ul>
                  <li v-for="r in resolution" class="context-time">
                    <a href="" id="" @click.prevent="selectResolution(r)" v-bind:class="{ 'active': r.active}">{{ r.name }}</a>
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
        knowledgeSummary: '',
        devices: [],
        sensors: [],
        scoptions: [],
        selectedCompute: 'A',
        sciencedataMapping: {},
        kwords: {},
        subcontextholder: [],
        subcontext: [],
        timeSeg:
        [{
          name: 'day',
          id: 'cnrl-t1',
          active: true
        },
        {
          name: 'week',
          id: 'cnrl-t2',
          active: true
        },
        {
          name: 'month',
          id: 'cnrl-t3',
          active: true
        },
        {
          name: 'year',
          id: 'cnrl-t4',
          active: true
        },
        {
          name: 'SELECT',
          id: 'cnrl-t5',
          active: true
        }],
        resolution:
        [{
          name: 'per minute',
          id: 'cnrl-r1',
          active: true
        }],
        timeSelect: true
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
        wordsPlacer.word = lanuageCNRL.prime[0].word
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
        // loop over science for this context and display range of datatypes, sub types and match to sensor thus device
        for (let scLiv of this.scoptions) {
          console.log('sci cnrl id==')
          console.log(scLiv)
          let sciDTypes = this.liveSafeFlow.cnrlLookup(scLiv.cid)
          console.log('science datatypes')
          console.log(sciDTypes)
          console.log(sciDTypes.subsource)
          this.sensors.push(sciDTypes.prime)
          if (sciDTypes.subsource.length > 1) {
            let sourceDTypes = this.liveSafeFlow.liveCNRL.subSource(sciDTypes.subsource)
            console.log('sub datatypes')
            console.log(sourceDTypes)
            localthis.subcontextholder.push(sourceDTypes.prime)
          }
        }
        // repeat for datatyes coming from the mobile app CRNL contract
        for (let devCdt of this.devices) {
          console.log('device cnrl')
          console.log(devCdt.cnrl)
          let devDTypes = this.liveSafeFlow.cnrlLookup(devCdt.cnrl)
          console.log('device datatypes')
          console.log(devDTypes)
          // next are there further details on ie. follow subsource refContext
          if (devDTypes.cnrl === 'cnrl-primary') {
            console.log('this is base source CNRL')
            localthis.subcontextholder.push(devDTypes.prime)
          } else {
            console.log('further CNRL found')
            let subsubDTypes = this.liveSafeFlow.cnrlLookup(devDTypes.cnrl)
            console.log(subsubDTypes)
            localthis.subcontextholder.push(subsubDTypes.prime)
            if (subsubDTypes.cnrl === 'cnrl-primary') {
              console.log('this is 2deeper base source CNRL')
              localthis.subcontextholder.push(subsubDTypes.prime)
            } else {
              // more to find
            }
          }
        }
        console.log('datatype GROUP')
        console.log(this.sensors)
        console.log(this.subcontextholder)
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
      updateSciDTs (sciDTin) {
        console.log('science has changed')
        // console.log(sciDTin)
        this.activeEntity = sciDTin
        // use cid to look up datatype for this scienceEntities
        let sciDTypes = this.liveSafeFlow.cnrlLookup(sciDTin)
        console.log('science datatypes')
        console.log(sciDTypes)
        console.log(sciDTypes.subsource)
        // trace back to source dataTypes (ie does have mobile source?)
        let sourceDTypes = this.liveSafeFlow.liveCNRL.subSource(sciDTypes.subsource)
        this.subcontextholder = sourceDTypes
        console.log('mobile source CNRL')
        console.log(sourceDTypes)
        this.$emit('scienceSet', sciDTypes)
        // this.sensors = sciDTypes.prime
        // this.resolutionSet = sciDTypes.resolution[0].text
        // this.$store.commit('setDatatype', sciDTypes.prime)
        // this.$store.commit('setResolutiontype', sciDTypes.resolution)
      },
      subContext () {
        console.log('sub data types')
        console.log(this.subcontextHolder)
        console.log(this.subcontextHolder.columncodes)
        this.subcontext = this.subcontextholder.columncodes
      },
      selectTime (tIN) {
        // if select show slider on chart
        if (tIN === 'SELECT') {
          // display start end endPoint
        }
      },
      livingPaper () {
        console.log('living paper')
        // window.open('https://docs.google.com/document/d/11JWcbBrwgLIqPc7V7GpI_WbACuIS_4h630zdT66Re3s/edit?usp=sharing', '_blank')
        shell.openExternal('https://docs.google.com/document/d/11JWcbBrwgLIqPc7V7GpI_WbACuIS_4h630zdT66Re3s/edit?usp=sharing')
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

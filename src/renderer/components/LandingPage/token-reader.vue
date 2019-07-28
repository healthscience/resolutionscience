<template>
  <div id="token-system">
    <div id="token-verify" v-if="fileinputSeen">
      <label class="text-reader">
        Read token file
        <input type="file" @change="loadTextFromFile">
      </label>
    </div>
    <div id="keypw-feedback">
      {{ verifyfeedbackM }}
    </div>
    <div v-if="viewPkeybuttons" id="publickey-view">
      <button @click.prevent="viewPublickey" class="button is-primary">View publickey address</button>
      <button @click.prevent="viewtToken" class="button is-primary">View Token</button>
      {{ pubkeyView }}
      {{ tokenTView }}
    </div>
    <div id="pwinput-prompt" v-if="pwinputSeen">
      Please enter password
      <passwordk v-model="passwordk" :toggle="true" />
      <button @click.prevent="verifyKeypw" class="button is-primary">Verify key ownership</button>
    </div>
  </div>
</template>

<script>
  import SAFEflow from '../../safeflow/safeFlow.js'
  import Passwordk from 'vue-password-strength-meter'
  // import { sBus } from '../../main.js'

  export default {
    name: 'unlockkey-page',
    components: {
      Passwordk,
      FileReader
    },
    props: {
      viewPkey: {
        type: Boolean,
        default: false
      }
    },
    created () {
    },
    mounted () {
    },
    computed: {
      safeFlow: function () {
        return this.$store.state.safeFlow
      },
      system: function () {
        return this.$store.state.system
      },
      context: function () {
        return this.$store.state.context
      },
      science: function () {
        return this.$store.state.science
      }
    },
    data: () => ({
      keyObject: {},
      verifyfeedbackM: '',
      viewPkeybuttons: false,
      token: {},
      fileinputSeen: true,
      pwinputSeen: false,
      pubkeyView: '',
      tokenTView: '',
      passwordk: null,
      text: '',
      keybuttonseen: false,
      feedbackM: '',
      warningM: ''
    }),
    methods: {
      setAccess () {
        var localthis = this
        let startContext = this.$store.getters.liveContext
        let startDataaccess = this.$store.getters.liveSystem
        if (startDataaccess.token.length !== 0 && startContext.length !== 0) {
          const systemSet = this.$store.getters.liveSystem
          this.liveSafeFlow = new SAFEflow(systemSet)
          localthis.$store.commit('setSafeflow', this.liveSafeFlow)
          localthis.deviceContext()
        } else if (this.context) {
          this.devices = this.context.device
          this.sensors = this.context.datatype
        } else {
          // no token
        }
      },
      startExperiments () {
        let liveExper = []
        let experimentList = this.liveSafeFlow.cnrlExperimentIndex()
        for (let exl of experimentList) {
          let expCNRL = this.liveSafeFlow.cnrlLookup(exl)
          let experBundle = {}
          experBundle.cnrl = exl
          experBundle.status = false
          experBundle.contract = expCNRL
          liveExper.push(experBundle)
        }
        this.$store.dispatch('actionExperimentList', liveExper)
      },
      async startKSetting () {
        let startKset = await this.liveSafeFlow.startSettings('retreive')
        // set via store and then pick up in historyData
        this.$store.dispatch('actionStartKBundles', startKset)
      },
      async startExpMappedKbundles () {
        let mappedExpKbundles = await this.liveSafeFlow.experimentKbundles('retreive')
        // set via store and then pick up in historyData
        this.$store.dispatch('actionExperimentKBundles', mappedExpKbundles)
      },
      deviceContext () {
        // make call to set start deviceContext for this pubkey
        var localthis = this
        function callbackC (dataH) {
          localthis.devices = dataH
          localthis.$store.commit('setDevice', dataH)
          localthis.dataType()
          localthis.cnrlScience()
          localthis.startExperiments()
          localthis.startExpMappedKbundles()
          localthis.startKSetting()
        }
        const deviceFlag = 'device'
        this.liveSafeFlow.toolkitContext(deviceFlag, callbackC)
      },
      dataType () {
        // make call to set start dataType for the device sensors
        var localthis = this
        function callbackT (dataH) {
          localthis.sensors = dataH
          localthis.$store.commit('setDatatype', dataH)
        }
        const dataTypeFlag = 'dataType'
        this.liveSafeFlow.toolkitContext(dataTypeFlag, callbackT)
      },
      cnrlScience () {
        // call the CNRL api and get network science active
        let startScience = this.liveSafeFlow.cnrlScienceStart()
        this.$store.commit('setCNRLscience', startScience)
      },
      loadTextFromFile (ev) {
        // prompt for Password
        var localthis = this
        const file = ev.target.files[0]
        const reader = new FileReader()
        reader.onloadend = function () {
          const tJSONstring = reader.result
          const tokenJSON = JSON.parse(tJSONstring)
          // now use getter to store state
          localthis.token = tokenJSON
          localthis.$store.commit('setBoth', tokenJSON)
          localthis.verifyfeedbackM = 'Data token live'
          localthis.viewPkeybuttons = true
          localthis.setAccess()
        }
        reader.readAsText(file)

        // Specify a data directory (optional; defaults to ~/.ethereum)
        // var datadir = process.cwd()
        // this.tokenJSONy = (datadir)
      },
      verifyKeypw () {
        // verify key password for token
      },
      viewPublickey () {
        this.pubkeyView = 'Publickey = ' + this.token.publickey
      },
      viewtToken () {
        this.tokenTView = 'TestToken = ' + this.token.token
      }
    }
  }
</script>

<style>
.text-reader {
  position: relative;
  overflow: hidden;
  display: inline-block;

  /* Fancy button looking */
  border: 2px solid black;
  border-radius: 5px;
  padding: 8px 12px;
  cursor: pointer;
}
.text-reader input {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  opacity: 0;
}
</style>

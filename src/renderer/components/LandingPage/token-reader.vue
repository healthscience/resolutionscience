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
  import liveMixinSAFEflow from '@/mixins/safeFlowAPI'
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
    mixins: [liveMixinSAFEflow],
    mounted () {
    },
    computed: {
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
      warningM: '',
      devices: []
    }),
    methods: {
      loadTextFromFile (ev) {
        // prompt for Password
        const localthis = this
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
          localthis.connectAPIS()
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
      },
      connectAPIS () {
        // get list of all API cnrl contracts connected
        // let apiCRNLdefault = 'cnrl-33221100'
        // look up contract and get API info for default
        // let defaultAPI = this.GETcnrlLookup(apiCRNLdefault)
        // what data APIs are connected?
        let dataAPIconnected = ['cnrl-33221101'] // , 'cnrl-33221102']
        // query peer ledger to extract experiments, computes i.e. KBLedger latest
        this.startExpMappedKbundles()
        this.startKSetting()
        // build the UI data type components
        this.startExperiments()
        // loop over active api and extrac devcies, datatypes
        this.deviceContext(dataAPIconnected)
        // this.datatypeContext()
        this.cnrlScienceCompute()
      },
      async startExpMappedKbundles () {
        let mappedExpKbundles = await this.mappedKBLexp()
        // set via store and then pick up in historyData
        this.$store.dispatch('actionExperimentKBundles', mappedExpKbundles)
      },
      async startKSetting () {
        let startKset = await this.latestKBL()
        // set via store and then pick up in historyData
        this.$store.dispatch('actionStartKBundles', startKset)
      },
      startExperiments () {
        let liveExper = []
        let experimentList = this.GETexperimentsList()
        for (let exl of experimentList) {
          let expCNRL = this.GETcnrlLookup(exl)
          let experBundle = {}
          experBundle.cnrl = exl
          experBundle.status = false
          experBundle.contract = expCNRL
          liveExper.push(experBundle)
        }
        this.$store.dispatch('actionExperimentList', liveExper)
      },
      async deviceContext (dataAPIconnected) {
        let devicesList = []
        for (let dapi of dataAPIconnected) {
          // look up the contract
          let apiDev = this.GETcnrlLookup(dapi)
          // make call to set start deviceContext for this pubkey
          const deviceFlag = 'device'
          let deviceAPI = await this.GETtoolkitDevices(apiDev, deviceFlag)
          // console.log('device data back')
          // console.log(deviceAPI)
          // need to pair device to API source CNRL
          deviceAPI.cnrl = dapi
          devicesList.push(deviceAPI)
        }
        // merg arrays
        let flatd = [].concat(...devicesList)
        this.devices = flatd
        this.$store.dispatch('actionDeviceDataAPI', this.devices)
      },
      dataTypeContext () {
        // make call to set start dataType for the device sensors
        const dataTypeFlag = 'dataType'
        let datatypeList = this.GETtoolkitDatatypes(dataTypeFlag)
        this.$store.dispatch('actionSetDataTypes', datatypeList)
      },
      cnrlScienceCompute () {
        // call the CNRL api and get network science active
        let startScienceCompute = this.GetcnrlScienceStart()
        this.$store.commit('setCNRLscience', startScienceCompute)
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

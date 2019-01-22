<template>
  <div id="token-first">
    <button v-if="tokenbuttonseen" @click.prevent="askforToken" class="button is-primary">Generate Data Access Token</button>
    <button v-if="viewTokenbuttonseen" @click.prevent="viewTokenB" class="button is-primary">View TESTnetwork token</button>
    <div v-if="viewTokenseen" id="view-token">{{ viewToken }}</div>
    <div id="keypw-feedback">{{ verifyfeedbackM }}</div>
    <div id="pwinput-prompt" v-if="pwinputSeen">
      Please enter password
      <passwordk v-model="passwordk" :toggle="true" />
    </div>
  </div>
</template>

<script>
  import Passwordk from 'vue-password-strength-meter'
  // import keythereum from 'keythereum'
  import SAFEflow from '../../safeflow/safeFlow.js'
  import fs from 'fs'

  export default {
    name: 'tokenfirst-page',
    components: {
      Passwordk,
      FileReader
    },
    data: () => ({
      liveFlow: null,
      keyObject: {},
      verifyfeedbackM: '',
      viewToken: '',
      viewTokenseen: false,
      viewTokenbuttonseen: false,
      fileinputSeen: true,
      pwinputSeen: false,
      passwordk: null,
      text: '',
      tokenbuttonseen: true,
      feedbackM: '',
      warningM: ''
    }),
    created () {
      this.setAccess()
    },
    computed: {
      system: function () {
        return this.$store.state.system
      }
    },
    methods: {
      setAccess () {
        const firstAsk = {'publickey': 'first', 'token': 'ask'}
        this.liveFlow = new SAFEflow(firstAsk)
      },
      checkforToken () {
        // if file exists display UI to open file
        this.verifyKeypw()
        // if passed make call
        // else display generate token button
        this.firstTempToken()
      },
      askforToken () {
        // first check verifcation of private keys
        // call keythereum
        // next make api first call
        // make call to data store for first stage token permission
        this.firstTokenAPIcall()
        // returns public key from data store, sign message with one off token and send background
        // save publicaddress and token to local file (encrypt with key and password access)
      },
      verifyKeypw () {
        // verify key password for token
      },
      firstTempToken () {
        // make request for access token
        this.tokenbuttonseen = true
      },
      signTokenrequest () {
        // sign message and save returning acccess token, encrypt and pw lock.
      },
      firstTokenAPIcall () {
        // make call
        var localthis = this
        function callbackC (firstBk) {
          console.log('temp token')
          console.log(firstBk)
          // set token  next stage sign and send back for secure token
          localthis.$store.commit('setToken', firstBk.firstT)
          // and write to localfile// writeFile function with filename, content and callback function
          let latestSystem = localthis.$store.getters.liveSystem
          console.log(latestSystem)
          let stringForsystem = JSON.stringify(latestSystem)
          // todo encrypt file
          fs.writeFile('keystore/healthscience-token.json', stringForsystem, function (err) {
            if (err) throw err
            console.log('token json file created.')
            localthis.verifyfeedbackM = 'Access token granted and ready to use.'
            // remove generate button and show view keybuttonseen
            localthis.$emit('removeGenbutton', false)
          })
        }
        this.computeFlag = 'context'
        this.liveFlow.liveTestStorage.firstToken(this.system, callbackC)
      },
      viewTokenB () {
        // get token and display
        this.verifyfeedbackM = 'Access token = ' + this.$store.getters.liveSystem
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

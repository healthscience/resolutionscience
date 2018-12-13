<template>
  <div id="token-first">
    <button v-if="tokenbuttonseen" @click.prevent="askforToken" class="button is-primary">Generate Data Access Token</button>
    <button v-if="viewTokenbuttonseen" @click.prevent="viewToken" class="button is-primary">View TESTnetwork token</button>
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

  export default {
    name: 'tokenfirst-page',
    components: {
      Passwordk,
      FileReader
    },
    data: () => ({
      keyObject: {},
      verifyfeedbackM: '',
      viewToken: '',
      viewTokenseen: false,
      viewTokenbuttoSeen: false,
      fileinputSeen: true,
      pwinputSeen: false,
      passwordk: null,
      text: '',
      tokenbuttonseen: false,
      feedbackM: '',
      warningM: ''
    }),
    methods: {
      checkforToken () {
        // if file exists display UI to open file
        this.verifyKeypw()
        // if passed make call
        // else display generate token button
        this.firstTempToken()
      },
      askforToken () {
        // first check verifcation of private keys
        this.checkforToken()
        // make call to data store for first stage token permission
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

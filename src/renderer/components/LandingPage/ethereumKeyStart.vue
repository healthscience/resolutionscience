<template>
  <div id="ethereum-key-start">
    <div id="returning-start">
      <header>Please select private key to self sign-in:</header>
      <file-reader @load="text = $event" @removeCreatekey="newKeystartseen = $event"></file-reader>
      <br />
      <br />
      <br />
      <br />
    </div>
    <div v-if="newSetup"  id="firsttime-setup">
      <a href="#" id="newsetup" @click.prevent="setupNewAccount">Setup a new account</a>
    </div>
    <div v-if="newKeystartseen"  id="firsttime-start">
      Create a new account: start by enter a password:
      <form>
        <password
          v-model="password"
          :toggle="true"
          @score="showScore"
          @feedback="showFeedback"/>
        <p>
          <div id="pw-feedback">
            {{ feedbackM }}
          </div>
          <div id="pw-warning">
            {{ warningM }}
          </div>
        </p>
        <p class="control">
          <button v-if="keybuttonseen"  @click.prevent="createNewkey" class="button is-primary">Create public address & private key</button>
        </p>
      </form>
    </div>
  </div>
</template>

<script>
  import Password from 'vue-password-strength-meter'
  import FileReader from '../LandingPage/file-reader.vue'
  import keythereum from 'keythereum'

  export default {
    name: 'tokenfirst-page',
    components: {
      Password,
      FileReader
    },
    data: () => ({
      password: null,
      text: '',
      keybuttonseen: false,
      newSetup: true,
      newKeystartseen: false,
      feedbackM: '',
      warningM: ''
    }),
    created () {
    },
    computed: {
    },
    methods: {
      showFeedback ({suggestions, warning}) {
        // console.log('🙏', suggestions)
        // console.log('⚠', warning)
        this.feedbackM = suggestions
        this.warningM = warning
      },
      showScore (score) {
        if (score >= 4) {
          // show create Key button
          this.keybuttonseen = true
        }
      },
      createNewkey () {
        var params = { keyBytes: 32, ivBytes: 16 }
        // synchronous
        var dk = keythereum.create(params)
        var password = this.password
        // Note: if options is unspecified, the values in keythereum.constants are used.
        var options = {
          kdf: 'pbkdf2',
          cipher: 'aes-128-ctr',
          kdfparams: {
            c: 262144,
            dklen: 32,
            prf: 'hmac-sha256'
          }
        }
        var keyObject = keythereum.dump(password, dk.privateKey, dk.salt, dk.iv, options)
        var localfile = keythereum.exportToFile(keyObject)
        if (localfile.length > 0) {
          const newPaddress = keyObject.address
          this.$store.commit('setPublickey', newPaddress)
          // double check file exists and display public keyBytes
          this.keybuttonseen = false
          this.feedbackM = 'New key has been created, address: ' + newPaddress
        }
        // finally create token for mobile app.
      },
      listenkSeen (evIN) {
        // console.log('event called to remove create')
        // console.log(evIN)
        this.newKeystartseen = false
      },
      setupNewAccount (cIN) {
        this.newKeystartseen = true
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

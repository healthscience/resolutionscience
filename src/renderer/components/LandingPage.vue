<template>
  <div id="wrapper">
    <img id="logo" src="~@/assets/logo.png" alt="electron-vue">
    <main>
      <div class="left-side">
        <span class="title">
          Welcome to the Resolution Science Graphical User Interface
        </span>
        <system-information></system-information>
      </div>

      <div class="right-side">
        <div class="doc">
          <div class="title">Peer to Peer Science</div>
          <p>
            An open source graphical user interface.
          </p>
          <br><br>
        </div>
        <div class="doc">
        </div>
      </div>
    </main>
    <div id="secure-start">
      <div id="returning-start">
        Please navigate to private key:
        <file-reader @load="text = $event" @removeCreatekey="newKeystartseen = $event"></file-reader>
        <br />
        <br />
        <br />
        <br />
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
  </div>
</template>

<script>
  import SystemInformation from './LandingPage/SystemInformation'
  import heartPlugin from '././healthscience/hsNavHeart'
  import Password from 'vue-password-strength-meter'
  import FileReader from './LandingPage/file-reader.vue'
  import keythereum from 'keythereum'

  export default {
    name: 'landing-page',
    components: {
      SystemInformation,
      heartPlugin,
      Password,
      FileReader
    },
    data: () => ({
      password: null,
      text: '',
      keybuttonseen: false,
      newKeystartseen: true,
      feedbackM: '',
      warningM: ''
    }),
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
      },
      showFeedback ({suggestions, warning}) {
        console.log('🙏', suggestions)
        console.log('⚠', warning)
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
          // double check file exists and display public keyBytes
          this.keybuttonseen = false
          this.feedbackM = 'New key has been created, address: ' + newPaddress
        }
        // finally create token for mobile app.
      },
      listenkSeen (evIN) {
        console.log('event called to remove create')
        console.log(evIN)
        this.newKeystartseen = false
      }
    }
  }
</script>

<style>
  @import url('https://fonts.googleapis.com/css?family=Source+Sans+Pro');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body { font-family: 'Source Sans Pro', sans-serif; }

  #wrapper {
    background:
      radial-gradient(
        ellipse at top left,
        rgba(255, 255, 255, 1) 40%,
        rgba(229, 229, 229, .9) 100%
      );
    height: 100vh;
    padding: 60px 80px;
    width: 100vw;
  }

  #logo {
    height: auto;
    margin-bottom: 20px;
    width: 420px;
  }

  main {
    display: flex;
    justify-content: space-between;
  }

  main > div { flex-basis: 50%; }

  .left-side {
    display: flex;
    flex-direction: column;
  }

  .welcome {
    color: #555;
    font-size: 23px;
    margin-bottom: 10px;
  }

  .title {
    color: #2c3e50;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 6px;
  }

  .title.alt {
    font-size: 18px;
    margin-bottom: 10px;
  }

  .doc p {
    color: black;
    margin-bottom: 10px;
  }

  .doc button {
    font-size: .8em;
    cursor: pointer;
    outline: none;
    padding: 0.75em 2em;
    border-radius: 2em;
    display: inline-block;
    color: #fff;
    background-color: #4fc08d;
    transition: all 0.15s ease;
    box-sizing: border-box;
    border: 1px solid #4fc08d;
  }

  .doc button.alt {
    color: #42b983;
    background-color: transparent;
  }
</style>

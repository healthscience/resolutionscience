<template>
  <div id="wrapper">
    <img id="logo" src="~@/assets/logo.png" alt="DIY science">
    <main>
      <div class="left-side">
        <span id="welcome">
          <header>Welcome, the DIY HealthScience toolkit allows you</header>
          <p>1. learn & particpate in Experiments</p>
          <p>2. contribute science</p>
          <p>3. build your own dashboards</p>
          <header>START by securing an account below:</header>
        </span>
        <!-- <system-information></system-information>-->
      </div>

      <div class="right-side">
        <div class="doc">
          <div class="title">Peer to Peer Science with Rigour</div>
          <p>version v0.032</p>
          <br><br>
          <div id="network-status">
            Status: Peer Autonomous - Network: NOT CONNECTED
          </div>
        </div>
        <div class="doc">
        </div>
      </div>
    </main>
    <div id="secure-start">
      <component v-bind:is="selectStartType"></component>
    </div>
  </div>
</template>

<script>
  import SystemInformation from './LandingPage/SystemInformation'
  import ethereumkeyStart from './LandingPage/ethereumKeyStart'
  import safenetworkStart from './LandingPage/safenetworkStart'
  import cloudStart from './LandingPage/cloudStart'
  import luftdatenStart from './LandingPage/luftdatenStart'

  export default {
    name: 'landing-page',
    components: {
      SystemInformation,
      ethereumkeyStart,
      safenetworkStart,
      cloudStart,
      luftdatenStart
    },
    created () {
    },
    computed: {
    },
    data: () => ({
      selectStartType: 'ethereumkey-start'
    }),
    methods: {
      open (link) {
        this.$electron.shell.openExternal(link)
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

  #welcome {
    color: #2c3e50;
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 6px;
  }

 #welcome header {
   margin: 12px;
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

#secure-start {
  margin: 30px;
  border-top-style: dotted;
}

#firsttime-setup {
  margin: 2em;
}
</style>

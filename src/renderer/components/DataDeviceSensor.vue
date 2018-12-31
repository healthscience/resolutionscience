<template>
  <div id="devices-sensors-data">
    <h1>Devices, Sensors & Data</h1>
    <div id="device-data-status">
      <ul>
        <li>
          <header>TESTnetwork</header>
          <div id="hardware">
            <header>Hardware</header>
            <div v-if="firstTimetokenseen" id="askfor-token">
              First time generation of token
                <first-token @load="text = $event"></first-token>
            </div>
            <div v-if="repeatTimetokenseen" id="enter-token">
              Please navigate token file:
              <token-reader @load="text = $event"></token-reader>
            </div>
            <div id="hardware-firmware">
              OS Linux <a id="" href="">Cloud</a>
            </div>
            <div id="hardware-manufactureid">
              DigitalOcean
            </div>
          </div>
          <div id="data">
            <header>Data</header>
            <div id="data-location">
              TestServer
            </div>
            <div id="data-volume">

            </div>
          </div>
        </li>
        <li>
          <header>Amazfit fitness tracker</header>
          <div id="hardware">
            <header>Hardware</header>
            <div id="hardware-manufactureid">
              Mac 'F1:D1:D5:6A:32:D6', 'E3:30:80:7A:77:B5'
            </div>
            <div id="hardware-firmware">
              Fimrware Hash 3388294cdc0d833dc92jd9f99yhp <a id="" href="">IPS location</a>
            </div>
          </div>
          <div id="sensors">
            <header>Sensors</header>
            <div id="sensor-type">
              Accelerometer -> Steps -> DataType <a id="" href="http://healthscience.network/heartchain/da-hc-773355992211" >heartchain/activity/steps</a>
            </div>
            <div id="sensor-type">
              LED -> BMP -> DataType <a id="" href="http://healthscience.network/heartchain/da-hc-773355992211" >heartchain/heart/bmp</a>
            </div>
          </div>
          <div id="mobile">
            <header>Mobile</header>
            <div id="data-location">
              Android -> HS-GadgetBridge -> Github -> github.com/healthscience/GadgetBridge
            </div>
          </div>
          <div id="data">
            <header>Data</header>
            <div id="data-location">
              SAFEnetwork ->
            </div>
            <div id="data-volume">
              8MB -> 168,022 entries  Date range: April 2018 to now
            </div>
          </div>
        </li>
        <li>
          <header>Miband2 fitness tracker</header>
          <div id="hardware">
            <header>Hardware</header>
            <div id="hardware-manufactureid">
              Mac 'C5:4C:89:9D:44:10',  'F3:6E:2A:A7:0F:FB'
            </div>
            <div id="hardware-firmware">
              Fimrware Hash 3388294cdc0d83jgvoj5d0w23 <a id="" href="">IPS location</a>
            </div>
          </div>
          <div id="sensors">
            <header>Sensors</header>
            <div id="sensor-type">
              Accelerometer -> Steps -> DataType <a id="" href="http://healthscience.network/heartchain/da-hc-773355992211" >heartchain/activity/steps</a>
            </div>
            <div id="sensor-type">
              LED -> BMP -> DataType <a id="" href="http://healthscience.network/heartchain/da-hc-773355992211" >heartchain/heart/bmp</a>
            </div>
          </div>
          <div id="mobile">
            <header>Mobile</header>
            <div id="data-location">
              Android -> HS-GadgetBridge -> Github -> github.com/healthscience/GadgetBridge
            </div>
          </div>
          <div id="data">
            <header>Data</header>
            <div id="data-location">
              SAFEnetwork ->
            </div>
            <div id="data-volume">
              23MB -> 348,834 entries  Date range: Feb 2018 to now
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import TokenReader from './LandingPage/token-reader.vue'
  import FirstToken from './LandingPage/token-first.vue'
  import fs from 'fs'

  export default {
    name: 'data-page',
    components: {
      TokenReader,
      FirstToken
    },
    data: () => ({
      firstTimetokenseen: false,
      repeatTimetokenseen: false
    }),
    created () {
      this.checkforToken()
    },
    methods: {
      checkforToken () {
        // does a token file exist?
        const path = process.cwd() + '/keystore/healthscience-token.json'
        console.log(path)
        try {
          if (fs.existsSync(path)) {
            console.log('file found')
            // file exists start open decrypt
            this.repeatTimetokenseen = true
          } else {
            console.log('file err found')
            this.firstTimetokenseen = true
          }
        } catch (err) {
          console.error(err)
        }
      }
    }
  }
</script>

<style>

#devices-sensors-data {
  margin: 1em;
}

#devices-sensors-data header {
  font-weight: bold;
}

#hardware {
  margin: 1em;
}

#hardware header {
  font-weight: bold;
}

#sensors {
  margin: 1em;
}

#sensors header {
  font-weight: bold;
}

#mobile {
  margin: 1em;
}

#mobile header {
  font-weight: bold;
}

#data {
  margin: 1em;
}

#data header {
  font-weight: bold;
}
</style>

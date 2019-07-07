<template>
  <div id="devices-sensors-data">
    <h1>Devices, Sensors & Data</h1>
    <div id="help-data">
      Connect to device data stores and verify account ownership.
    </div>
    <div id="device-data-status">
      <header>DATA STORES</header>
      <ul>
        <li class="datastore-item">
          <header>TESTnetwork</header>
          <div id="hardware">
            <header>Verify token to access</header>
            <div v-if="firstTimetokenseen" id="askfor-token" >
              First time generation of token
                <first-token @load="text = $event" @removeGenbutton="firstGenerateseen($event)"></first-token>
            </div>
            <div v-if="repeatTimetokenseen" id="enter-token">
              Please navigate token file:
              <token-reader @load="text = $event" :viewPkey="viewPkey"> </token-reader>
            </div>
          </div>
        </li>
        <li class="datastore-item">
          <header>LuftdatenAPI</header>
          <div id="luftdaten-api">
            <header>Air Quality Monitoring</header>
            <header>Add sensor ID</header>
          </div>
        </li>
        <li class="datastore-item">
          <header>MetofficeAPI</header>
          <div id="metoffice-api">
            <header>Weather Station</header>
            <header>Add postcode</header>
          </div>
        </li>
        <li class="datastore-item">
          <header>Blood Glucose</header>
          <div id="nightscount-api">
            <header>Nightscout CBG</header>
            <header>Verify token</header>
          </div>
        </li>
        <li class="datastore-item">
          <header>GoogleFIT</header>
          <div id="googlefit-api">
            <header>fitAPI</header>
            <header>Verify token</header>
          </div>
        </li>
        <li class="datastore-item">
          <header>Wearables</header>
          <div id="human-api">
            <header>HumanAPI</header>
            <header>Verify token</header>
          </div>
        </li>
        <li class="datastore-item">
          <header>Genetics</header>
          <div id="openhumans-api">
            <header>OpenhumansAPI</header>
            <header>Verify token</header>
          </div>
        </li>
      </ul>
      <device-list></device-list>
    </div>
  </div>
</template>

<script>
  import fs from 'fs'
  import TokenReader from './LandingPage/token-reader.vue'
  import FirstToken from './LandingPage/token-first.vue'
  import deviceList from './healthscience/deviceData.vue'

  export default {
    name: 'data-page',
    components: {
      TokenReader,
      FirstToken,
      deviceList
    },
    data: () => ({
      viewPkey: false,
      firstTimetokenseen: false,
      repeatTimetokenseen: true
    }),
    created () {
      this.checkforToken()
    },
    methods: {
      checkforToken () {
        // does a token file exist?
        const path = process.cwd() + '/keystore/healthscience-token.json'
        try {
          if (fs.existsSync(path)) {
            // file exists start open decrypt
            this.repeatTimetokenseen = true
          } else {
            console.log('file err found')
            this.firstTimetokenseen = true
          }
        } catch (err) {
          console.error(err)
        }
      },
      firstGenerateseen (evSeen) {
        this.firstTimetokenseen = evSeen
        this.repeatTimetokenseen = true
        this.viewPkey = true
      }
    }
  }
</script>

<style>
#devices-sensors-data {
  margin: 2em;
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

.datastore-item {
  display: inline-block;
  border-top-style: dotted;
  border: 1px solid blue;
  margin: 10px;
  padding: 8px;
}
</style>

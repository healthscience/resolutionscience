<template>
  <div id="devices-sensors-data">
    <h1>Devices, Sensors & Data</h1>
    <device-list></device-list>
    <div id="device-data">
      Connect to device, data stores and verify account ownership.
    </div>
    <div id="connect-devices">
      <header>ADD Devices</header>
      <ul>
        <li class="device-type-item">
          <button class="select-wearable" id="wearable" @click.prevent="selectDevice($event)" >Wearables</button>
        </li>
        <li class="device-type-item">
          <button class="select-aq" id="airquality" @click.prevent="selectDevice($event)">Air quality</button>
        </li>
        <li class="device-type-item">
          <button class="select-bloodm" id="bloodmonitor" @click.prevent="selectDevice($event)">Blood monitoring</button>
        </li>
      </ul>
      <div class="display-device-options">
        <ul v-if="selectDevices.type === 'wearable' ">
          <li>Mi Band3 GadgetBridge</li>
          <li>Mi Band2 GadgetBridge</li>
          <li>Mi Amazfit GadgetBridge</li>
          <li>Fitbit openhumans.org</li>
        </ul>
        <ul v-if="selectDevices.type === 'airquality' ">
          <li><a @click.prevent="addDevice($event)" href="" id="_bme280_sensor_" >Luftdaten-BME280</a></li>
          <li><a @click.prevent="addDevice($event)" href="" id="_dht22_sensor_" >Luftdaten-DHT22</a></li>
        </ul>
        <ul v-if="selectDevices.type === 'bloodmonitor' ">
          <li>RX-android</li>
        </ul>
      </div>
      <div v-if="addDeviceSeen" class="display-device-add">
        {{ luftdaten.text }} Please enter
        <form id="luftdaten_form" name="luftdaten_form" method="post" action="#">
          <ul>
            <li>
              Luftdaten devices ID<input v-model="luftdaten.device_mac" placeholder="device id number">
            </li>
            <li>
              Particle Sensor ID<input v-model="luftdaten.device_sensor1" placeholder="id number">
            </li>
            <li>
              Temperature/Hum/Pres ID <input v-model="luftdaten.device_sensor2" placeholder="id number">
            </li>
            <li>
              Indoors?
              <input type="checkbox" id="checkbox" v-model="luftdaten.indoors">
              <label for="checkbox">{{ luftdaten.indoors }}</label>
            </li>
            <li>
              <button @click.prevent="makeActive($event)">Make Active</button>
            </li>
          </ul>
        </form>
      </div>
      <transition name="fade" >
        <div v-if="devicemessage.active === true" id="confirm-add-device">{{ devicemessage.text }}</div>
      </transition>
    </div>
    <div id="device-datastore-status">
      <header>DATA STORES</header>
      <button class="view-activapis" @click.prevent="viewDatastores($event)">{{ liveDeviceSeen.text }}</button>
      <ul v-if="liveDeviceSeen.seen">
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
            Please enter Luftdaten device ID:
            <input v-model="luftdatenDevice" placeholder="luftdaten device ID">
            <button v-model="luftdatenDevice" class="button-expadd" href="" id="connect-ld-button" @click.prevent="luftDatenConnect($event)">Connect</button>
            <div v-if="luftdatenDeviceConnect > 0" id="luftdaten-Live">Connected Device: {{ luftdatenDeviceConnect }}</div>
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
          <header>SAFEnetwork</header>
          <div id="safe-api">
            <header>D-storage API</header>
            <header>Self Verify</header>
          </div>
        </li>
      </ul>
    </div>
    <div id="device-otherdata-status">
      <header>OTHER STORES</header> <button class="view-apis" @click.prevent="viewAPIS($event)">{{ otherDevices.text }}</button>
      <ul v-if="otherDevices.seen">
        <li class="datastore-item">
          <header>Genetics</header>
          <div id="openhumans-api">
            <header>OpenhumansAPI</header>
            <header>Verify token</header>
          </div>
        </li>
        <li class="datastore-item">
          <header>OceanProtocol</header>
          <div id="oceanprotocol-api">
            <header>Data Market Palce</header>
            <header>Verify token</header>
          </div>
        </li>
        <li class="datastore-item">
          <header>Singularity.net</header>
          <div id="singularity-api">
            <header>AI MarketPlace</header>
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
      </ul>
    </div>
    <div id="add-new-network">
      <header>CNRL network contributions</header>
      <ul>
        <li>
          <button class="new-describe-cnrl" @click.prevent="newDesAPI($event)">{{ newAPIseen.text }}</button>
        </li>
        <li>
          <button class="view-cnrl" id="experimentCNRL" @click.prevent="viewCNRL($event)">{{ CNRLexperimentseen.text }}</button>
        </li>
        <li>
          <button class="view-cnrl" id="datatypesCNRL" @click.prevent="viewCNRL($event)">{{ CNRLdatatypesseen.text }}</button>
        </li>
        <li>
          <button class="view-cnrl"  id="computeCNRL" @click.prevent="viewCNRL($event)">{{ CNRLcomputeseen.text }}</button>
        </li>
      </ul>
      <new-API v-if="newAPIseen.active"></new-API>
      <view-CNRL v-if="statusCNRL.active" :cnrlLive="CNRLdata"></view-CNRL>
    </div>
  </div>
</template>

<script>
  import fs from 'fs'
  import liveMixinSAFEflow from '@/mixins/safeFlowAPI'
  import TokenReader from './LandingPage/token-reader.vue'
  import FirstToken from './LandingPage/token-first.vue'
  import deviceList from './healthscience/deviceData.vue'
  import newAPI from './healthscience/newAPI.vue'
  import viewCNRL from './healthscience/viewCNRL.vue'

  export default {
    name: 'data-page',
    components: {
      TokenReader,
      FirstToken,
      deviceList,
      newAPI,
      viewCNRL
    },
    mixins: [liveMixinSAFEflow],
    computed: {
      computeCNRL: function () {
        return this.$store.state.compute
      },
      datatypesCNRL: function () {
        return this.$store.state.datatypesCNRL
      },
      nxpCNRL: function () {
        return this.$store.state.NXPexperimentList
      }
    },
    data: () => ({
      viewPkey: false,
      firstTimetokenseen: false,
      repeatTimetokenseen: true,
      luftdatenDevice: 0,
      luftdatenDeviceConnect: 0,
      luftdaten:
      {
        device_mac: '',
        device_sensor1: '',
        device_sensor2: '',
        cnrl: 'cnrl-33221103',
        indoors: false
      },
      selectDevices:
      {
        type: '',
        seen: false,
        text: 'view'
      },
      liveDeviceSeen:
      {
        seen: false,
        text: 'view'
      },
      newAPIseen:
      {
        active: false,
        text: 'Add new'
      },
      CNRLdata: [],
      statusCNRL:
      {
        active: false,
        type: ''
      },
      CNRLexperimentseen:
      {
        active: false,
        text: 'Experiments'
      },
      CNRLdatatypesseen:
      {
        active: false,
        text: 'Datatypes'
      },
      CNRLcomputeseen:
      {
        active: false,
        text: 'Compute'
      },
      otherDevices:
      {
        seen: false,
        text: 'view'
      },
      addDeviceSeen: false,
      devicemessage:
      {
        'active': false,
        'text': 'Devices is added'
      }
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
      },
      selectDevice (sdev) {
        this.selectDevices.type = sdev.target.id
      },
      addDevice (addDev) {
        this.luftdaten.text = addDev.target.id
        this.addDeviceSeen = true
      },
      luftDatenConnect (codeIn) {
        this.luftdatenDeviceConnect = this.luftdatenDevice
      },
      viewDatastores (vDev) {
        if (this.liveDeviceSeen.seen === false) {
          this.liveDeviceSeen.seen = true
          this.liveDeviceSeen.text = 'close'
        } else {
          this.liveDeviceSeen.seen = false
          this.liveDeviceSeen.text = 'view'
        }
      },
      viewAPIS (vApi) {
        if (this.otherDevices.seen === false) {
          this.otherDevices.seen = true
          this.otherDevices.text = 'close'
        } else {
          this.otherDevices.seen = false
          this.otherDevices.text = 'NEW api'
        }
      },
      makeActive (ma) {
        // set devices life on the fly  (also provide option to save but shoud be done vie Dapp)
        // let existingDevices = this.$store.getters.liveContext
        let localthis = this
        this.devicemessage.active = true
        let addDevice = {}
        addDevice.active = false
        addDevice.device_mac = this.luftdaten.device_mac
        addDevice.cnrl = this.luftdaten.cnrl
        addDevice.sensor1 = this.luftdaten.device_sensor1
        addDevice.sensor2 = this.luftdaten.device_sensor2
        addDevice.device_name = this.luftdaten.text
        addDevice.indoors = this.luftdaten.indoors
        this.$store.dispatch('actionAddDeviceDataAPI', addDevice)
        this.addDeviceSeen = false
        this.selectDevices.type = ''
        setTimeout(function () {
          localthis.devicemessage.active = false
        }, 3000) // hide the message after 3 seconds
      },
      newDesAPI (ap) {
        if (this.newAPIseen.active === false) {
          this.newAPIseen.active = true
          this.newAPIseen.text = 'close'
        } else {
          this.newAPIseen.active = false
          this.newAPIseen.text = 'Add new'
        }
      },
      viewCNRL (cnrle) {
        this.statusCNRL.active = true
        this.statusCNRL.type = cnrle.target.id
        let cnrlActive = cnrle.target.id
        if (cnrlActive === 'experimentCNRL') {
          this.CNRLdata = this.nxpCNRL
        } else if (cnrlActive === 'datatypesCNRL') {
          this.CNRLdata = this.datatypesCNRL
        } else if (cnrlActive === 'computeCNRL') {
          this.CNRLdata = this.computeCNRL
        }
      }
    }
  }
</script>

<style>
#device-data {
  margin-top: 20px;
}
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

#connect-devices, #device-datastore-status, #device-otherdata-status, #add-new-network {
  background-color: #EBE7E0;
  padding: 10px;
}

#connect-devices, #device-datastore-status, #device-otherdata-status, #add-new-network header {
  margin: 0.5em;
}

#device-data-status,#device-otherdata-status {
  margin-bottom: 2em;
}

#add-new-network li {
  display: inline-block;
  margin: 0.5em;
}

.datastore-item {
  display: inline-block;
  border-top-style: dotted;
  border: 1px solid blue;
  margin: 10px;
  padding: 8px;
}

.device-type-item {
  display: inline-block;
  border-top-style: dotted;
  border: 0px solid orange;
  margin: 10px;
  padding: 10px;
}

.device-type-item button {
  font-size: 2em;
}

.display-device-options {
  display: block;
  border: 0px solid orange;
  padding: 10px;
}

ul li.display-device-options a {
  margin: 2em;
  min-height: 100px;
}

.display-device-add {
  border: 2px solid orange;
  padding: 20px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s ease-out;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>

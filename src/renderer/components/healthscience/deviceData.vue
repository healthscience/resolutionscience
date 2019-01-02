<template>
  <div id="device-list">
    <li v-for="dev in devices">
      <header>{{ dev.device_name }}</header>
      <div id="hardware">
        <header>Hardware</header>
        <div id="hardware-manufactureid">
          Mac: {{}}
        </div>
        <div id="hardware-firmware">
          Fimrware Hash {{}} <a id="" href="">IPS location</a>
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
          TESTnetwork ->
        </div>
        <div id="data-volume">
          Storage volume: {{}}
        </div>
      </div>
      <!--<a href="" id="" @click.prevent="" v-bind:class="{ 'active': dev.active}">{{ dev.device_name }}</a>-->
    </li>
  </div>
</template>


<script>
  import SAFEflow from '../../safeflow/safeFlow.js'

  export default {
    name: 'devices-page',
    components: {
    },
    data: () => ({
      liveFlow: null,
      computeFlag: '',
      devices: [],
      sensors: []
    }),
    created () {
      this.setAccess()
      this.dataContext()
    },
    computed: {
      system: function () {
        return this.$store.state.system
      }
    },
    methods: {
      setAccess () {
        this.liveFlow = new SAFEflow(this.system)
      },
      dataContext () {
        // make call to set start dataContext for this pubkey
        var localthis = this
        function callbackC (dataH) {
          localthis.devices = dataH
          localthis.dataType()
        }
        this.computeFlag = 'context'
        this.liveFlow.systemContext(this.computeFlag, callbackC)
      },
      dataType () {
        // make call to set start dataType for the device sensors
        var localthis = this
        function callbackT (dataH) {
          localthis.sensors = dataH
          localthis.liveFlow.dataStart()
        }
        this.computeFlag = 'datatype'
        this.liveFlow.systemContext(this.computeFlag, callbackT)
      }
    }
  }
</script>

<style>

</style>

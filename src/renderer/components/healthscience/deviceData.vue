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
  export default {
    name: 'devices-page',
    components: {
    },
    data: () => ({
      liveSafeFlow: {},
      computeFlag: '',
      devices: [],
      sensors: []
    }),
    created () {
    },
    mounted () {
      this.checkContext()
    },
    computed: {
      system: function () {
        return this.$store.state.system
      },
      safeFlow: function () {
        return this.$store.state.safeFlow
      },
      context: function () {
        return this.$store.state.context
      }
    },
    methods: {
      checkContext () {
        let startContext = this.$store.getters.liveContext
        // set devices and sensor from Store
        this.devices = startContext.device
        this.sensors = startContext.datatype
      }
    }
  }
</script>

<style>

</style>

<template>
  <div id="device-list">
  <header>DEVICES LIVE</header>
  <ul>
    <li v-for="dev in devices" class="device-item">
      <header>{{ dev.device_name }} <a href="" @click.prevent="viewDeviceDetail(dev)" id="view-details">View details</a> </header>
      <div id="device-details" v-if="dev.active">
        <div id="hardware" class="device-detail-item" >
          <header>Hardware</header>
          <div id="hardware-manufactureid">
            Mac: {{}}
          </div>
          <div id="hardware-firmware" class="device-detail-item" >
            Fimrware Hash {{}} <a id="#" href="">location</a>
          </div>
        </div>
        <div id="sensors" class="device-detail-item">
          <header>Sensors</header>
          <div id="sensor-type">
            Accelerometer -> Steps -> DataType <a id="" href="#" >/activity/steps</a>
          </div>
          <div id="sensor-type">
            LED -> BMP -> DataType <a id="" href="#" >heart/bmp</a>
          </div>
        </div>
        <div id="mobile" class="device-detail-item" >
          <header>Mobile</header>
          <div id="data-location">
            Android -> HS-GadgetBridge -> Github -> github.com/healthscience/GadgetBridge
          </div>
        </div>
        <div id="data" class="device-detail-item" >
          <header>Data</header>
          <div id="data-location">
            TESTnetwork ->
          </div>
          <div id="data-volume">
            Storage volume: {{}}
          </div>
        </div>
        <!--<a href="" id="" @click.prevent="" v-bind:class="{ 'active': dev.active}">{{ dev.device_name }}</a>-->
      </div>
    </li>
  </ul>
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
      sensors: []
    }),
    created () {
    },
    mounted () {
    },
    computed: {
      devices: function () {
        return this.$store.getters.liveContext.device
      }
    },
    methods: {
      viewDeviceDetail (devIN) {
        if (devIN.active === true) {
          devIN.active = false
        } else if (devIN.active === false) {
          devIN.active = true
        }
      }
    }
  }
</script>

<style>
#device-list header {
  margin: 1em;
}

.device-item header {
  font-size: 1.4em;
}

.device-item {
  display: block;
  border: 1px solid lightgrey;
  margin: 5px;
  background-color: #EBE7E0;
}

.device-detail-item {
  display: inline-block;
}
</style>

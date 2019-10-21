<template>
  <div id="learn-action">
    <header>ACTION - coming soon</header>
    <!-- <div id="self-action">
      SELF: Manual setting of notifications on mobile.
    </div>
    <div id="HealthSpanPractitioner-action">
      HEALTHSPAN-PRACTICTIONER: Not registered
    </div>
    <div id="cale-action">
      CALE: Still learning.
    </div>
    <div id="dapp-action">
      Set Notification to mobile device: Y / N
    </div> -->
  </div>
</template>

<script>
  export default {
    name: 'learn-action',
    components: {
    },
    props: {
    },
    data () {
      return {
      }
    },
    created () {
    },
    computed: {
      system: function () {
        return this.$store.state.system
      },
      tools: function () {
        return this.$store.state.tools
      },
      reportLive: function () {
        return this.prepareReport(this.recoveryData.hrcdata)
      }
    },
    mounted () {
    },
    methods: {
    }
  }
</script>

<style>
#learn-action {
  margin: 1em;
  background-color: #cac8cc;
}

header {
  font-weight: bold;
}
</style>

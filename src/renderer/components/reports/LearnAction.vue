<template>
  <div id="learn-action">
    <header>ACTION</header>
    <div id="self-action">
      SELF:
    </div>
    <div id="HealthSpanPractitioner-action">
      HEALTHSPAN-PRACTICTIONER:
    </div>
    <div id="cale-action">
      CALE:
    </div>
    <div id="dapp-action">
      Set Notification to mobile device: Y / N
    </div>
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
  background-color: #FCE8C1;
}

header {
  font-weight: bold;
}
</style>

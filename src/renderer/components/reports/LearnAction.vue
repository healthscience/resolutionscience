<template>
  <div id="learn-action">ACTION
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
</style>

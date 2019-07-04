<template>
  <div id="learn-report">REPORT
    <div id="oracles">oracles</div>
    <div id="tends">trends</div>
    <div id="visulation-select"></div>
  </div>
</template>

<script>
  export default {
    name: 'learn-report',
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

<template>
  <div id="learn-report">
    <header>REPORT</header>
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
#learn-report {
  margin: 1em;
  background-color: #D0FCC1;
}

header {
  font-weight: bold;
}
</style>

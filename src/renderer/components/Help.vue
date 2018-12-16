<template>
  <div id="help-page">
    <h1>Help</h1>
    <div id="help-sections">
      <ul>
        <li>
          <div id="help-topic">
            <header>Getting started - setup private key</header>
            <div class="topic-text">The first task is to setup a private key.</div>
          </div>
        </li>
        <li>
          <div id="help-topic">
            <header>Setup TESTnetwork data access token</header>
            <div class="topic-text">With a private key setup the next task to generate a token that can be entered in the Gadgetbridge Android Mobile Applications.  Click on the data menu button and follow the instructions.</div>
          </div>
        </li>
        <li>
          <div id="help-topic">
            <header>Using the DIY toolkit</header>
            <div class="topic-text">The DIY do-it-yourself science toolkit allow you to produce charts and analysis reports. Select a device or devices and the sensors you want to chart.  Then to produce the chart click on the One day button at the located at the bottom of the chart.  The data will be displayed.  Sliders will be presented to allow for my detailed analysis.  Drag to start and then the stop slider to area of interest and then click on the Learn button.  A summary report will be presented.</div>
          </div>
        </li>
        <li>
          <div id="help-topic">
            <header>Science</header>
            <div class="topic-text">The science page contains a list of scientific computations active in the network.</div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Help',
  data () {
    return {
    }
  },
  computed: {
    system: function () {
      return this.$store.state.system
    }
  },
  created () {
  },
  methods: {
  }
}
</script>

<style>
#help-page {
  margin: 1em;
}

#help-topic {
  margin: 2em;
}

#help-topic header {
  font-size: 1.2em;
  font-weight: bold;
}

</style>

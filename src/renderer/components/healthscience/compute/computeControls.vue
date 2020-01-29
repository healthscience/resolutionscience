<template>
  <div id="compute-controlpanel">
    <div id="compute-controls-setup">
      <header>Control panel setup </header>
      <a href="#" id="design-controls" >design</a>
    </div>
    <div id="controls">
      <header>controls</header>
      <div class="compute-control-item">
        <header>Status:</header>
          <div id="update-status">
          </div>
      </div>
      <div class="compute-control-button">
        <button @click.prevent="startLearn($event)"  v-bind:value="cnrlkbid" id="compute-start">Start</button>
      </div>
      <div class="compute-control-button">
        <button id="compute-stop">Stop:</button>
      </div>
      <div class="compute-control-item" id="repeat-select">
        <header>Repeat</header>
        <div>
          <b>Manual</b>  AUTO
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'compute-controls',
  components: {
  },
  data: () => ({
    cnrlkbid: ''
  }),
  created () {
  },
  mounted () {
  },
  visualised: {
  },
  methods: {
    startLearn () {
      console.log('start the Learning')
    }
  }
}
</script>

<style>
#compute-controlpanel{
  background-color: #eae6ed;
}

#compute-control-panel {
  background-color: #f2f6fa;
}

#compute-control-panel header {
  font-weight: bold;
}

.compute-control-item {
  display: inline-block;
  margin: 1em;
  width: 140px;
}

.compute-control-itemmedium {
  display: inline-block;
  margin: 1em;
  width: 340px;
}

.compute-control-item header {
  background-color: #EBE7E0;
  border-bottom: 2px dotted #6F6B63;
  margin: 4px;
}

.compute-control-button {
  display: inline-block;
  margin: 1em;
  width: 60px;
  padding: 30px;
}

#compute-start {
  padding: 1em;
  border: 2px solid green;
}

#compute-stop {
  padding: 1em;
  border: 2px solid red;
}

#repeat-select {
  margin-left: 40px;
}
</style>

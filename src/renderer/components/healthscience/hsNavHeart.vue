<template>
  <div id="dashboard">
    <section id="knowledge">
      <div id="experiment-learn" class="live-button-explist">
        <div id="experiment-learn-container">
          <div id="experiment-view">
            <a href="" id="experiment-button" @click.prevent="viewExperiment(exper)" v-bind:class="{ 'active': exper.active}">{{ exper.name }}</a>
          </div>
          <div id="NXPexperiment-view">
            <a href="" id="NXPexperiment-button" @click.prevent="viewNXPExperiment(NXPexper)" v-bind:class="{ 'active': NXPexper.active}">{{ NXPexper.name }}</a>
          </div>
          <div id="holistic">
            <a href="" id="holistic-start" @click.prevent="startHolistic()" v-bind:class="{ 'active': holistic.active}">{{ holistic.name }}</a>
          </div>
        </div>
      </div> {{ exper }} ----
      <div id="experiments" v-if="exper.active">
        <experiment-List></experiment-List>
      </div>
      <div id="NXPexperiments" v-if="NXPexper.active">
        <NXPexperiment-List></NXPexperiment-List>
      </div>
    </section>
  </div>
</template>

<script>
  import experimentList from './experimentList.vue'
  import NXPexperimentList from './nxp/NXPexperimentList.vue'

  export default {
    name: 'hs-prepare',
    components: {
      experimentList,
      NXPexperimentList
    },
    data () {
      return {
        holistic:
        {
          name: 'Holitic',
          id: 'learn-holistic',
          active: true
        },
        exper:
        {
          name: 'View experiments',
          id: 'learn-experiments',
          active: true
        },
        NXPexper:
        {
          name: 'View NXP experiments',
          id: 'learn-nxpexperiments',
          active: false
        },
        contextGrid: {}
      }
    },
    computed: {
    },
    mounted () {
    },
    created () {
    },
    methods: {
      viewExperiment (exper) {
        exper.active = !exper.active
        // query CNRL to get live EXPERIMENTS
        // this.$emit('liveExperiments')
        if (exper.active === true) {
          exper.name = 'Close experiment'
        } else {
          exper.name = 'View experiments'
        }
      },
      viewNXPExperiment (NXPexper) {
        NXPexper.active = !NXPexper.active
        // query CNRL to get live EXPERIMENTS
        this.$emit('liveExperiments')
        if (NXPexper.active === true) {
          NXPexper.name = 'Close NXPexperiment'
        } else {
          NXPexper.name = 'View NXPexperiments'
        }
      }
    }
  }
</script>

<style scoped>
a {
  color: #42b983;
}

.active{
  background-color:#8ec16d;
  color: white;
}
</style>

<template>
  <section class="container">
    <oracle-View></oracle-View>
    <section id="knowledge">
      <div id="experiment-learn" class="live-element">
        <div id="experiment-learn-container">
          <div id="experiment-view">
            <a href="" id="experiment-button" @click.prevent="viewExperiment(exper)" v-bind:class="{ 'active': exper.active}">{{ exper.name }}</a>
          </div>
        </div>
      </div>
      <div id="experiments" v-if="exper.active">
        <experiment-List :experimentData="KLexperimentData" ></experiment-List>
      </div>
    </section>
  </section>
</template>

<script>
  import SAFEflow from '../../safeflow/safeFlow.js'
  import oracleView from '@/components/toolbar/oracleView.vue'
  import experimentList from '@/components/toolbar/experimentList.vue'
  import { sBus } from '../../main.js'

  export default {
    name: 'VueChartJS',
    components: {
      oracleView,
      experimentList
    },
    data () {
      return {
        liveSafeFlow: null,
        exper:
        {
          name: 'View experiments',
          id: 'learn-experiments',
          active: false
        },
        liveDataCollection: {},
        liveOptions: {},
        liveAnnotations: {},
        liveSelectTime: 'ppp',
        liveanalysisStart: 'select',
        liveanalysisEnd: 'select',
        startLine: '',
        activeEntity: '',
        liveBundle: {},
        liveExper: [],
        liveTimeV: 'time',
        chartmessage: {
          text: 'compute status = stopped',
          active: false
        }
      }
    },
    computed: {
      system: function () {
        return this.$store.state.system
      }
    },
    mounted () {
    },
    created () {
      this.setAccess()
      this.experimentsStart()
      sBus.$on('saveLBundle', (cData) => {
        console.log('NOT USED')
      })
    },
    methods: {
      setAccess () {
        this.liveSafeFlow = new SAFEflow(this.system)
      },
      viewExperiment (exper) {
        exper.active = !exper.active
        // query CNRL to get live EXPERIMENTS
        this.$emit('liveExperiments')
        if (exper.active === true) {
          exper.name = 'Close experiment'
        } else {
          exper.name = 'View experiments'
        }
      },
      makeLiveExperiment () {
        // make experiment dashboard ie. all visualisation, setting and ptop status numbers etc.
        console.log('live experiment dashboard')
      },
      experimentsStart () {
        // console.log('BEGIN---experVIS')
        this.liveExper = []
        // console.log(this.$store.getters.liveExperimentList)
        // console.log(this.$store.getters.livemapExperimentKbundles)
        // console.log(this.$store.getters.startBundlesList)
        this.$store.dispatch('actionFilterKBundles')
        this.KLexperimentData = this.$store.getters.liveExperimentList
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

<template>
  <section class="container">
    <!-- <oracle-View></oracle-View> -->
    <section id="knowledge">
      <div id="experiment-learn" class="live-button-explist">
        <div id="experiment-learn-container">
          <div id="experiment-view">
            <a href="" id="experiment-button" @click.prevent="viewExperiment(exper)" v-bind:class="{ 'active': exper.active}">{{ exper.name }}</a>
          </div>
        </div>
      </div>
      <div id="experiments" v-if="exper.active">
        <experiment-List></experiment-List>
      </div>
    </section>
  </section>
</template>

<script>
  import oracleView from '@/components/oracle/oracleView.vue'
  import experimentList from './experimentList.vue'
  import { sBus } from '../../main.js'

  export default {
    name: 'hs-prepare',
    components: {
      oracleView,
      experimentList
    },
    data () {
      return {
        exper:
        {
          name: 'View experiments',
          id: 'learn-experiments',
          active: true
        }
      }
    },
    computed: {
    },
    mounted () {
    },
    created () {
      sBus.$on('saveLBundle', (cData) => {
        console.log('NOT USED')
      })
    },
    methods: {
      viewExperiment (exper) {
        exper.active = !exper.active
        // query CNRL to get live EXPERIMENTS
        this.$emit('liveExperiments')
        if (exper.active === true) {
          exper.name = 'Close experiment'
        } else {
          exper.name = 'View experiments'
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

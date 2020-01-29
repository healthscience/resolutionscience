<template>
  <div id="compute-nxp">
    <header>ANSWER-COMPUTE:</header>
    <div id="prime-compute">
      <form id="compute_form" name="compute_form" method="post" action="#">
        <ul>
          <li class="compute-summary">
            Prime compute:<input v-model="compute.text" placeholder="prime">
          </li>
          <li class="compute-summary">
            Github discussion:<input v-model="compute.forum" placeholder="git link">
          </li>
          <li class="compute-summary">
            <button @click.prevent="saveCompute($event)">Save Compute</button>
          </li>
        </ul>
      </form>
    </div>
    <compute-context></compute-context>
  </div>
</template>

<script>
  import computeContext from '../compute/computeContext.vue'

  export default {
    name: 'nxp-compute',
    components: {
      computeContext
    },
    data: () => ({
      compute:
      {
        text: '',
        forum: ''
      }
    }),
    created () {
    },
    mounted () {
    },
    computed: {
    },
    methods: {
      saveCompute () {
        console.log('save compute')
      }
    }
  }
</script>

<style>
#compute-nxp {
  margin: 1em;
  border: 1px solid grey;
}

#compute-nxp header{
  font-weight: bold;
}

#prime-compute {
  margin: 1em;
}

.compute-summary {
  display: inline-block;
}
</style>

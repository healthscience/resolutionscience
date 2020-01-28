<template>
  <div id="compute-nxp">
    <header>COMPUTE:</header>
    <div id="prime-compute">
      <form id="compute_form" name="compute_form" method="post" action="#">
        <ul>
          <li>
            Prime compute:<input v-model="compute.text" placeholder="prime">
          <compute-context></compute-context>
          </li>
          <li>
            Forum discussion:<input v-model="compute.forum" placeholder="forum link">
          </li>
          <li>
            <button @click.prevent="saveCompute($event)">Save Compute</button>
          </li>
        </ul>
      </form>
    </div>
  </div>
</template>

<script>
  import computeContext from '@/components/toolbar/computeContext.vue'

  export default {
    name: 'nxp-question',
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
</style>

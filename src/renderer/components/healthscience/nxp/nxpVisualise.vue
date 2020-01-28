<template>
  <div id="visualise-nxp">
    <header>VISUALISE:</header>
    <div id="prime-visualise">
      <visualise-context></visualise-context>
    </div>
  </div>
</template>

<script>
  import visualiseContext from '@/components/toolbar/visualiseContext'

  export default {
    name: 'nxp-question',
    components: {
      visualiseContext
    },
    data: () => ({
      visualise:
      {
        text: '',
        forum: ''
      }
    }),
    created () {
    },
    mounted () {
    },
    visualised: {
    },
    methods: {
      saveVisualise () {
        console.log('save visualise')
      }
    }
  }
</script>

<style>
#visualise-nxp {
  margin: 1em;
  border: 1px solid grey;
}

#visualise-nxp header{
  font-weight: bold;
}

#prime-visualise {
  margin: 1em;
}
</style>

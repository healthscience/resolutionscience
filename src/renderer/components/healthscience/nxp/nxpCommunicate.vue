<template>
  <div id="communicate-nxp">
    <header>COMMUNICATE:</header>
    <div id="prime-communicate">
    </div>
  </div>
</template>

<script>
  export default {
    name: 'nxp-communicate',
    components: {
    },
    data: () => ({
      communicate:
      {
        text: '',
        forum: ''
      }
    }),
    created () {
    },
    mounted () {
    },
    communicated: {
    },
    methods: {
      saveCommunicate () {
        console.log('save communicate')
      }
    }
  }
</script>

<style>
#communicate-nxp {
  margin: 1em;
  border: 1px solid grey;
}

#communicate-nxp header{
  font-weight: bold;
}

#prime-communicate {
  margin: 1em;
}
</style>

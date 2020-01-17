<template>
  <div id="safenetwork-start">
    <div id="safe-network">
      <button @click.prevent="connectSAFE" class="button is-primary">Connect to SAFE (fleming) Test Network</button> coming soon
    </div>
  </div>
</template>

<script>
  import liveMixinSAFEflow from '@/mixins/safeFlowAPI'

  export default {
    name: 'safenetwork-page',
    components: {
    },
    mixins: [liveMixinSAFEflow],
    data: () => ({
    }),
    created () {
    },
    computed: {
    },
    methods: {
      connectSAFE () {
        console.log('connect to safe network please')
        let selfAuth = {}
        selfAuth.secret = '1234'
        selfAuth.password = '4568'
        this.connectNSnetwork('safeNetwork', selfAuth)
      }
    }
  }
</script>

<style>
</style>

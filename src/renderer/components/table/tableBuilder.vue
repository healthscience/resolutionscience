<template>
  <div id="table-live">
  </div>
</template>

<script>
  export default {
    name: 'table-view',
    components: {
    },
    data: () => ({
    }),
    created () {
    },
    mounted () {
      // this.simHeart()
      this.simMovement()
      this.startClock()
    },
    computed: {
      system: function () {
        return this.$store.state.system
      }
    },
    methods: {
    }
</script>

<style>
</style>

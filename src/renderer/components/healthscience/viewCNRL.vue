<template>
  <div id="cnrl-view">
    <ul v-for="cd in cnrlLive">
      <li>
        <div class="cnrl-element">{{ cd.type }}</div>
        <div class="cnrl-element"> <b> {{ cd.prime.text }} </b> {{ cd.prime.cnrl }}</div>
        <div class="cnrl-element"> {{ cd.history }}</div>
        <div class="cnrl-element"> {{ cd.wasmfile }}</div>
        <div class="cnrl-element">{{ cd.livingpaper }}</div>
      </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'cnrlview-page',
    components: {
    },
    props: {
      cnrlLive:
      {
        type: Array
      }
    },
    data: () => ({
    }),
    created () {
    },
    mounted () {
    },
    computed: {
    },
    methods: {

    }
  }
</script>

<style>
.cnrl-element {
  display: inline-block;
  margin-bottom: 1em;
}
</style>

<template>
  <div id="app">
        <router-link to="/">Home</router-link>
        <router-link to="/datadevicesensor">Data</router-link>
        <router-link to="science">Science</router-link>
        <router-link to="/analysis">Analysis</router-link>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'resolutionscience'
  }
</script>

<style>
  /* CSS */
</style>

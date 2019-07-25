<template>
  <div id="app">
    <router-link class="menu-space" to="/">Home</router-link>
    <router-link class="menu-space" to="/analysis">Dashboards</router-link>
    <router-link class="menu-space" to="/datadevicesensor">Data</router-link>
    <router-link class="menu-space" to="science">DIY Science</router-link>
    <router-link class="menu-space" to="/help">Help</router-link>
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
#app {
  margin: 10px;
}

.menu-space {
  font-size: 1.4em;
  padding-left: 8px;
}
</style>

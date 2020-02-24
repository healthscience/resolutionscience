<template>
  <div id="new-nxp-setup">
    <header>Network Experiment</header>
    <div class="nxp-new-buttons">
      <button class="nxp-buttons" type="submit"  id="dmap-save-new-mapping" >Save</button>
      <button class="nxp-buttons" type="submit" id="dmap-test-new-mapping" >Test NXP</button>
      <button class="nxp-buttons" type="submit" id="dmap-roll-new-mapping" >Share with Network</button>
    </div>
    <div id="new-name-nxp">
      <form id="dmap_form" name="dmap_form" method="post" action="#">
        <ul>
          <li>
            <span class="required_notification">* Denotes Required Field</span>
          </li>
          <li>
            <label for="dmap-add-name">Name:</label>
            <input id="dmap-mapping-name" placeholder="experiment name" required="" type="text"> {{ activeNXP.prime.text }}
          </li>
          <li>
            <label for="dmap-add-description">Description:</label>
            <textarea name="message" cols="40" rows="6" required="" id="dmap-mapping-description"></textarea>
          </li>
        </ul>
      </form>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'nxp-page',
    components: {
    },
    computed: {
      activeNXP: function () {
        return this.$store.state.liveNXPcontract
      }
    },
    data: () => ({
    }),
    created () {
    },
    mounted () {
    },
    methods: {
    }
  }
</script>

<style>
#new-nxp-setup {
  margin: 1em;
  border: 1px solid grey;
}

#new-nxp-setup header{
  font-weight: bold;
}

.nxp-new-buttons {
  margin-right: 100px;
  float: right;
}
</style>

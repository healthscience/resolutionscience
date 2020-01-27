<template>
  <div v-if="this.contributeData.formSeen" id="science-form">
    <header>Contribute new science</header>
    <form id="dmap_form" name="dmap_form" method="post" action="#">
    <ul>
      <li>
        <h2>New Dmap</h2>
        <span class="required_notification">* Denotes Required Field</span>
      </li>
      <li>
        <label for="dmap-add-name">Name:</label>
        <input id="dmap-mapping-name" placeholder="Dmap mapping name" required="" type="text">
      </li>
      <li>
        <label for="dmap-add-description">Description:</label>
        <textarea name="message" cols="40" rows="6" required="" id="dmap-mapping-description"></textarea>
      </li>
      <li>
        <section id="dmap-scripting">
        <header>Sensors & Data matching</header>
      <li>
        <label for="dmap-add-scripting">Scripting:</label>
        <select class="select-dmap-id" id="dmap-mapping-build">
          <option value="none" selected="">Please select</option>
          <option value="temperature">Temperature</option>
          <option value="activity">Activity</option>
          <option value="time">Time</option>
        </select>
        <!--<input type="text"  placeholder="Variable one" required />--> =
        <!--<input type="text"  placeholder="Variable two" required />-->
        <select class="select-dmap-id" id="dmap-mapping-build-second">
          <option value="none" selected="">Please select</option>
          <option value="temperature">Temperature</option>
          <option value="activity">Activity</option>
          <option value="time">Time</option>
        </select>
      </li>
      <li>
        <label for="dmap-add-scripting-measurement">Units</label>
        <select class="select-units" id="dmap-mapping-model-units">
          <option value="none" selected="">Please select</option>
          <option value="celsius">oC</option>
          <option value="steps">Steps</option>
          <option value="unix">Unix</option>
        </select>
      =
        <select id="dmap-add-scripting-units" class="select-units">
          <option value="none" selected="">Please select</option>
          <option value="celsius">oC</option>
          <option value="steps">Steps</option>
          <option value="unix">Unix</option>
        </select>
      </li>
      <li>
        <label for="dmap-add-sensor">Sensor:</label>
        <select class="select-dmap-id" id="dmap-mapping-sensor">
          <option value="none" selected="">Please select</option>
          <option value="sensortag">sensorTag</option>
          <option value="amiigo">Amiigo</option>
          <option value="blockchain">blockchain</option>
        </select>
        <!--<input type="text"  placeholder="Sensor one" required />--> =
        <select class="select-dmap-id" id="dmap-mapping-sensor-two">
          <option value="none" selected="">Please select</option>
          <option value="sensortag">sensorTag</option>
          <option value="amiigo">Amiigo</option>
          <option value="blockchain">Blockchain</option>
        </select>
        <!--<input type="text"  placeholder="Sensor two" required />-->
      </li>
        </section>
        <section id="dmap-scripting-outputs">
        <header>OUTPUT</header>
        <ul>
          <li>Out put variable Activity</li>
          <li>Granularity of prediction- every 2 minutes</li>
          <li>Accuracy of Predction estimate- +/- 40 steps</li>
          <li>Suggestions:  Notification Rule=inactive 200 minutes</li>
        </ul>
        </section>
      </li>
      <li>
        <div class="clear"></div>
        <section  id="dmap-mapping-code">
        <header>Code</header>
      <li>
        <label for="add-code-name">Github url:</label>
        <input type="text"  id="mapping-code-github" placeholder="" required />
      </li>
      <li>
        <label for="add-code-name">Github hash:</label>
        <input type="text"  id="mapping-code-githubhash" placeholder="" required />
      </li>
        </section>
      </li>
      <li>
        <section id="dmap-mapping-notification">
        <header>Notifications</header>
        <li>M T W T F S S</li>
        <li>When settled</li>
        <li>CIQ earned</li>
        <li>Rules:  when temp below16 oC &amp;  Temp below -4oC</li>
        </section>
      </li>
      <li>
        <section id="dmap-mapping-visualization">
        <header>Visualization</header>
        <li>Connect to Human</li>
        <li>Connect to Our World</li>
        <li>Add own custom visualization plugin</li>
        </section>
      </li>
      <li>
        <button class="submit" type="submit"  id="dmap-save-new-mapping" >Save</button>
        <button class="submit" type="submit" id="dmap-test-new-mapping" >Test Model</button>
        <button class="submit" type="submit" id="dmap-roll-new-mapping" >Roll out to Network</button>
      </li>
      <li>
        <section id="dmap-feedback">
        </section>
      </li>
    </ul>
    </form>
      <button id="close-contribution" @click.prevent="closeScontribution()">Finsish & Close</button>
  </div>
</template>

<script>
  export default {
    name: 'science-contribute',
    components: {
    },
    props: {
      contributeData: {
        type: Object
      }
    },
    data () {
      return {}
    },
    created () {
    },
    mounted () {
    },
    computed: {
      system: function () {
        return this.$store.state.system
      }
    },
    methods: {
      closeScontribution () {
        this.contributeData.formSeen = false
      }
    }
  }
</script>

<style>

</style>

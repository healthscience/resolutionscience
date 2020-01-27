<template>
  <div id="newapi-view">
    <header>Describe API</header>
    <form id="newapi_form" name="newapi_form">
    <ul>
      <li class="api-form-item">
        <span class="required_notification">All fields required</span>
      </li>
      <li class="api-form-item">
        <label for="api-add-name">Name:</label>
        <input id="api-mapping-name" placeholder="api mapping name" required="" type="text">
      </li>
      <li class="api-form-item">
        <label for="api-add-description">Description:</label>
        <textarea name="message" cols="40" rows="6" required="" id="api-mapping-description"></textarea>
      </li>
      <li class="api-form-item">
        <label for="api-add-type">Type of contract</label>
        <select class="select-api-id" id="api-mapping-type">DT Packaging</option>
          <option value="dtpackaging">DT Packaging</option>
          <option value="dataype">Datatype</option>
          <option value="compute">Compute</option>
          <option value="experiment">Experiment</option>
        </select>
      </li>
      <li class="api-form-item">
        <label for="api-add-source">Source Primary?</label>
        <select class="select-api-source" id="">Please select</option>
          <option value="yes">YES</option>
          <option value="no">NO</option>
        </select>
      </li>
      <li class="api-form-item">
        <label for="add-code-name">Base address</label>
        <input type="text"  id="mapping-base-address" placeholder="https://" required />
      </li>
      <li class="api-form-item">
        <label for="add-table-name">Device address:</label>
        <input type="text"  id="mapping-device-address" placeholder="" required />
      </li>
      <li class="api-form-item">
        <label for="api-add-scripting">Device datatypes:</label>
        <select class="select-api-id" id="api-mapping-build">
          <option value="none" selected="">Please select</option>
          <option value="device_mac">Device Mac Address</option>
          <option value="temperature">Temperature</option>
          <option value="bpm">BPM</option>
          <option value="steps">Steps</option>
          <option value="timestamp">Timestamp</option>
        </select>
      </li>
      <li class="api-form-item">
        <label for="add-table-name">Data endpoint:</label>
        <input type="text"  id="mapping-endpoint-address" placeholder="" required />
      </li>
      <li class="api-form-item">
        <label for="api-add-scripting">Endpoint datatypes:</label>
        <select class="select-api-id" id="api-mapping-build">
          <option value="none" selected="">Please select</option>
          <option value="temperature">Temperature</option>
          <option value="bpm">BPM</option>
          <option value="steps">Steps</option>
          <option value="timestamp">Timestamp</option>
        </select>
      </li>
      <li class="api-form-item">
        <button class="submit" type="submit"  id="api-save-new-mapping" >Save</button>
        <button class="submit" type="submit" id="api-test-new-mapping" >Check Contract</button>
        <button class="submit" type="submit" id="api-roll-new-mapping" >Submit to network</button>
      </li>
      <li class="api-form-item">
        <section id="api-feedback">
        </section>
      </li>
    </ul>
    </form>
  </div>
</template>

<script>
  export default {
    name: 'newapi-page',
    components: {
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
#newapi-view {
  background-color: #EBE7E0;
  border: 1px solid lightgrey;
  padding: 10px;
}

.api-form-item {
  display: block;
  margin-bottom: 2em;
}

.api-form-item label {
  display: inline-block;
  border: 0px solid black;
  width: 160px;
}
</style>

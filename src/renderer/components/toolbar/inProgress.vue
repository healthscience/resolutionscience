<template>
  <div id="inprogress-view">
    <section v-if="progressMessage.active" id="compute-status">
      {{ progressMessage.text }}
    </section>
  </div>
</template>

<script>
  export default {
    name: 'in-progress',
    components: {
    },
    props: {
      progressMessage: {
        type: Object
      }
    },
    data () {
      return {
      }
    },
    created () {
    },
    computed: {
    },
    mounted () {
    },
    methods: {
    }
  }
</script>

<style>
#compute-status {
  width: 300px;
  height: 30px;
  background-color: pink;
  /*-webkit-animation-name: example; /* Safari 4.0 - 8.0 */
  /*-webkit-animation-duration: 12s; /* Safari 4.0 - 8.0 */
  /*animation-name: example;
  animation-duration: 12s;*/
  animation: example 1s linear infinite;
}

/* Safari 4.0 - 8.0 */
@-webkit-keyframes example {
  from {background-color: red;}
  to {background-color: yellow;}
}

/* Standard syntax */
@keyframes example {
  from {background-color: pink;}
  to {background-color: yellow;}
}
</style>

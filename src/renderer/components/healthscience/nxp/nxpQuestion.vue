<template>
  <div id="science-list">
    <header>QUESTION:</header>
    <div id="prime-question">
      <form id="question_form" name="question_form" method="post" action="#">
        <ul>
          <li>
            Prime question:<input v-model="question.text" placeholder="prime">
          </li>
          <li>
            Forum discussion:<input v-model="question.forum" placeholder="forum link">
          </li>
          <li>
            <button @click.prevent="saveQuestion($event)">Save Question</button>
          </li>
        </ul>
      </form>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'nxp-question',
    components: {
    },
    data: () => ({
      question:
      {
        text: '',
        forum: ''
      }
    }),
    created () {
    },
    mounted () {
    },
    computed: {
    },
    methods: {
      saveQuestion () {
        console.log('save question')
      }
    }
  }
</script>

<style>
</style>

<template>
  <div id="question-nxp">
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
#question-nxp {
  margin: 1em;
  border: 1px solid grey;
}

#question-nxp header{
  font-weight: bold;
}

#prime-question {
  margin: 1em;
}
</style>

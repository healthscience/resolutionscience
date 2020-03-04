<template>
  <div id="module-board">
    <header
      class="modal-header"
      id="modalTitle"
    >
      <slot name="header">
        This is the default tile!

        <button
          type="button"
          class="btn-close"
          @click="close"
          aria-label="Close modal"
        >
          Edit
        </button>
      </slot>
    </header>
    <section
      class="board-body"
      id="nxpDescription"
    >
      <div class="network-experiment">
        <slot name="body">
          N=1 network experiment summary
        </slot>
      </div>
      <div id="edit-submit">
        <slot name="submit-edit">
          <!-- no default button -->
        </slot>
      </div>
    </section>
    <footer class="board-footer">
      <slot name="footer">
        <button
          type="button"
          class="btn-green"
          @click="close"
          aria-label="Close board"
        >
          Close
        </button>
      </slot>
    </footer>
  </div>
</template>

<script>
  export default {
    name: 'module-board',
    components: {
    },
    computed: {
    },
    data: () => ({
    }),
    created () {
    },
    mounted () {
    },
    methods: {
      close () {
        this.$emit('close')
      }
    }
  }
</script>

<style>
  .btn-close {
    border: none;
    font-size: 20px;
    padding: 20px;
    cursor: pointer;
    font-weight: bold;
    color: #4AAE9B;
    background: transparent;
  }

  .btn-green {
    color: white;
    background: #4AAE9B;
    border: 1px solid #4AAE9B;
    border-radius: 2px;
  }

</style>

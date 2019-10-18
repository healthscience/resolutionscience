<template>
  <div id="table-live">
    <ul v-for="tp in tableData.tablePackage" >
     <li>
      <table v-html="tp">
        {{ tp }}
      </table>
      <div>---------------------------</div>
     </li>
    </ul>
  </div>
</template>

<script>
  export default {
    name: 'table-view',
    components: {
    },
    props: {
      tableData: {
        type: Object
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
#table-live {
  overflow:scroll;
  overflow-y:scroll;
  overflow-x:hidden;
  min-height: 900px;
}

table, th, td {
  border: 1px solid lightgrey;
}

td {
  min-width: 100px;
}

</style>

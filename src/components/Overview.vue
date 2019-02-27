<template>
  <div>
    <h1 class="title">Overview</h1>
    <p>This could be some intro-text.</p>

    <div class="componentFilter">
      <input
        class="input"
        type="search"
        placeholder="Filter..."
        v-model="filter">
    </div>

    <table class="table" cellspacing="0" cellpadding="0">
      <thead>
        <tr>
          <th width="40%">Component</th>
          <th width="30%">Type</th>
          <th width="30%">Element</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items" :key="item.type">
          <td width="40%">
            <router-link :to="`/${item.type}/${item.component}/${item.view}/view/default`">{{ item.view }}</router-link>
          </td>
          <td width="30%">{{ item.type }}</td>
          <td width="30%">{{ item.component }}</td>
        </tr>
      </tbody>
    </table>

  </div>
</template>

<script>
export default {
  name: 'Overview',

  props: {
    data: {
      type: Array
    }
  },

  data () {
    return {
      filter: null
    }
  },

  computed: {
    items () {
      let data = []
      this.data.forEach(type => {
        type.children.forEach(component => {
          component.children.forEach(view => {
            data.push({
              type: type.title,
              component: component.title,
              view: view.title
            })
          })
        })
      })

      if (this.filter) {
        data = data.filter(item => item.view.toLowerCase().includes(this.filter.toLowerCase()))
      }

      return data
    }
  }
}
</script>

<style lang="scss" scoped>
  .componentFilter {
    margin-bottom: 20px;
  }

  table {
    width: 100%;

    thead {

    }

    tbody {
      td {
        text-transform: capitalize;

        input {
          width: 100%;
        }
      }
    }
  }
</style>

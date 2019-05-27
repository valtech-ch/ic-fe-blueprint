<template>
  <section class="section">
    <div>
      <div
        class="content"
        v-if="response && response.doc">
        <vue-markdown :source="response.doc" />
      </div>

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
          <tr v-for="item in items" :key="item.view">
            <td width="40%">
              <router-link :to="`/${item.type}/${item.component}/${item.view}/view/default`">{{ item.view }}</router-link>
            </td>
            <td width="30%">{{ item.type }}</td>
            <td width="30%">{{ item.component }}</td>
          </tr>
        </tbody>
      </table>

    </div>
  </section>
</template>

<script>
import VueMarkdown from 'vue-markdown'

export default {
  name: 'Overview',

  components: {
    VueMarkdown
  },

  props: {
    selected: Object,
    data: {
      type: Array
    }
  },

  data () {
    return {
      filter: null,
      response: null
    }
  },

  mounted () {
    this.loadData()
  },

  methods: {
    loadData () {
      const { type, component, view } = this.$route.params
      let target = '/api'

      if (type) target += `/${type}`
      if (component) target += `/${component}`
      if (view) target += `/${view}`

      if (type || component || view) {
        fetch(target)
          .then(res => res.json())
          .then(res => {
            this.response = res
          })
      }
    }
  },

  computed: {
    items () {
      let data = []
      if (this.selected != null) {
        this.selected.children.forEach(component => {
          if (component.children) {
            component.children.forEach(view => {
              data.push({
                type: this.selected.title,
                component: component.title,
                view: view.title
              })
            })
          }
        })
      } else {
        this.data.forEach(type => {
          if (type.children) {
            type.children.forEach(component => {
              if (component.children) {
                component.children.forEach(view => {
                  data.push({
                    type: type.title,
                    component: component.title,
                    view: view.title
                  })
                })
              }
            })
          }
        })
      }

      if (this.filter) {
        data = data.filter(item => item.view.toLowerCase().includes(this.filter.toLowerCase()))
      }

      return data
    },

    pageTitle () {
      let pageTitle
      const { type, component, view } = this.$route.params

      if (view) pageTitle = view
      if (type) pageTitle = type
      if (component) pageTitle = component

      if (!pageTitle) pageTitle = 'Overview'

      return pageTitle
    }
  },

  watch: {
    '$route' (to, from) {
      this.loadData()
    }
  }
}
</script>

<style lang="scss" scoped>
  .componentFilter {
    margin-bottom: 20px;
  }

  .title {
    text-transform: capitalize;
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

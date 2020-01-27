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
              <router-link v-if="!isPages" :to="`/${item.type}/${item.view}/view/default`">{{ item.view }}</router-link>
              <router-link v-else :to="`/${item.type}/${item.view}`">{{ item.view }}</router-link>
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
    this.isPages()
  },

  methods: {
    loadData () {
      const { type, view } = this.$route.params
      let target = '/api'

      if (type) target += `/${type}`
      if (view) target += `/${view}`

      if (type || view) {
        fetch(target)
          .then(res => res.json())
          .then(res => {
            this.response = res
          })
      }
    },
    isPages () {
      return this.$route.params.type === 'pages'
    }
  },

  computed: {
    items () {
      let data = []
      if (this.selected) {
        this.selected.children.forEach(component => {
          data.push({
            type: this.selected.title,
            view: component.title
          })
        })
      } else {
        this.data.forEach(type => {
          if (type.children) {
            type.children.forEach(component => {
              data.push({
                type: type.title,
                view: component.title
              })
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
      let pageTitleParts = []
      let pageTitle
      const { type } = this.$route.params

      if (type) {
        pageTitleParts.push(type)
      }

      if (pageTitleParts.length === 0) {
        pageTitle = 'Overview'
      } else {
        pageTitle = pageTitleParts.reverse().join(' - ')
      }

      return pageTitle
    }
  },

  watch: {
    '$route' (to, from) {
      this.loadData()
    },
    pageTitle: {
      immediate: true,
      handler: function (value) {
        this.$root.$emit('titleChanged', value)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .componentFilter {
    margin-bottom: 20px;

    input {
      border: 1px solid lightgray;
      outline: none;
      padding: 4px 8px;

      &:focus {
        border: 1px solid darkgray;
      }
    }
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

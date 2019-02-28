<template>
  <section class="section">
    <div>
      <h1 class="title">{{ $route.params.view }}</h1>

      <div class="modelSelection">
        <div class="dropdown is-hoverable">
          <div class="dropdown-trigger">
            <button class="button" aria-haspopup="true" aria-controls="modelsDropdown">
              <span>Selected View-Model: {{ model }}</span>
              <span class="icon is-small">
                <svg class="svg-inline--fa fa-angle-down fa-w-10" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="angle-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" data-fa-i2svg=""><path fill="currentColor" d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z"></path></svg>
              </span>
            </button>
          </div>
          <div class="dropdown-menu" id="modelsDropdown" role="menu">
            <div class="dropdown-content">
              <router-link
                v-for="(item, _model) in models"
                :key="_model"
                :to="`/${rParams.type}/${rParams.component}/${rParams.view}/${rParams.tab}/${_model}`"
                :class="{ ' is-active': model === _model }"
                class="dropdown-item">{{ _model }}</router-link>
            </div>
          </div>
        </div>
      </div>

      <div class="tabs">
        <ul>
          <li :class="{'is-active': activeTab === 'view'}">
            <router-link
              :to="`/${rParams.type}/${rParams.component}/${rParams.view}/view/${model}`">View</router-link>
          </li>
          <li :class="{'is-active': activeTab === 'model'}">
            <router-link
              :to="`/${rParams.type}/${rParams.component}/${rParams.view}/model/${model}`">Model</router-link>
          </li>
          <li :class="{'is-active': activeTab === 'documentation'}">
            <router-link
              :to="`/${rParams.type}/${rParams.component}/${rParams.view}/documentation/${model}`">Documentation</router-link>
          </li>
          <li :class="{'is-active': activeTab === 'raw'}">
            <router-link
              :to="`/${rParams.type}/${rParams.component}/${rParams.view}/raw/${model}`">Raw</router-link>
          </li>
        </ul>
      </div>

      <pre>{{ component }}: {{ data }}</pre>

      <div class="tabs-content">
        <template v-if="activeTab === 'view'">
          <component :is="component" v-bind="models[model]" />
        </template>

        <template v-else-if="activeTab === 'model'">
          <pre>{{ models[model] }}</pre>
        </template>

        <template v-else-if="activeTab === 'documentation'">
          <vue-markdown :source="data.doc" />
        </template>

        <template v-else-if="activeTab === 'raw'">
          <div v-html="data.raw" />
        </template>
      </div>
    </div>
  </section>
</template>

<script>
import VueMarkdown from 'vue-markdown'

export default {
  name: 'ComponentView',

  components: {
    VueMarkdown
  },

  data () {
    return {
      component: null,
      data: {}
    }
  },

  methods: {
    loadData (type, component, view) {
      const componentName = view[0].toUpperCase() + view.slice(1)

      this.component = () => import(`@/../ic-components/components/${type}/${component}/vue/${componentName}.vue`)

      fetch(`http://localhost:3000/${type}/${component}/${view}`)
        .then(res => res.json())
        .then(res => {
          this.data = res
        })
    }
  },

  computed: {
    model () {
      return this.$route.params.model
    },

    models () {
      return this.data.models || {}
    },

    activeTab () {
      return this.$route.params.tab
    },

    rParams () {
      const { type, component, view } = this.$route.params

      this.loadData(type, component, view)

      return { ...this.$route.params }
    }
  }
}
</script>

<style scoped>

  .modelSelection {
    padding: 20px 0;
  }

  .dropdown-item {
    text-transform: capitalize;
  }
</style>

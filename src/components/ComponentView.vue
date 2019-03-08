<template>
  <section class="section">
    <div>
      <h1 class="title">{{ pageTitle }}</h1>

      <div class="modelSelection">
        <div class="dropdown is-hoverable">
          <div class="dropdown-trigger">
            <button class="button" aria-haspopup="true" aria-controls="modelsDropdown">
              <span>Current data: {{ modelDisplay }}</span>
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
              :to="`/${rParams.type}/${rParams.component}/${rParams.view}/view/${model}`">Demo</router-link>
          </li>
          <li :class="{'is-active': activeTab === 'model'}">
            <router-link
              :to="`/${rParams.type}/${rParams.component}/${rParams.view}/model/${model}`">Model</router-link>
          </li>
          <li :class="{'is-active': activeTab === 'documentation'}">
            <router-link
              :to="`/${rParams.type}/${rParams.component}/${rParams.view}/documentation/${model}`">Documentation</router-link>
          </li>
          <li :class="{'is-active': activeTab === 'usage'}">
            <router-link
              :to="`/${rParams.type}/${rParams.component}/${rParams.view}/usage/${model}`">Usage</router-link>
          </li>
          <li :class="{'is-active': activeTab === 'raw'}">
            <router-link
              :to="`/${rParams.type}/${rParams.component}/${rParams.view}/raw/${model}`">Raw</router-link>
          </li>
        </ul>
      </div>

      <div class="tabs-content">
        <template v-if="activeTab === 'view'">
          <div :isNot="component" v-html="data.raw" />
          <component :is="component" v-bind="models[model]" />
        </template>

        <template v-else-if="activeTab === 'model'">
          <pre>{{ models[model] }}</pre>
        </template>

        <template v-else-if="activeTab === 'documentation'">
          <div class="content">
            <vue-markdown :source="data.doc" />
          </div>
        </template>

        <template v-else-if="activeTab === 'usage'">
          <div class="content">
            <h2>Template</h2>
            <pre class="usage" v-if="data.html">{{ data.html }}
              <button
                class="button button1"
                type="button"
                v-clipboard:success="onCopy"
                v-clipboard:copy="data.html"
                :class="{ 'is-success': copied1 }">Copy!</button>
            </pre>
            <hr>
            <h2>Html</h2>
            <pre class="usage" v-if="data.raw">{{ data.raw }}
              <button
                class="button button2"
                type="button"
                v-clipboard:success="onCopy"
                v-clipboard:copy="data.raw"
                :class="{ 'is-success': copied2 }">Copy!</button>
            </pre>
          </div>
        </template>

        <template v-else-if="activeTab === 'raw'">
          <div v-html="data.raw" />
        </template>
      </div>
    </div>
  </section>
</template>

<script>
import Vue from 'vue'
import VueMarkdown from 'vue-markdown'
import VueClipboard from 'vue-clipboard2'

Vue.use(VueClipboard)

export default {
  name: 'ComponentView',

  components: {
    VueMarkdown
  },

  data () {
    return {
      component: null,
      data: {},
      copied1: false,
      copied2: false
    }
  },

  methods: {
    loadData (type, component, view, viewModel) {
      const componentName = view[0].toUpperCase() + view.slice(1)

      fetch(`http://localhost:3000/${type}/${component}/${view}/${viewModel}`)
        .then(res => res.json())
        .then(res => {
          this.data = res
          this.component = res.hbsOnly
            ? () => false
            : () => import(`@/../ic-components/components/${type}/${component}/vue/${componentName}.vue`)
        })
    },

    onCopy (event) {
      const pos = (event.trigger.classList.contains('button1')) ? 1 : 2
      this[`copied${pos}`] = true
      window.setTimeout(() => {
        this[`copied${pos}`] = false
      }, 2500)
    }
  },

  computed: {
    model () {
      return this.$route.params.model
    },

    modelDisplay () {
      const { model } = this.$route.params
      return model.charAt(0).toUpperCase() + model.slice(1)
    },

    models () {
      return this.data.models || {}
    },

    activeTab () {
      return this.$route.params.tab
    },

    rParams () {
      const { type, component, view, model } = this.$route.params

      this.loadData(type, component, view, model)

      return { ...this.$route.params }
    },

    pageTitle () {
      const { view } = this.$route.params
      return view.charAt(0).toUpperCase() + view.slice(1)
    }
  }
}
</script>

<style lang="scss" scoped>
  .usage {
    position: relative;

    button {
      position: absolute;
      top: 5px;
      right: 5px;
    }
  }

  .modelSelection {
    padding: 20px 0;
  }

  .dropdown-item {
    text-transform: capitalize;
  }
</style>

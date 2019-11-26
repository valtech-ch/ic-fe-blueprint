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
                <svg class="svg-inline--fa fa-angle-down fa-w-10" aria-hidden="true" focusable="false" data-prefix="fas"
                     data-icon="angle-down" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"
                     data-fa-i2svg=""><path fill="currentColor"
                                            d="M143 352.3L7 216.3c-9.4-9.4-9.4-24.6 0-33.9l22.6-22.6c9.4-9.4 24.6-9.4 33.9 0l96.4 96.4 96.4-96.4c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9l-136 136c-9.2 9.4-24.4 9.4-33.8 0z"></path></svg>
              </span>
                        </button>
                    </div>
                    <div class="dropdown-menu" id="modelsDropdown" role="menu">
                        <div class="dropdown-content">
                            <router-link
                                    v-for="(item, _model) in models"
                                    :key="_model"
                                    :to="`/${rParams.type}/${rParams.view}/${rParams.tab}/${_model}`"
                                    :class="{ ' is-active': model === _model }"
                                    class="dropdown-item">{{ _model }}
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>

            <div class="tabs">
                <ul>
                    <li v-if="!data.cmsOnly" :class="{'is-active': activeTab === 'view'}">
                        <router-link
                                :to="`/${rParams.type}/${rParams.view}/view/${model}`">Vue
                        </router-link>
                    </li>
                    <li v-if="models[model]" :class="{'is-active': activeTab === 'model'}">
                        <router-link
                                :to="`/${rParams.type}/${rParams.view}/model/${model}`">Model
                        </router-link>
                    </li>
                    <li v-if="data.doc" :class="{'is-active': activeTab === 'documentation'}">
                        <router-link
                                :to="`/${rParams.type}/${rParams.view}/documentation/${model}`">Documentation
                        </router-link>
                    </li>
                    <li v-if="data.html || data.raw" :class="{'is-active': activeTab === 'usage'}">
                        <router-link
                                :to="`/${rParams.type}/${rParams.view}/usage/${model}`">Usage
                        </router-link>
                    </li>
                    <li v-if="data.raw" :class="{'is-active': activeTab === 'raw'}">
                        <router-link
                                :to="`/${rParams.type}/${rParams.view}/raw/${model}`">{{ data.cms.toUpperCase() || 'Raw'
                            }}
                        </router-link>
                    </li>
                    <li v-if="data.notifications && data.notifications.length > 0"
                        :class="{'is-active': activeTab === 'notifications'}">
                        <router-link
                                :to="`/${rParams.type}/${rParams.view}/notifications/${model}`">Notifications
                        </router-link>
                    </li>
                    <li v-if="data.errors && data.errors.length > 0" :class="{'is-active': activeTab === 'errors'}">
                        <router-link
                                :to="`/${rParams.type}/${rParams.view}/errors/${model}`">Errors
                        </router-link>
                    </li>
                    <li v-if="!data.cmsOnly" :class="{'is-active': activeTab === 'markup'}">
                        <router-link
                                :to="`/${rParams.type}/${rParams.view}/markup/${model}`">Markup
                        </router-link>
                    </li>
                </ul>
            </div>

            <div class="tabs-content">
                <template v-if="activeTab === 'view'">
                    <component v-if="component" :is="component" v-bind="models[model]"/>
                    <div v-else>No Vue component available</div>
                </template>

                <template v-else-if="activeTab === 'model'">
                    <pre>{{ models[model] }}</pre>
                </template>

                <template v-else-if="activeTab === 'documentation'">
                    <vue-markdown :source="data.doc"/>
                </template>

                <template v-else-if="activeTab === 'usage'">
          <pre class="usage" v-if="data.html">{{ data.html }}
            <button
                    class="button button1"
                    type="button"
                    v-clipboard:success="onCopy"
                    v-clipboard:copy="data.html"
                    :class="{ 'is-success': copied1 }">Copy!</button>
          </pre>
                    <hr>
                    <pre class="usage" v-if="data.raw">{{ data.raw }}
            <button
                    class="button button2"
                    type="button"
                    v-clipboard:success="onCopy"
                    v-clipboard:copy="data.raw"
                    :class="{ 'is-success': copied2 }">Copy!</button>
          </pre>
                </template>

                <template v-else-if="activeTab === 'raw'">
                    <div v-html="data.raw"/>
                </template>
                <template v-else-if="activeTab === 'notifications'">
                    <ul>
                        <li
                                v-for="(notification, index) in data.notifications"
                                :key="index">
                            {{ notification.text }}
                        </li>
                    </ul>
                </template>
                <template v-else-if="activeTab === 'errors'">
                    <ul>
                        <li
                                v-for="(errors, index) in data.errors"
                                :key="index">
                            {{ errors.text }}
                        </li>
                    </ul>
                </template>
                <template v-else-if="activeTab === 'markup'">
                    <div v-if="component" class="markup" v-markup>
                        <component :is="component" v-bind="models[model]"/>
                        <button
                                class="button button1"
                                type="button"
                                v-clipboard:success="onCopy"
                                v-clipboard:copy="markupData"
                                :class="{ 'is-success': copied1 }">Copy!
                        </button>
                    </div>
                    <div v-else>No Vue component available</div>
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

Vue.directive('markup',
  {
    bind: (el, binding, vnode) => {
      const regEx = /(\sdata-v-\w+?="")/g
      const markup = el.innerHTML.replace(regEx, '')
      const node = document.createElement('code')
      const markupNode = document.createTextNode(markup)
      const firstChild = el.firstElementChild

      if (firstChild) {
        node.appendChild(markupNode)
        el.appendChild(node)
        firstChild.style.display = 'none'
        vnode.context.markupData = markup
      }
    }
  }
)

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
      copied2: false,
      markupData: ''
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
      const { type, view, model } = this.$route.params

      this.loadData(type, view, model)

      return { ...this.$route.params }
    },

    pageTitle () {
      const { type, view } = this.$route.params
      let pageTitleParts = [ type, view ]

      return pageTitleParts.reverse().join(' - ')
    }
  },

  watch: {
    pageTitle: {
      immediate: true,
      handler: function (value) {
        this.$root.$emit('titleChanged', value)
      }
    }
  },

  methods: {
    loadData (type, view, model) {
      const componentName = view[0].toUpperCase() + view.slice(1)

      fetch(`/api/${type}/${view}/${model}`)
        .then(res => res.json())
        .then(res => {
          this.data = res
          this.component = res.cmsOnly ? false : componentName
        })
    },

    onCopy (event) {
      const pos = (event.trigger.classList.contains('button1')) ? 1 : 2
      this[`copied${pos}`] = true
      window.setTimeout(() => {
        this[`copied${pos}`] = false
      }, 2500)
    }
  }
}
</script>

<style lang="scss" scoped>
    .usage, .markup {
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

    .markup {
        padding: 20px;
        background-color: white;

        &:empty {
          display: none;
        }
    }
</style>

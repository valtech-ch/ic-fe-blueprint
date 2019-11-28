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
                :to="`/${rParams.type}/${rParams.view}/${rParams.tab}/${_model}`"
                :class="{ ' is-active': model === _model }"
                class="dropdown-item">{{ _model }}</router-link>
            </div>
          </div>
        </div>
        <ul class="component-tools">
          <li v-if="activeTab === 'view'" @click="direction">
            <span v-if="this.rtl">{{ labelLtr }}</span>
            <span v-else>{{ labelRtl }}</span>
          </li>
          <li>
            <span @click="showGrid" :class="this.grid ? 'active' : ''">{{ labelGrid }}</span>
          </li>
          <li class="breakpoints">
            <span v-if="!this.breakpoints.desktop" @click="breakpoint('rotate')" :class="this.landscape && breakpoints.mobile || breakpoints.tablet ? 'active' : ''">
              <template v-if="this.landscape">&olarr;</template>
              <template v-else>&orarr;</template>
            </span>
            <span @click="breakpoint('mobile')" :class="breakpoints.mobile ? 'active' : ''">{{ mobile }}</span>
            <span @click="breakpoint('tablet')" :class="breakpoints.tablet ? 'active' : ''">{{ tablet }}</span>
            <span v-if="!this.breakpoints.desktop" @click="breakpoint('desktop')">{{ desktop }}</span>
          </li>
        </ul>
      </div>

      <div class="tabs">
        <ul>
          <li v-if="!data.cmsOnly" :class="{'is-active': activeTab === 'view'}">
            <router-link
              :to="`/${rParams.type}/${rParams.view}/view/${model}`">Vue</router-link>
          </li>
          <li v-if="models[model]" :class="{'is-active': activeTab === 'model'}">
            <router-link
              :to="`/${rParams.type}/${rParams.view}/model/${model}`">Model</router-link>
          </li>
          <li v-if="data.doc" :class="{'is-active': activeTab === 'documentation'}">
            <router-link
              :to="`/${rParams.type}/${rParams.view}/documentation/${model}`">Documentation</router-link>
          </li>
          <li v-if="data.html || data.raw" :class="{'is-active': activeTab === 'usage'}">
            <router-link
              :to="`/${rParams.type}/${rParams.view}/usage/${model}`">Usage</router-link>
          </li>
          <li v-if="data.raw" :class="{'is-active': activeTab === 'raw'}">
            <router-link
              :to="`/${rParams.type}/${rParams.view}/raw/${model}`">{{ data.cms.toUpperCase() || 'Raw' }}</router-link>
          </li>
          <li v-if="data.notifications && data.notifications.length > 0" :class="{'is-active': activeTab === 'notifications'}">
            <router-link
              :to="`/${rParams.type}/${rParams.view}/notifications/${model}`">Notifications</router-link>
          </li>
          <li v-if="data.errors && data.errors.length > 0" :class="{'is-active': activeTab === 'errors'}">
            <router-link
              :to="`/${rParams.type}/${rParams.view}/errors/${model}`">Errors</router-link>
          </li>
        </ul>
      </div>
      <div :dir="this.rtl ? 'rtl' : 'ltr'" class="tabs-content"
           :class="this.breakpoints.mobile && !this.landscape ? 'mobile portrait' : '' || this.breakpoints.mobile && this.landscape ? 'mobile landscape' : '' || this.breakpoints.tablet && !this.landscape ? 'tablet portrait' : '' || this.breakpoints.tablet && this.landscape ? 'tablet landscape' : ''">

        <svg v-if="grid" class="svg-grid" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="smallGrid" width="8" height="8" patternUnits="userSpaceOnUse">
              <path d="M 8 0 L 0 0 0 8" fill="none" stroke="gray" stroke-width="0.5"/>
            </pattern>
            <pattern id="grid" width="80" height="80" patternUnits="userSpaceOnUse">
              <rect width="80" height="80" fill="url(#smallGrid)"/>
              <path d="M 80 0 L 0 0 0 80" fill="none" stroke="gray" stroke-width="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        <template v-if="activeTab === 'view'">
          <component v-if="component" :is="component" v-bind="models[model]" />
          <div v-else>No Vue component available</div>
        </template>

        <template v-else-if="activeTab === 'model'">
          <pre>{{ models[model] }}</pre>
        </template>

        <template v-else-if="activeTab === 'documentation'">
          <vue-markdown :source="data.doc" />
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
          <component :is="insertRaw(data.raw)"/>
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
      </div>
    </div>
  </section>
</template>

<script>
import Vue from 'vue'
import VueMarkdown from 'vue-markdown'
import VueClipboard from 'vue-clipboard2'
import 'mdn-polyfills/CustomEvent'

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
      copied2: false,
      mobile: 'mobile',
      tablet: 'tablet',
      desktop: 'desktop',
      labelRtl: 'RTL',
      labelLtr: 'LTR',
      labelGrid: 'Grid',
      rtl: false,
      grid: false,
      landscape: false,
      breakpoints: {
        desktop: true,
        tablet: false,
        mobile: false
      }
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
    },

    'data.cmsOnly': {
      immediate: true,
      handler: function (isCmsOnly) {
        if (isCmsOnly && this.$route.params.tab === 'view' && this.data.raw) {
          this.$router.replace({ params: { tab: 'raw' } })
        }

        if (!isCmsOnly && this.$route.params.tab === 'raw') {
          this.$router.replace({ params: { tab: 'view' } })
        }
      }
    },

    '$route.params.tab' (tab) {
      if (this.data.cmsOnly && tab === 'view') {
        this.$router.replace({ params: { tab: 'raw' } })
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

          Vue.nextTick(() => {
            document.dispatchEvent(new CustomEvent('DOMContentLoaded'))
          })
        })
    },

    onCopy (event) {
      const pos = (event.trigger.classList.contains('button1')) ? 1 : 2
      this[`copied${pos}`] = true
      window.setTimeout(() => {
        this[`copied${pos}`] = false
      }, 2500)
    },

    insertRaw (template) {
      return {
        template
      }
    },

    direction () {
      this.rtl = !this.rtl
    },

    breakpoint (value) {
      if (value === 'mobile') {
        this.breakpoints.tablet = false
        this.breakpoints.desktop = false
        this.breakpoints.mobile = true
      } else if (value === 'tablet') {
        this.breakpoints.desktop = false
        this.breakpoints.mobile = false
        this.breakpoints.tablet = true
      } else if (value === 'desktop') {
        this.breakpoints.mobile = false
        this.breakpoints.tablet = false
        this.breakpoints.desktop = true
      }

      if (value === 'rotate') {
        this.landscape = !this.landscape
      }
    },
    showGrid() {
      this.grid = !this.grid
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

.tabs-content {
  position: relative;

  .svg-grid {
    position: absolute;
    pointer-events: none;
  }
}

.modelSelection {
  padding: 20px 0;

  .component-tools {
      float: right;

    .active {
      font-weight: bold;
    }

    .breakpoints {
      &:hover {
        font-weight: normal;
      }

      span {
        &:hover {
          font-weight: bold;
        }

        &:not(:last-child):after {
          padding: 0 6px;
          content: '•';
          pointer-events: none;
        }

        &.active {
          color: #44453a;
          font-style: italic;
          font-weight: bold;

          &:after {
            font-style: normal;
          }
        }
      }
    }

    li {
      display: inline-block;

      &:empty {
        display: none;
      }

      &:hover {
        font-weight: bold;
        cursor: pointer;
      }

      &:not(:last-child):after {
        padding: 0 6px;
        content: '|';
      }
    }
  }
}

.dropdown-item {
  text-transform: capitalize;
}

.is-fullscreen-demo .tabs-content {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #fff;
}

@mixin properties {
  position: absolute;
  top: -24px;
  text-align: center;
  width: 100%;
}

  .mobile {
    border: 2px dashed #757763;
    position: relative;

    &:before {
      @include properties;
    }

    &.portrait {
      height: 1218px;
      width: 568px;

      &:before{
        content: 'mobile (portrait)';
      }
    }

    &.landscape {
      height: 568px;
      width: 1218px;

      &:before{
        content: 'mobile (landscape)';
      }
    }
  }

  .tablet {
    border: 2px dashed #757763;
    position: relative;

    &:before {
      @include properties;
    }

    &.portrait {
      height: 1024px;
      width: 768px;

      &:before{
        content: 'tablet (portrait)';
      }
    }

    &.landscape {
      height: 768px;
      width: 1024px;

      &:before{
        content: 'tablet (landscape)';
      }
    }
  }
</style>

<template>
  <div id="app" class="columns" :class="{ 'is-fullscreen-demo': isFullscreenDemo, 'is-wide-demo': isWideDemo }">
    <button class="fullscreen-toggle" v-on:click="toggleFullscreenView()">{{ toggleFullscreen }}</button>
    <div class="column is-narrow">
      <aside class="menu">
        <router-link :to="'/'"><img class="menu-image" :src="logo"></router-link>
          <div class="scroll-area">
            <template v-for="(type, index) in navigation">
              <router-link :key="type.title" :to="`/${type.title}`">
                  <span @click="type.children.length>0 ? menuCategory(index) : ''" class="menu-label">
                     <span>{{ type.title }}</span>
                    <template v-if="type.children.length>0">
                     <span v-if="selectedMenuItem !== index"><b>+</b></span>
                     <span v-else><b>-</b></span>
                    </template>
                  </span>
              </router-link>
              <ul
                v-for="component in type.children"
                :key="component.title"
                class="menu-list">
                <li v-if="selectedMenuItem === index" class="menu-element">
                  <router-link :to="`/${type.title}/${component.title}`">{{ component.title }}</router-link>
                </li>
              </ul>
            </template>
          </div>
      </aside>
    </div>
    <div class="column">
      <router-view
        :selected="selected"
        :data="navigation" />
    </div>
  </div>
</template>

<script>
import '@assets/blueprint/app.pcss'
import logo from '@assets/blueprint/logo.svg'

export default {
  name: 'App',

  data () {
    return {
      logo,
      navigation: {},
      isFullscreenDemo: false,
      isWideDemo: false,
      toggleFullscreen: 'toggle fullview',
      selectedMenuItem: null
    }
  },
  methods: {
    toggleFullscreenView () {
      this.isFullscreenDemo = !this.isFullscreenDemo
    },

    menuCategory (index) {
      if (this.selectedMenuItem === index) {
        this.selectedMenuItem = null
      } else this.selectedMenuItem = index
    }
  },
  mounted () {
    this.isFullscreenDemo = window.location.href.indexOf('#fullview') > -1

    fetch('/api/structure')
      .then(res => res.json())
      .then(res => {
        this.navigation = res
      })

    document.addEventListener('keydown', (event) => {
      // cmd+f
      if (event.altKey && event.which === 70) {
        this.toggleFullscreenView()
      }

      // cmd+s
      if (event.altKey && event.which === 83) {
        this.isWideDemo = !this.isWideDemo
      }
    })
  },

  computed: {
    selected () {
      if (Array.isArray(this.navigation)) {
        return this.navigation.filter(i => i.title === this.$route.params.type).pop()
      } else {
        return {}
      }
    }
  }
}
</script>

<style lang="scss">
@charset "utf-8";

// Import a Google Font
@import url('https://fonts.googleapis.com/css?family=Nunito:400,700');

// Set your brand colors
$purple: #8A4D76;
$pink: #FA7C91;
$brown: #757763;
$beige-light: #D0D1CD;
$beige-lighter: #EFF0EB;
$ic-green: #afcb37;
$ic-blue: #15444C;

// Update Bulma's global variables
$family-sans-serif: "Nunito", sans-serif;
$grey-dark: $brown;
$grey-light: $beige-light;
$primary: $purple;
$link: $ic-blue;
$widescreen-enabled: false;
$fullhd-enabled: false;

// Update some of Bulma's component variables
$body-background-color: $beige-lighter;
$control-border-width: 2px;
$input-border-color: transparent;
$input-shadow: none;

// Import only what you need from Bulma
@import "bulma/sass/utilities/_all.sass";

// elements
@import "bulma/sass/elements/button.sass";
@import "bulma/sass/elements/icon.sass";
@import "bulma/sass/elements/image.sass";
@import "bulma/sass/elements/title.sass";
@import "bulma/sass/elements/other.sass";

@import "bulma/sass/components/_all.sass";
@import "bulma/sass/grid/_all.sass";
@import "bulma/sass/layout/_all.sass";

*, *:before, *:after {
  box-sizing: border-box;
}

html, body {
  height: 100%;
  width: 100%;
}

#app {
  height: 100%;
  width: 100%;
  margin: 0;
}

.fullscreen-toggle {
  position: fixed;
  right: 0;
  bottom: 0;
  padding: 10px;
  background: black;
  color: white;
  z-index: 1;
  opacity: 0.7;
}

.menu {
  display: block;
  background: $grey-light;
  min-height: calc(100% + #{2 * $column-gap});
  height: 100%;
  padding: $column-gap;
  margin: - $column-gap;

  a {
    text-decoration: none;
  }

  &-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }

  &-image {
    width: 80%;
    max-height: 80px;
    margin-bottom: 50px;
  }

  &-element {
    padding-left: 20px;

    a {
      text-transform: capitalize;
    }

    .menu-element {
      padding-left: 20px;
    }
  }

    .menu-label {
      display: flex;
      justify-content: space-between;
        &:hover {
          color: black;
        }
    }

  .is-fullscreen-demo &,
  .is-wide-demo & {
    width: 0;
    height: 0;
    padding: 0;
    overflow: hidden;
  }

  .scroll-area {
    overflow-y: auto;
    height: calc(100% - 110px);

    &::-webkit-scrollbar {
      width: 2px;
    }

    &::-webkit-scrollbar-thumb {
      background: silver;
    }

    &:hover {
      &::-webkit-scrollbar-thumb {
        background: darkgray;
      }
    }
  }
}

.menu-element .menu-element{
  padding-left: 20px;
}
</style>

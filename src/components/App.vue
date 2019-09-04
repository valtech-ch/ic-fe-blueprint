<template>
  <div id="app" class="columns">
    <div class="column is-narrow" v-show="hideSideMenu()">
      <aside class="menu">
        <router-link :to="'/'"><img class="menu-image" :src="logo"></router-link>

        <template v-for="type in navigation">
          <router-link :key="type.title" :to="`/${type.title}`">
            <p
              class="menu-label"
              :key="type.title">{{ type.title }}</p>
          </router-link>
          <ul
            v-for="component in type.children"
            :key="component.title">
            <li class="menu-element">
              <router-link :to="`/${type.title}/${component.title}`">{{ component.title }}</router-link>
            </li>
          </ul>
        </template>
        <p>Tools</p>
        <ul>
          <li class="menu-element">
            <a href="#fullview">{{ fullView }}</a>
          </li>
        </ul>
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
import logo from '@assets/img/logo.svg'

export default {
  name: 'App',

  data () {
    return {
      logo,
      navigation: {},
      fullView: 'full view'
    }
  },

  methods: {
    hideSideMenu() {
      if (window.location.href.indexOf("#fullview") > -1) {
        return false
      } else {
        return true
      }
    }
  },

  mounted () {
    fetch('/api/structure')
      .then(res => res.json())
      .then(res => {
        this.navigation = res
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
@import "bulma/sass/base/_all.sass";
@import "bulma/sass/elements/_all.sass";
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
}

.menu {
  min-width: 250px;
  background: $grey-light;
  padding: 20px;

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
}

.menu-element .menu-element{
  padding-left: 20px;
}
</style>

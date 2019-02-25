<template>
  <div id="app" class="columns">
    <div class="column is-narrow">
      <aside class="menu">
        <img class="menu-image" :src="logo">

        <template v-for="(item, type) in navigation">
          <p class="menu-label" :key="type">{{ type }}</p>

          <ul v-if="Array.isArray(elements)" class="menu-part" v-for="(elements, component) in item" :key="component">
            <li class="menu-element">
              <router-link :to="`/${type}/${component}`">{{ component }}</router-link>
              <ul class="menu-part">
                <li
                  class="menu-element"
                  v-for="element in elements"
                  :key="element">
                  <router-link :to="`/${type}/${component}/${element}/view/default`">{{ element }}</router-link>
                </li>
              </ul>
            </li>
          </ul>

          <ul v-else class="menu-part" :key="`${type}_${item}`">
            <li class="menu-element">
              <ul class="menu-part">
                <li class="menu-element">
                  <router-link :to="`/${type}/${elements}`">{{ elements }}</router-link>
                </li>
            </ul>
            </li>
          </ul>
        </template>
      </aside>
    </div>
    <div class="column">
      <router-view :data="navigation[$route.params.type]" />
    </div>
  </div>
</template>

<script>
import logo from '@/assets/logo.svg'

export default {
  name: 'App',

  data () {
    return {
      logo,
      navigation: {}
    }
  },

  mounted () {
    fetch('http://localhost:3000/structure')
      .then(res => res.json())
      .then(res => {
        this.navigation = res
      })
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
@import "../node_modules/bulma/sass/utilities/_all.sass";
@import "../node_modules/bulma/sass/base/_all.sass";
@import "../node_modules/bulma/sass/elements/_all.sass";
@import "../node_modules/bulma/sass/components/_all.sass";
@import "../node_modules/bulma/sass/grid/_all.sass";
@import "../node_modules/bulma/sass/layout/_all.sass";

html, body {
  height: 100vh
}

.menu {
  min-width: 250px;
  background: $grey-light;
  height: 100vh;
  padding: 20px;

  &-image {
    width: 50%;
    margin-bottom: 50px;
  }

  &-element {
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

.modelSelection {
  padding: 20px 0;
}

.vmBox {
  margin: 20px 0;

  .vmLine {
    padding-left: 20px;
    display: inline-block;

    .vmString {
      color: desaturate($primary, 80%);
    }

    .vmNumber {
      color: desaturate($primary, 80%);
    }

    .vmBoolean {
      color: desaturate($primary, 80%);
    }

    .vmNull {
      color: desaturate($primary, 80%);
    }

    .vmKey {
      color: $primary;
    }
  }
}

.documentation {
  padding-top: 20px;
}
</style>

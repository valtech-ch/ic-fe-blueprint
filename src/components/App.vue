<template>
  <div id="app" class="columns" :class="{ 'is-fullscreen-demo': isFullscreenDemo, 'is-wide-demo': isWideDemo }">
    <button class="fullscreen-toggle" v-on:click="toggleFullscreenView()">{{ toggleFullscreen }}</button>
    <div class="column is-narrow">
      <aside class="menu">
        <router-link :to="'/'"><img class="menu-image" :src="logo"></router-link>
        <template v-for="(type, index) in navigation">
          <router-link :key="type.title" :to="`/${type.title}`">
              <span @click="type.children.length>0 ? menuCategory(index) : ''" class="menu-label">
                <span>{{ type.title }}</span>
                <template v-if="type.children.length>0">
                 <span v-show="selectedMenuItem !== index"><b>+</b></span>
                 <span v-show="selectedMenuItem === index"><b>-</b></span>
                </template>
              </span>
          </router-link>
          <ul
            v-for="component in type.children"
            :key="component.title"
            class="menu-list">
            <li v-show="selectedMenuItem === index" class="menu-element">
              <router-link :to="`/${type.title}/${component.title}`">{{ component.title }}</router-link>
            </li>
          </ul>
        </template>
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
import logo from '@assets/img/logo.svg'

export default {
  name: 'App',

  data () {
    return {
      logo,
      navigation: {},
      isFullscreenDemo: false,
      isWideDemo: false,
      toggleFullscreen: 'toggle fullview',
      selectedMenuItem: null,
      menuItems: null,
      menuTitles: {}
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

  updated() {

    // this.menuItems = document.querySelectorAll('.menu .menu-label').length
    // if (this.menuItems) {
    //   for (let i = 0; i <= this.menuItems; i++) {
    //     // this.menuTitles[i] = document.querySelectorAll('.menu .menu-label')[i].firstChild.textContent
    //     this.menuTitles[i] = 0
    //
    //   }
    //   // console.log(this.menuTitles[3])
    // }



    // console.log(this.menuTitles[0])
    //
    // console.log(this.menuItems)
    // this.takeItems()
    // console.log(this.takeItems())

    // console.log(this.navigation[0].title)

    // if (location.href.indexOf(this.navigation[0].title) > -1) {
    //   this.menuCategory(0)
    // }
    //
    // else if (location.href.indexOf(this.navigation[1].title) > -1) {
    //   this.menuCategory(1)
    // } else if (location.href.indexOf(this.navigation[2].title) > -1) {
    //   this.menuCategory(2)
    // } else if (location.href.indexOf(this.navigation[3].title) > -1) {
    //   this.menuCategory(3)
    // }
  },

  mounted () {

    setTimeout(function(){
      let  list =document.querySelectorAll('.is-narrow .menu .menu-label')

      let test = false
      let listIndex
      if (list.length > 0) {
        console.log('found')
        for (let i = 0; i < list.length; i++) {
          console.log(list[i].firstChild.textContent)
          if (location.href.indexOf(list[i].firstChild.textContent) > -1) {
            test = true
            listIndex = i
          }
        }
      }
      if ( test ) {
        console.log('added-index ' + listIndex)
        if (this.selectedMenuItem === listIndex) {
          this.selectedMenuItem = null
        } else this.selectedMenuItem = listIndex

        //menu not shown automatically
      }
    }, 500)



    //this works but not dynamic
    // if (location.href.indexOf('atoms') > -1) {
    //     this.menuCategory(0)
    // }
    // else if (location.href.indexOf('molecules') > -1) {
    //   this.menuCategory(1)
    // } else if (location.href.indexOf('organisms') > -1) {
    //   this.menuCategory(2)
    // } else if (location.href.indexOf('pages') > -1) {
    //   this.menuCategory(3)
    // }



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

    .router-link-active {
      color: black;
      text-decoration: underline;
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
}

.menu-element .menu-element{
  padding-left: 20px;
}
</style>

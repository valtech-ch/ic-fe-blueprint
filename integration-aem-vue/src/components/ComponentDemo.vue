<template>
  <div class="page-wrapper">
    <component :is="component" />
  </div>
</template>

<script>
export default {
  name: 'ComponentDemo',

  data () {
    return {
      component: null
    }
  },

  methods: {
    updateRoute () {
      const componentName = this.$route.params.page[0].toUpperCase() + this.$route.params.page.slice(1)
      this.component = componentName
    }
  },

  watch: {
    $route () {
      this.updateRoute()
    }
  },

  mounted () {
    this.updateRoute()
  }
}
</script>

<style lang="scss" scoped>
  .is-fullscreen-demo .page-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #fff;
  }
</style>


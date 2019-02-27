<template>
  <component :is="component" />
</template>

<script>
export default {
  name: 'ComponentDemo',

  data () {
    return {
      component: null
    }
  },

  mounted () {
    const componentName = this.$route.params.page[0].toUpperCase() + this.$route.params.page.slice(1)
    this.component = () => import(`@/../ic-components/pages/${componentName}.vue`)
  }
}
</script>

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
    console.log(this.$fePages)
    const componentName = this.$route.params.page[0].toUpperCase() + this.$route.params.page.slice(1)
    this.component = () => import(`${this.$fePages}/${componentName}.vue`)
  }
}
</script>

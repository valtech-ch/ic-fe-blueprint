<template>
  <div class="heading">
    <h1 class="heading__title">{{title}}</h1>
  </div>
</template>

<script>
import Vue from 'vue'

export default new Vue({
    el: document.querySelector('heading'),
    
    name: 'Heading',

    render: function (createElement) {
      return createElement(
        'h1',   // tag name
        this.$slots.default // array of children
      )
  },
})
</script>

<style lang="scss" scoped>

</style>
<template>
  <div>
    <heading :title="title" />

    <p>This is a seperate Vue-Component that can contain whatever</p>
  </div>
</template>

<script>
import Heading from '@/../ic-components/components/atoms/text/vue/Heading'

export default {
  name: 'Demo',

  components: {
    Heading
  },

  data () {
    return {
      title: 'This is the Demo-title'
    }
  }
}
</script>

<style scoped>

</style>
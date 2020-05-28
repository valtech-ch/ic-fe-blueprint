<template>
  <div>
    <Icon name="account" />

    <p>This is a seperate Vue-Component that can contain whatever</p>
  </div>
</template>

<script>
import Icon from '@components/atoms/icon/Icon'

export default {
  name: 'Demo',

  components: {
    Icon
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

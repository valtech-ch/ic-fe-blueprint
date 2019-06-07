<template>
  <h1>{{ title }}</h1>
</template>

<script>
export default {
  name: 'heading',

  props: {
    title: String
  }
}
</script>

<style scoped>
  h1 {
    font-size: 2rem;
    font-weight: bold;
  }
</style>

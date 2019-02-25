<template>
  <div class="component-overview">

    <nav class="panel">
      <p class="panel-heading">
        Components
      </p>
      <div class="panel-block">
        <p class="control has-icons-left">
          <input
            class="input is-small"
            type="search"
            placeholder="Filter..."
            v-model="filter">
        </p>
      </div>

      <router-link
        v-for="component in components"
        :to="`/${$route.params.type}/${$route.params.component}/${component}/view/default`"
        :key="component"
        class="panel-block">
        {{ component }}
      </router-link>
    </nav>

  </div>
</template>

<script>
export default {
  name: 'ComponentOverview',

  props: {
    data: Object
  },

  data () {
    return {
      filter: null
    }
  },

  computed: {
    components () {
      let data = this.data[this.$route.params.component]

      if (this.filter) {
        data = data.filter(item => {
          return item.includes(this.filter)
        })
      }

      return data
    }
  }
}
</script>

<style scoped>
  .component-overview {
    padding: 20px 0;
  }

  .panel-block {
    text-transform: capitalize;
  }
</style>

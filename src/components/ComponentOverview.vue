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
        :to="`/${$route.params.type}/${$route.params.component}/${component.title}/view/default`"
        :key="component.title"
        class="panel-block">
        {{ component.title }}
      </router-link>
    </nav>

  </div>
</template>

<script>
export default {
  name: 'ComponentOverview',

  props: {
    selected: Object
  },

  data () {
    return {
      filter: null
    }
  },

  computed: {
    components () {
      let data = this.selected.children.filter(i => i.title === this.$route.params.component).pop().children

      if (this.filter) {
        data = data.filter(item => item.title.includes(this.filter))
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

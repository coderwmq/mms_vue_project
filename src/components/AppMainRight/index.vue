<template>
  <div class="app-main-right">
    <breadcrumb v-show="$route.path !== '/home'"/> 
    <router-view></router-view>
  </div>
</template>

<script>
import breadcrumb from './breadcrumb'
export default {
  data () {
    return {
    }
  },

  components: {
    breadcrumb
  },

  methods: {}
}
</script>


<style scoped>
</style>
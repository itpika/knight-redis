<template>
  <div class="home">
    <AppHome/>
  </div>
</template>

<script>
// @ is an alias to /src
import AppHome from '@/components/AppHome.vue'

export default {
  name: 'Home',
  components: {
    AppHome
  }
}
</script>

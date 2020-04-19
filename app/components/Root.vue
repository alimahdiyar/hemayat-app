<template>
      <Page actionBarHidden="true">
          <Frame>
            <Home v-if="isAuthenticated" />
            <Authentication v-else />
          </Frame>
      </Page>

</template>

<script>
import Home from '~/pages/Home'
import Authentication from '~/pages/Authentication'
// import Home from '~/pages/Home'
export default {
    components: {
        Home,
        Authentication
    }
}
</script>

<style lang="css">
</style>

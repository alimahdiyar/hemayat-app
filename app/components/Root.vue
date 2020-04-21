<template>
      <Page actionBarHidden="true">
          <Frame>
            <slot name="mainContent" v-if="isAuthenticated" />
            <Authentication v-else />
          </Frame>
      </Page>

</template>

<script>
import Authentication from '~/pages/Authentication'
// import Home from '~/pages/Home'
export default {
    components: {
        Authentication
    }
}
</script>

<style lang="css">
</style>

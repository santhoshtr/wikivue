<template v-if="$vuetify.breakpoint.smAndUp">
  <v-img
    contain
    :aspect-ratio="1/1"
    max-height="20px"
    position="left center"
    src="../assets//Wikipedia_wordmark.png"
  />
</template>

<script>
export default {
  name: 'Brand'
}
</script>

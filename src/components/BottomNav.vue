<template>
  <v-bottom-navigation
    v-model="bottomNav"
    grow
    app
    hide-on-scroll
    shift
    horizontal
    scroll-threshold="500"
  >
    <v-btn value="recent">
      <span>Recent</span>
      <v-icon>history</v-icon>
    </v-btn>

    <v-btn value="bookmark">
      <span>Bookmark</span>
      <v-icon>bookmark</v-icon>
    </v-btn>

    <v-btn value="nearby">
      <span>Nearby</span>
      <v-icon>place</v-icon>
    </v-btn>
    <v-btn value="share">
      <span>Share</span>
      <v-icon>share</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>


<script>
export default {
  name: 'BottomNav',
  data () {
      return {
        bottomNav: 'recent',
      }
    }
}
</script>

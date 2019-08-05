<template>
  <v-app
    id="wiki"
    light
  >
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      app
    >
      <v-img
        :aspect-ratio="1/1"
        contain
        src="./assets/Wikipedia-logo.png"
      />
      <v-list
        flat
      >
        <v-list-item-group
          color="primary"
        >
          <v-list-item
            v-for="(item, i) in items"
            :key="i"
            :to="item.href"
          >
            <v-list-item-icon>
              <v-icon v-text="item.icon" />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="item.text" />
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      elevate-on-scroll
      color="white"
      light
    >
      <v-app-bar-nav-icon @click.stop="drawer = !drawer">
        <v-img
          contain
          :aspect-ratio="4/4"
          src="./assets/Wikipedia-logo.png"
        />
      </v-app-bar-nav-icon>
      <Brand />
      <Search />
      <template v-if="$vuetify.breakpoint.smAndUp">
        <v-spacer />
        <v-btn icon>
          <v-icon>person</v-icon>
        </v-btn>
      </template>
    </v-app-bar>
    <v-content color="white">
      <router-view />
    </v-content>
    <Footer />
  </v-app>
</template>

<script>
  import Brand from './components/Brand'
  import Search from './components/Search'
  import Footer from './components/Footer'
  export default {
    components: {
      Brand,
      Search,
      Footer
    },
    data: () => ({
      drawer: false,
      items: [
        { icon: 'apps', text: 'Home', href:"/" },
        { icon: 'settings', text: 'Settings', href:"/preferences" },
        { icon: 'help', text: 'Help', href:"/about" },
      ],
    }),
  }
</script>

<style>
#wiki {
  font-family: "Gentium", Georgia, Cambria, "Times New Roman", Times, serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  text-align: left;
  font-size: 1em;
  color: rgba(0, 0, 0, 0.84);
  background-color: white;
}
* {
   text-transform: none !important;
}
</style>

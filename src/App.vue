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
      <v-toolbar-title
        style="width: 300px"
        class="ml-0 pl-4"
      >
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
        <Brand />
      </v-toolbar-title>
      <v-text-field
        v-model="$route.params.title"
        flat
        hide-details
        prepend-inner-icon="search"
        label="Search"
      />
      <v-btn icon>
        <v-icon>translate</v-icon>
      </v-btn>
      <v-spacer />
      <v-btn icon>
        <v-icon>notifications</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>person</v-icon>
      </v-btn>
    </v-app-bar>
    <v-content color="white">
      <router-view />
    </v-content>
    <Footer />
  </v-app>
</template>

<script>
  import Brand from './components/Brand'
  import Footer from './components/Footer'
  export default {
    props: {
      source: String,
    },
    components: {
      Brand,
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
  font-family: "Avenir", Helvetica, "Lato", "Manjari", Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: left;
  font-size: 1em;
  color: #2c3e50;
  background-color: white;
}
</style>

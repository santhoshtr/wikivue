<template>
  <v-app
    id="wiki"
    :lang="$store.state.app.uiLanguage"
    :dir="uiLanguageDir"
  >
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      disable-resize-watcher
      app
    >
      <v-list-item>
        <v-list-item-avatar
          width="100%"
          height="124px"
        >
          <v-img
            :aspect-ratio="1/1"
            contain
            src="@/assets/Wikipedia logo version 2.svg?lazy"
          />
        </v-list-item-avatar>
      </v-list-item>

      <v-list
        dense
        nav
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
              <v-list-item-title v-text="$i18n(item.msg)" />
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
        <v-list-item-group
          color="primary"
        >
          <app-settings />
        </v-list-item-group>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      app
      hide-on-scroll
      elevate-on-scroll
      class="pa-0"
    >
      <v-btn
        text
        rounded
        @click.stop="drawer = !drawer"
        class="px-0 mx-0"
      >
        <v-img
          :aspect-ratio="1/1"
          width="32"
          height="32"
          contain
          class="mr-2"
          src="@/assets/Wikipedia logo version 2.svg?lazy"
        />
        <brand />
      </v-btn>
      <search />
    </v-app-bar>
    <v-content>
      <router-view />
    </v-content>
    <Footer />
    <BottomNav />
  </v-app>
</template>

<script>
  import Search from './components/Search'
  import Footer from './components/Footer'
  import BottomNav from './components/BottomNav';
  import Brand from './components/Brand';
  import AppSettings from './components/Settings'
  import { mapGetters, mapState, mapMutations } from "vuex";

  export default {
    components: {
      AppSettings,
      Brand,
      Search,
      Footer,
      BottomNav
    },
    computed:{
      ...mapGetters('app',[
        'uiLanguageDir'
      ]),
    },
    data: () => ({
      drawer: false,
      items: [
        { icon: 'apps', msg: 'menu-home', href:"/" },
        { icon: 'casino', msg: 'menu-random', href:"/page/random" },
        { icon: 'place', msg: 'menu-nearby', href:"/nearby" },
        { icon: 'star', msg: 'menu-watchlist', href:"/user/watchlist" },
        { icon: 'recent_actors', msg: 'menu-contributions', href:"/user/contributions" },
        { icon: 'help', msg: 'menu-about', href:"/about" },
      ],
    }),
  }
</script>


<style lang="less">
@import url('./assets/typography.less');

#wiki {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
  text-align: left;
  font-size: 1em;
}

* {
   text-transform: none !important;
}

// Floating search bar
.v-toolbar.v-app-bar.v-app-bar--elevate-on-scroll.v-app-bar--is-scrolled {
    margin-left: 16px;
    margin-right: 16px;
    border-radius: 8px;

  .v-toolbar__content{
    padding: 0;
  }
}


</style>

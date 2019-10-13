<template>
  <v-app id="wiki" :lang="$store.state.app.uiLanguage" :dir="uiLanguageDir">
    <v-navigation-drawer
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      disable-resize-watcher
      app
    >
      <v-list-item>
        <v-list-item-avatar width="100%" height="124px">
          <v-img
            :aspect-ratio="1 / 1"
            contain
            src="@/assets/Wikipedia logo version 2.svg?lazy"
          />
        </v-list-item-avatar>
      </v-list-item>

      <v-list dense nav>
        <v-list-item-group color="primary">
          <v-list-item v-for="(item, i) in items" :key="i" :to="item.href">
            <v-list-item-icon>
              <v-icon v-text="item.icon" />
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title v-text="$i18n(item.msg)" />
            </v-list-item-content>
          </v-list-item>
        </v-list-item-group>
        <v-list-item-group color="primary">
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
      <v-btn text @click.stop="drawer = !drawer" class="px-0 mx-0">
        <v-img
          :aspect-ratio="1 / 1"
          width="32"
          height="32"
          contain
          class="mx-sm-1 mx-md-2 mx-lg-2 pa-0"
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
    <v-snackbar v-model="snackWithButtons" bottom left>
      {{ snackWithBtnText }}
      <v-spacer />
      <v-btn dark text color="green" @click.native="refreshApp">
        {{ snackBtnText }}
      </v-btn>
      <v-btn icon @click="snackWithButtons = false">
        <v-icon>mdi-close</v-icon>
      </v-btn>
    </v-snackbar>
  </v-app>
</template>

<script>
import Search from "./components/Search";
import Footer from "./components/Footer";
import BottomNav from "./components/BottomNav";
import Brand from "./components/Brand";
import AppSettings from "./components/Settings";
import { mapGetters } from "vuex";

export default {
  components: {
    AppSettings,
    Brand,
    Search,
    Footer,
    BottomNav
  },
  computed: {
    ...mapGetters("app", ["uiLanguageDir"])
  },
  data: () => ({
    drawer: false,
    items: [
      { icon: "mdi-home", msg: "menu-home", href: "/" },
      { icon: "mdi-dice-5", msg: "menu-random", href: "/page/random" },
      { icon: "mdi-compass", msg: "menu-explore", href: "/explore" },
      { icon: "mdi-map-marker-circle", msg: "menu-nearby", href: "/nearby" },
      { icon: "mdi-star", msg: "menu-watchlist", href: "/user/watchlist" },
      {
        icon: "mdi-account-check",
        msg: "menu-contributions",
        href: "/user/contributions"
      },
      { icon: "mdi-information", msg: "menu-about", href: "/about" }
    ],
    refreshing: false,
    registration: null,
    snackBtnText: "Refresh",
    snackWithBtnText: "New version available!",
    snackWithButtons: false
  }),
  created() {
    // Listen for swUpdated event and display refresh snackbar as required.
    document.addEventListener("swUpdated", this.showRefreshUI, { once: true });
    // Refresh all open app tabs when a new service worker is installed.
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (this.refreshing) return;
      this.refreshing = true;
      window.location.reload();
    });
  },
  methods: {
    showRefreshUI(e) {
      // Display a snackbar inviting the user to refresh/reload the app due
      // to an app update being available.
      // The new service worker is installed, but not yet active.
      // Store the ServiceWorkerRegistration instance for later use.
      this.registration = e.detail;
      this.snackWithButtons = true;
    },
    refreshApp() {
      this.snackWithButtons = false;
      // Protect against missing registration.waiting.
      if (!this.registration || !this.registration.waiting) {
        return;
      }
      this.registration.waiting.postMessage("skipWaiting");
    }
  }
};
</script>

<style lang="less">
@import url("./assets/typography.less");

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
.v-toolbar.v-app-bar.v-app-bar--elevate-on-scroll {
  &.v-app-bar--is-scrolled {
    margin: 16px !important;
    border-radius: 8px;

    .v-toolbar__content {
      padding: 0;
    }
  }
  &.v-app-bar--hide-shadow {
    margin-top: 0 !important;
  }
}
</style>

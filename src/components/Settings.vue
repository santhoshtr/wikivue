<template>
  <v-layout>
    <v-list-item @click.stop="dialog = true">
      <v-list-item-icon>
        <v-icon>mdi-settings-outline</v-icon>
      </v-list-item-icon>
      <v-list-item-content>
        <v-list-item-title v-i18n="msg" />
      </v-list-item-content>
    </v-list-item>

    <v-dialog
      v-model="dialog"
      max-width="600"
      transition="dialog-bottom-transition"
    >
      <v-card class="pa-5">
        <v-card-title>
          <span class="headline" v-i18n="msg" />
        </v-card-title>
        <v-card-text>
          <v-container grid-list-md text-center>
            <v-row class="pa-3">
              <v-col class="d-flex" cols="12" sm="4">
                <v-select
                  v-model="selectedTheme"
                  :items="themes"
                  label="Theme"
                  required
                  @change="selectTheme"
                />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1" />
          <v-btn large @click="dialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
export default {
  name: "AppSettings",
  data: () => ({
    dialog: false,
    msg: "menu-settings",
    selectedTheme: "light",
    themes: ["dark", "light"]
  }),
  mounted: function() {
    this.selectedTheme = this.$vuetify.theme.dark ? "dark" : "light";
  },
  methods: {
    selectTheme: function(theme) {
      if (theme === "light") {
        this.$vuetify.theme.dark = false;
      } else {
        this.$vuetify.theme.dark = true;
      }
      this.$store.commit("app/setTheme", theme);
    }
  }
};
</script>

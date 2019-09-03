<template>
  <v-layout
    justify-center
    align-center
  >
    <v-btn
      text
      @click.stop="dialog = true"
    >
      <v-icon>
        settings
      </v-icon>
      {{ $i18n('menu-settings') }}
    </v-btn>

    <v-dialog
      v-model="dialog"

      transition="dialog-bottom-transition"
    >
      <v-card class="pa-5">
        <v-card-title>
          <span class="headline">  {{ $i18n('menu-settings') }}</span>
        </v-card-title>
        <v-card-text>
          <v-container
            grid-list-md
            text-center
          >
            <v-row
              class="pa-3"
            >
              <v-col
                class="d-flex"
                cols="12"
                sm="4"
              >
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
          <v-btn
            large
            @click="dialog = false"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-layout>
</template>

<script>
import { mapGetters,mapState, mapMutations } from 'vuex';

export default {
  name: "LanguageSelector",
  data: () => ({
    dialog: false,
    selectedTheme: 'light',
    themes: ['dark', 'light']
  }),
  mounted: function(){
      this.selectedTheme= this.$vuetify.theme.dark?'dark':'light';
  },
  methods: {
    selectTheme: function(theme) {
      if(theme==='light'){
        this.$vuetify.theme.dark=false
      }else{
        this.$vuetify.theme.dark=true
      }
       this.$store.commit('app/theme',theme)
    }
  }
};
</script>

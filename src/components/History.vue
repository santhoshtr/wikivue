<template>
  <v-dialog
    v-model="dialog"
    fullscreen
    transition="dialog-bottom-transition"
  >
    <template v-slot:activator="{ on }">
      <v-btn
        value="languages"
        v-on="on"
      >
        <v-icon>history</v-icon>
      </v-btn>
    </template>
    <v-card>
      <v-container grid-list-md>
        <v-toolbar flat>
          <v-toolbar-title>History</v-toolbar-title>
          <v-toolbar-items>
            <v-btn
              icon
              @click="dialog = false"
            >
              <v-icon>close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-timeline dense>
          <v-timeline-item
            v-for="revision in revisions"
            :key="revision.revid"
            right
            small
          >
            <v-card class="elevation-1 pa-2">
              <v-row>
                <v-col cols="6">
                  {{ revision.user }}
                </v-col>
                <v-col cols="6">
                  {{ revision.timestamp }}
                </v-col>
              </v-row>
              <v-row>
                <v-col
                  cols="12"
                >
                  {{ revision.comment }}
                </v-col>
              </v-row>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { mapGetters, mapState, mapMutations } from "vuex";
export default {
  data: () => ({
    dialog: false
  }),
  computed: {
    ...mapState({
      revisions: state => state.article.history.revisions
    })
  }
};
</script>
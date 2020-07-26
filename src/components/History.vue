<template>
  <v-dialog v-model="dialog" fullscreen transition="dialog-bottom-transition">
    <template v-slot:activator="{ on }">
      <v-btn text value="languages" v-on="on">
        <v-icon>{{ mdiHistory }}</v-icon>
      </v-btn>
    </template>
    <v-card v-if="article">
      <v-container grid-list-md>
        <v-toolbar flat>
          <v-btn icon @click="dialog = false">
            <v-icon>{{ mdiArrowLeft }}</v-icon>
          </v-btn>
          <v-toolbar-title v-i18n="'article-history-title'" />
          <div class="flex-grow-1" />
          <v-toolbar-items>
            <v-btn icon @click="dialog = false">
              <v-icon>{{ mdiClose }}</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>
        <v-timeline dense>
          <v-timeline-item
            v-for="revision in article.revisions"
            :key="revision.revid"
            right
            small
          >
            <v-card>
              <v-card-title>{{ revision.user }}</v-card-title>
              <v-card-text>{{ revision.comment }}</v-card-text>
              <v-card-actions>
                <v-btn
                  :to="
                    `/page/${article.language}/${article.title}?oldid=${article.revision}`
                  "
                  @click="dialog = false"
                  text
                  >{{ localTime(revision.timestamp) }}</v-btn
                >
              </v-card-actions>
            </v-card>
          </v-timeline-item>
        </v-timeline>
      </v-container>
    </v-card>
  </v-dialog>
</template>

<script>
import { mdiClose, mdiArrowLeft, mdiHistory } from "@mdi/js";
import Article from "../wiki/models/article";

export default {
  data: () => ({
    dialog: false,
    mdiClose,
    mdiArrowLeft,
    mdiHistory
  }),
  props: {
    article: {
      type: Article
    }
  },
  methods: {
    localTime(timestamp) {
      return new Date(timestamp).toLocaleString();
    }
  }
};
</script>

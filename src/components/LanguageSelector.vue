<template>
  <v-select
    v-model="i18n.locale"
    :items="locales"
    item-text="autonym"
    item-value="code"
    label="Language"
    prepend-icon="translate"
    @change="onChange"
  />
</template>

<script>
export default {
  name: 'LanguageSelector',
  data: () => ({
    locales: [
      { code: 'en', autonym: 'English' },
      { code: 'ml', autonym: 'മലയാളം' }
    ]
  }),
  methods: {
    onChange: function (locale) {
      this.$emit('changeLocale', locale)
      this.i18n.locale = locale
    }
  }
}
</script>

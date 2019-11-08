This is a [Vuejs](https://vuejs.org) powered modern, single page, progressive, offline capable web application for Wikipedia. Code named as Wikivue(pronounced /wɪkɪ vjuː/, like wiki-view).

**Try**: [wikipedia.thottingal.in](https://wikipedia.thottingal.in)

## Features

* Fully client side application using wikipedia web apis.
* [Progressive web application(PWA)](https://en.wikipedia.org/wiki/Progressive_web_applications). This application is installable in desktops and mobiles and use like a native application. It can also be used directly from a browser.
* Offline support - With the help of service workers, the application even works when there is no internet, provided, the content is previously viewed.
* [Single page application](https://en.wikipedia.org/wiki/Single-page_application) - page does not reload when exploing wiki articles, presenting an immersed reading experience.
* Uses modern UI framwork [Vuetify](https://vuetifyjs.com).  Adapts to all kind of screen sizes
* Presents an optimized reading experience with good typography and optimum page layout
* Multilingual by default - All language editions are in single app. Using language selector user can select the language edition.
* Minimal network usage.

## Why

The user interface of Wikipedia evolved [very slowly](https://www.versionmuseum.com/history-of/wikipedia-website). While the web technology
moved very fast and a new generation of users started their digital life in it, the current interface of Wikipedia is not pleasent or attractive.

This project attempts to build a modern fresh interface using latest web technologies, using some design principles suitable for such a content heavy website.
This web application is built just using Wikipedia's public APIs. It does not attempt to have every feature the Wikipedia acquired over the several years, instead it just focus on basic usecases.

Once done, it should also be a proof that applications with varying complexities and design principles are possible on top of Wikipedia APIs.

Personal goal: As a Wikimedia Foundation engineer, have a modern system that allows me to quickly develop and tryout various concepts.

## Wishlist

* Develop a modular renderless WYSIWYG editor for Wikitext. Currently an editor based on ProseMirror is being attempted.
* Define a modular data store and versioned Article content format so that a structured wikipedia article content can live in a distributed p2p web.
* Make this reader application hostable with static web servers-This is done.

## Thanks

* [Vue](https://vuejs.org/) - The progressive javascript framework.
* [Vuetify](https://vuejs.org) - UI framwork based on Vue.
* [Vuex](https://vuex.vuejs.org/) - state management pattern + library for Vue.js applications.
* [Vue Router](https://router.vuejs.org/) - Router for Single Page Applications.
* [Vue-Banana-i18n](https://github.com/santhoshtr/vue-banana-i18n) - The [Banana i18n](https://github.com/wikimedia/banana-**i18n**) system(Wikipedia localization) vue bindings.
* [banana-i18n-loader](https://github.com/santhoshtr/banana-i18n-loader) - Webpack loader for Banana i18n sytem
* [TipTap](https://tiptap.scrumpy.io/) - WYSIWYG editor based on [ProseMirror](https://prosemirror.net/)
* [Material Design Icons](https://materialdesignicons.com/)
* [Webpack](https://webpack.js.org/)

## Code

### Development mode

Clone the repo,

```lang=bash
npm install
npm run serve
```

Open browser at the URL given in the output. Source code changes will be automatically applied.

### Build for production

```lang=bash
npm install
npm run build
```

And place the dist folder under any static web servers.

## Authors

* [Santhosh Thottingal](https://thottingal.in)

## Note

This is NOT an official Wikimedia Foundation project. Wikipedia, Wikimedia are all trademark of [Wikimedia Foundation](https://www.wikimediafoundation.org/). Wikipedia content is licensed under  the [Creative Commons Attribution-ShareAlike License](https://en.wikipedia.org/wiki/Wikipedia:Text_of_Creative_Commons_Attribution-ShareAlike_3.0_Unported_License).

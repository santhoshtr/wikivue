export default {
  parse(section, contentLanguage, expanded) {
    const wrapper = document.createElement("div");
    wrapper.innerHTML = section;

    const links = wrapper.querySelectorAll("a[href]");
    for (let l = 0; l < links.length; l++) {
      let link = links[l];
      for (let i = 0; i < link.attributes.length; i++) {
        let attribute = link.attributes[i];
        if (attribute.name === "href") {
          link.setAttribute(
            attribute.name,
            attribute.value.replace("/wiki/", `/page/${contentLanguage}/`)
          );
          continue;
        }
        link.setAttribute(attribute.name, attribute.value);
      }
    }

    const aside = document.createElement("aside");

    if (!expanded) {
      const hatnotes = wrapper.querySelectorAll("div.hatnote");
      const amboxes = wrapper.querySelectorAll(".ambox");
      const infobox = wrapper.querySelectorAll(".infobox");
      const rightSideImages = wrapper.querySelectorAll(
        "figure.mw-halign-right"
      );
      const leftSideImages = wrapper.querySelectorAll("figure.mw-halign-left");
      const smallFigures = wrapper.querySelectorAll("figure.mw-default-size");
      const rightTables = wrapper.querySelectorAll("table[align='right']");
      const navboxes = [
        ...wrapper.querySelectorAll("table.vertical-navbox"),
        ...wrapper.querySelectorAll("div.navbox")
      ];

      const sideItems = [
        ...hatnotes,
        ...infobox,
        ...amboxes,
        ...rightSideImages,
        ...leftSideImages,
        ...smallFigures,
        ...rightTables
      ];

      // Remove navboxes - They are looong tables.
      for (let i = 0; i < navboxes.length; i++) {
        navboxes[i].remove();
      }

      for (let i = 0; i < sideItems.length; i++) {
        if (sideItems[i].matches("table")) {
          const tableWrapper = document.createElement("div");
          tableWrapper.className += "table-wrapper";
          tableWrapper.appendChild(sideItems[i].cloneNode(true));
          aside.appendChild(tableWrapper);
        } else {
          aside.appendChild(sideItems[i].cloneNode(true));
        }
        sideItems[i].className += " hidden-md-and-up";
        if (i === 5) break; // Don't add too many items to sidebar
      }
    }
    return {
      content: wrapper.innerHTML,
      aside: aside.innerHTML
    };
  },

  // Thanks to https://dennisreimann.de/articles/delegating-html-links-to-vue-router.html
  isIgnorableLinkClick(event) {
    // ensure we use the link, in case the click has been received by a subelement
    let { target } = event;
    // handle only links that occur inside the component and do not reference external resources
    if (!target) {
      return true;
    }
    // some sanity checks taken from vue-router:
    // https://github.com/vuejs/vue-router/blob/dev/src/components/link.js#L106
    const {
      altKey,
      ctrlKey,
      metaKey,
      shiftKey,
      button,
      defaultPrevented
    } = event;
    // don't handle with control keys
    if (metaKey || altKey || ctrlKey || shiftKey) return true;
    // don't handle when preventDefault called
    if (defaultPrevented) return true;
    // don't handle right clicks
    if (button !== undefined && button !== 0) return true;
    // don't handle if `target="_blank"`
    if (target && target.getAttribute) {
      const linkTarget = target.getAttribute("target");
      if (/\b_blank\b/i.test(linkTarget)) return true;
    }
    if (!target.href) return true;
    return false;
  }
};

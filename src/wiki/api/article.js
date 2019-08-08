
import axios from "axios";

function fetchRandomArticle(language){
    const api = `//${language}.wikipedia.org/api/rest_v1/page/random/mobile-sections`;
    return axios
        .get(api)
        .then(response => process(response.data))
}

function fetchArticle(language, title) {
    if (!language) {
        throw new Error('Language is null')
    }
    if (!title) {
        return fetchRandomArticle(language)
    }
    const api = `//${language}.wikipedia.org/api/rest_v1/page/mobile-sections/${title}`;
    return axios
        .get(api)
        .then(response => process(response.data))
}

function process(articleData){
    const sections = []
    const toc = []

    const articleSections = [
        ...articleData.lead.sections,
        ...articleData.remaining.sections
    ];
    for (let i = 0; i < articleSections.length; i++) {
        const section = articleSections[i];
        if (section.text) {
            const heading = section.line
                ? `<h${section.toclevel + 1}>${section.line}</h${section.toclevel + 1}>`
                : ''
            sections.push({
                id: section.id,
                anchor: section.anchor,
                html: heading + section.text
            });
            continue;
        }
        if (section.toclevel === 1) {
            toc.push({
                id: section.anchor,
                name: section.line,
                children: []
            });
        } else if (section.toclevel === 2) {
            toc[toc.length - 1].children.push({
                id: section.anchor,
                name: section.line
            });
        }
    }

    return {
        title: articleData.lead.normalizedtitle,
        description: articleData.lead.description,
        image: articleData.lead.image,
        issues: articleData.lead.issues,
        languagecount: articleData.lead.languagecount,
        wikidataId: articleData.lead.wikibase_item,
        history: {
            lastmodifier: articleData.lead.lastmodifier,
            lastmodified: articleData.lead.lastmodified,
            lastrevision: articleData.lead.revision,
        },
        sections: sections,
        toc:toc
    }
}

export default { fetchArticle }
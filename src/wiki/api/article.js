
import axios from "axios";

export default {
    fetchRandomArticle(language){
        const api= `//${language}.wikipedia.org/api/rest_v1/page/random/mobile-sections`;
        return axios
        .get(api)
        .then(response => response.data)
    },

    fetchArticle(language, title) {
        if (!language) {
            throw new Error('Language is null')
        }
        if(!title){
            return this.fetchRandomArticle(language)
        }
        const api = this.getApi(language, title)
        return axios
            .get(api)
            .then(response => response.data)
    },

    getApi(language, title) {
        return `//${language}.wikipedia.org/api/rest_v1/page/mobile-sections/${title}`;
    }
}
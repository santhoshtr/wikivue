import axios from "axios";

function query(sparqlQuery) {
  const endpointUrl = `https://query.wikidata.org/sparql?query=${encodeURIComponent(
    sparqlQuery
  )}`;
  const headers = { Accept: "application/sparql-results+json" };
  return axios.get(endpointUrl, { headers });
}

function fetchTopicsInCategory(category, language, count = 10) {
  const sparqlQuery = `SELECT DISTINCT ?categoryLabel ?item ?itemLabel ?itemDescription ?image
    WHERE
    {
      VALUES ?category {
        wd:${category}
      }
      ?item p:P31/ps:P31/wdt:P279* ?category. # Item is of type or subtype an item in the above list of categories
      ?article schema:about ?item ; schema:isPartOf <https://${language}.wikipedia.org/>. # Exist in ${language}
      OPTIONAL {?item wdt:P18 ?image }
      SERVICE wikibase:label {bd:serviceParam wikibase:language "${language}" .}
    }
    LIMIT ${count}`;
  return query(sparqlQuery);
}

function fetchTopicsInCategoryForTranslate(
  category,
  language,
  count = 10,
  targetLanguage
) {
  const sparqlQuery = `SELECT DISTINCT ?categoryLabel ?item ?itemLabel ?itemDescription ?image
    WHERE
    {
      VALUES ?category {
        wd:${category}
      }
      ?item wdt:P31 ?category. # Item is of type an item in the above list of categories
      ?article schema:about ?item ; schema:isPartOf <https://${language}.wikipedia.org/>. # Exist in English
      OPTIONAL {?item wdt:P18 ?image }
      FILTER NOT EXISTS { ?wen schema:about ?item ; schema:inLanguage "${targetLanguage}" } # Does not exist in ${targetLanguage}
      SERVICE wikibase:label {bd:serviceParam wikibase:language "${language}" .}
    }
    LIMIT ${count}`;
  return query(sparqlQuery);
}

export { fetchTopicsInCategory, fetchTopicsInCategoryForTranslate };

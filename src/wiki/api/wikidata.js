import axios from "axios";

function query( sparqlQuery ) {
    const endpointUrl = `https://query.wikidata.org/sparql?query=${encodeURIComponent(sparqlQuery)}`;
    const headers = { 'Accept': 'application/sparql-results+json' };
    return axios.get( endpointUrl, {      headers    } );
}


function fetchTopicsInCategory(category, language, count=10) {
    const sparqlQuery = `SELECT ?categoryLabel ?item ?itemLabel ?itemDescription ?image
    WHERE
    {
      VALUES ?category {
        wd:${category}
      }
      ?item wdt:P31 ?category. # Item is of type an item in the above list of categories
      ?item wikibase:statements ?statementcount. # Statement count - some indicator of relevance, richness?
      ?article schema:about ?item ; schema:isPartOf <https://${language}.wikipedia.org/>. # Exist in English
      OPTIONAL {?item wdt:P18 ?image }
      SERVICE wikibase:label {bd:serviceParam wikibase:language "${language}" .}
    }
    ORDER BY DESC(?statementcount)
    LIMIT ${count}`;
    return query(sparqlQuery)
}

export { fetchTopicsInCategory }
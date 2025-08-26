package com.example.imdb_backend.service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class WikidataService {

    private static final String WIKIDATA_SEARCH_URL =
            "https://www.wikidata.org/w/api.php?action=wbsearchentities&language=en&format=json&type=item&search=%s";

    private static final String WIKIDATA_ENTITY_URL =
            "https://www.wikidata.org/wiki/Special:EntityData/%s.json";

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Fetch country of origin for a movie from Wikidata
     */
    public Optional<String> getCountryOfOrigin(String title, int year) {
        try {
            // 1. Search Wikidata for the movie by title
            String searchUrl = String.format(WIKIDATA_SEARCH_URL,
                    URLEncoder.encode(title + " " + year, StandardCharsets.UTF_8));

            String searchResponse = restTemplate.getForObject(searchUrl, String.class);
            JsonNode searchJson = objectMapper.readTree(searchResponse);

            if (!searchJson.has("search") || searchJson.get("search").isEmpty()) {
                return Optional.empty();
            }

            // Take the first search result (best match)
            String entityId = searchJson.get("search").get(0).get("id").asText();

            // 2. Fetch full entity data
            String entityUrl = String.format(WIKIDATA_ENTITY_URL, entityId);
            String entityResponse = restTemplate.getForObject(entityUrl, String.class);
            JsonNode entityJson = objectMapper.readTree(entityResponse);

            // Navigate JSON → claims → P495 (country of origin)
            JsonNode claims = entityJson.at("/entities/" + entityId + "/claims/P495");

            if (claims.isMissingNode() || !claims.isArray() || claims.isEmpty()) {
                return Optional.empty();
            }

            // Get the first country reference
            String countryId = claims.get(0)
                    .get("mainsnak").get("datavalue").get("value").get("id").asText();

            // Fetch the country label
            String countryLabel = entityJson.at("/entities/" + countryId + "/labels/en/value").asText();

            return Optional.ofNullable(countryLabel);

        } catch (Exception e) {
            e.printStackTrace();
            return Optional.empty();
        }
    }
}

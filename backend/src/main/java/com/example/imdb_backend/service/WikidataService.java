package com.example.imdb_backend.service;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
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

    private final HttpHeaders headers;

    public WikidataService() {
        headers = new HttpHeaders();
        headers.set("User-Agent", "https://github.com/caviroski/imdb-ratings");
    }

    public Optional<String> getCountryOfOrigin(String title, int year) {
        try {
            // 1. Search Wikidata for the movie by title
            String searchUrl = String.format(WIKIDATA_SEARCH_URL,
                    URLEncoder.encode(title + " " + year, StandardCharsets.UTF_8));

            ResponseEntity<String> searchResponse = restTemplate.exchange(
                    searchUrl,
                    org.springframework.http.HttpMethod.GET,
                    new HttpEntity<>(headers),
                    String.class
            );

            JsonNode searchJson = objectMapper.readTree(searchResponse.getBody());

            if (!searchJson.has("search") || searchJson.get("search").isEmpty()) {
                return Optional.empty();
            }

            // Take the first search result (best match)
            String entityId = searchJson.get("search").get(0).get("id").asText();

            // 2. Fetch full entity data
            String entityUrl = String.format(WIKIDATA_ENTITY_URL, entityId);

            ResponseEntity<String> entityResponse = restTemplate.exchange(
                    entityUrl,
                    org.springframework.http.HttpMethod.GET,
                    new HttpEntity<>(headers),
                    String.class
            );

            JsonNode entityJson = objectMapper.readTree(entityResponse.getBody());

            // Navigate JSON → claims → P495 (country of origin)
            JsonNode claims = entityJson.at("/entities/" + entityId + "/claims/P495");

            if (claims.isMissingNode() || !claims.isArray() || claims.isEmpty()) {
                return Optional.empty();
            }

            // Get the first country reference (Q-ID)
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

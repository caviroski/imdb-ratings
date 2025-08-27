package com.example.imdb_backend.service;

import java.nio.charset.StandardCharsets;
import java.util.Optional;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

import java.util.Collections;

@Service
public class WikidataService {

    private static final String WIKIDATA_ENTITY_URL =
            "https://www.wikidata.org/wiki/Special:EntityData/%s.json";

    private static final String WIKIDATA_COUNTRY_PROPERTY = 
            "https://www.wikidata.org/w/api.php?action=wbgetentities&ids=%s&props=labels&languages=en&format=json";

    private final RestTemplate restTemplate = new RestTemplate();
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final HttpHeaders headers;

    public WikidataService() {
        headers = new HttpHeaders();
        headers.set("User-Agent", "MovieDatabaseApp/1.0 (https://github.com/caviroski/imdb-ratings)");
        headers.set("Accept", "application/json");
        headers.setAcceptCharset(Collections.singletonList(StandardCharsets.UTF_8));
    }

    public Optional<String> getCountryFromWeb(String title, int year) {
        try {
            String searchUrl = UriComponentsBuilder
                .fromUriString("https://www.wikidata.org/w/api.php")
                .queryParam("action", "wbsearchentities")
                .queryParam("format", "json")
                .queryParam("language", "en")
                .queryParam("search", title)
                .build()
                .toUriString();

            ResponseEntity<String> searchResponse = restTemplate.exchange(
                searchUrl,
                HttpMethod.GET,
                new HttpEntity<>(headers),
                String.class
            );

            JsonNode searchJson = objectMapper.readTree(searchResponse.getBody());

            if (!searchJson.has("search") || searchJson.get("search").isEmpty()) {
                return Optional.empty();
            }

            String entityId = "";

            int nodeIndex = 0;
            int total = searchJson.get("search").size();
            boolean found = false;
            while (nodeIndex < total) {
                JsonNode descriptionNode = searchJson.get("search").get(nodeIndex).get("description");
                String description = descriptionNode != null && !descriptionNode.isMissingNode() ? descriptionNode.asText() : null;
                if (description != null && 
                        (description.toLowerCase().contains(" film by ") ||
                         description.toLowerCase().contains(" film directed by "))
                        && description.contains(String.valueOf(year))
                    ) {
                    entityId = searchJson.get("search").get(nodeIndex).get("id").asText();
                    found = true;
                    break;
                }

                nodeIndex++;
            }

            if (!found) {
                return Optional.empty();
            }

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

            // 3. Fetch country label
            String countryUrl = String.format(WIKIDATA_COUNTRY_PROPERTY, countryId);
            ResponseEntity<String> countryResponse = restTemplate.exchange(
                    countryUrl,
                    org.springframework.http.HttpMethod.GET,
                    new HttpEntity<>(headers),
                    String.class
            );

            JsonNode countryJson = objectMapper.readTree(countryResponse.getBody());
            JsonNode countryLabelNode = countryJson.at("/entities/" + countryId + "/labels/en/value");
            String countryLabel = countryLabelNode.isMissingNode() ? null : countryLabelNode.asText();

            return Optional.ofNullable(countryLabel);

        } catch (Exception e) {
            e.printStackTrace();
            return Optional.empty();
        }
    }
}

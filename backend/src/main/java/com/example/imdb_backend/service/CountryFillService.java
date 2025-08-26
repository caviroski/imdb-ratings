package com.example.imdb_backend.service;

import com.example.imdb_backend.model.ImdbRating;
import com.example.imdb_backend.repository.ImdbRatingRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class CountryFillService {

    private final ImdbRatingRepository ratingRepository;
    private final WikidataService wikidataService;

    public CountryFillService(ImdbRatingRepository ratingRepository, WikidataService wikidataService) {
        this.ratingRepository = ratingRepository;
        this.wikidataService = wikidataService;
    }

    public void fillMissingCountries() {
        List<ImdbRating> missing = ratingRepository.findByCountryOfOriginIsNull();

        for (ImdbRating movie : missing) {
            try {
                Optional<String> countryOpt = wikidataService.getCountryOfOrigin(movie.getTitle());

                if (countryOpt.isPresent()) {
                    movie.setCountryOfOrigin(countryOpt.get());
                    // ✅ Save each movie individually (committed immediately)
                    ratingRepository.saveAndFlush(movie);
                    System.out.printf("✅ Updated %s (%d) → %s%n", movie.getTitle(), movie.getYear(), countryOpt.get());
                } else {
                    System.out.printf("⚠️ No country found for %s (%d)%n", movie.getTitle(), movie.getYear());
                }

                // ⏳ Add delay of 1 second before next request
                Thread.sleep(1000);

            } catch (Exception e) {
                System.err.printf("❌ Error updating %s (%d): %s%n",
                    movie.getTitle(), movie.getYear(), e.getMessage());
            }
        }
    }
}


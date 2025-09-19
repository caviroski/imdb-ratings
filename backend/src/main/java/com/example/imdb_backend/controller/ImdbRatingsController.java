package com.example.imdb_backend.controller;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.Map;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.stream.IntStream;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

import com.example.imdb_backend.model.ImdbRating;
import com.example.imdb_backend.repository.ImdbRatingRepository;
import com.example.imdb_backend.service.ImdbCsvImporter;
import com.example.imdb_backend.dto.ComparisonDTO;
import com.example.imdb_backend.service.CountryFillService;

@RestController
@RequestMapping("/api/imdb-ratings")
@CrossOrigin(origins = "http://localhost:3000")
public class ImdbRatingsController {

    @Autowired
    private ImdbCsvImporter imdbCsvImporter;

    @Autowired
    private ImdbRatingRepository imdbRatingRepository;

    @Autowired
    private CountryFillService countryFillService;

    @PostMapping
    public ResponseEntity<String> postExample(@RequestBody Map<String, Object> payload) {
        String name = (String) payload.get("name");
        return ResponseEntity.ok("Received name: " + name);
    }

    @PostMapping("/upload")
    public ResponseEntity<String> uploadFile(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("No file uploaded");
        }

        String originalFilename = file.getOriginalFilename();
        System.out.println("Uploaded file: " + originalFilename);

        String result = imdbCsvImporter.importCsv(file);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/file-names")
    public ResponseEntity<List<String>> getAllFileNames() {
        List<ImdbRating> allRatings = imdbRatingRepository.findAll();
        Set<String> uniqueFileNames = new HashSet<>();

        for (ImdbRating rating : allRatings) {
            if (rating.getContains() != null) {
                uniqueFileNames.addAll(rating.getContains());
            }
        }

        List<String> sortedList = new ArrayList<>(uniqueFileNames);
        Collections.sort(sortedList);

        return ResponseEntity.ok(sortedList);
    }

    @PostMapping("/fill-missing-countries")
    public ResponseEntity<String> fillMissingCountries() {
        countryFillService.fillMissingCountries();
        return ResponseEntity.ok("Batch update finished.");
    }

    @PostMapping("/stop-filling-missing-countries")
    public ResponseEntity<String> stopFill() {
        countryFillService.requestStop();
        return ResponseEntity.ok("Stop requested.");
    }

    @GetMapping("/compare")
    public ResponseEntity<List<ComparisonDTO>> compareVotes(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam(required = false) String search) {

        List<ImdbRating> allRatings = imdbRatingRepository.findAll();
        List<ComparisonDTO> result = new ArrayList<>();
        int idCounter = 1;

        for (ImdbRating rating : allRatings) {
            boolean matchesSearch = true;

            if (search != null && !search.isBlank()) {
                String lowerSearch = search.toLowerCase();
                matchesSearch =
                    (rating.getTitle() != null && rating.getTitle().toLowerCase().contains(lowerSearch)) ||
                    (rating.getOriginalTitle() != null && rating.getOriginalTitle().toLowerCase().contains(lowerSearch)) ||
                    (rating.getImdbConst() != null && rating.getImdbConst().toLowerCase().contains(lowerSearch)) ||
                    (rating.getTitleType() != null && rating.getTitleType().toLowerCase().contains(lowerSearch)) ||
                    (rating.getDirectors() != null && rating.getDirectors().toLowerCase().contains(lowerSearch)) ||
                    (rating.getGenres() != null && rating.getGenres().toLowerCase().contains(lowerSearch));
            }

            if (matchesSearch && rating.getNumVotes().containsKey(from) && rating.getNumVotes().containsKey(to)) {
                Integer fromVotes = rating.getNumVotes().get(from);
                Integer toVotes = rating.getNumVotes().get(to);
                int difference = toVotes - fromVotes;

                ComparisonDTO dto = new ComparisonDTO();
                dto.setId(idCounter++);
                dto.setDateRated(rating.getDateRated());
                dto.setName(rating.getOriginalTitle() + " (" + rating.getYear() + ")");
                dto.setFirstDate(fromVotes);
                dto.setSecondDate(toVotes);
                dto.setDifference(difference);
                dto.setLink(rating.getUrl());

                result.add(dto);
            }
        }

        // Only return the last 100 rows, preserving original order
        // int fromIndex = Math.max(result.size() - 200, 0);
        // List<ComparisonDTO> last100 = result.subList(fromIndex, result.size());

        // return ResponseEntity.ok(last100);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/year-count")
    public ResponseEntity<?> getYearCount(@RequestParam(required = false) String fromDate) {
        List<Object[]> results;
        
        try {
            String effectiveDate = (fromDate != null && !fromDate.isEmpty())
                    ? fromDate
                    : LocalDate.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy"));

            results = imdbRatingRepository.findYearCountsFromDate(effectiveDate);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid date format. Expected dd.MM.yyyy");
        }

        Map<Integer, Long> countsMap = results.stream()
            .collect(Collectors.toMap(
                row -> (Integer) row[0],
                row -> ((Number) row[1]).longValue()
            ));

        List<Map<String, Object>> mapped = IntStream.rangeClosed(1874, 2025)
            .mapToObj(year -> {
                Map<String, Object> m = new HashMap<>();
                m.put("year", year);
                m.put("itemsNum", countsMap.getOrDefault(year, 0L));
                return m;
            }).toList();

        long totalItems = mapped.stream()
            .mapToLong(m -> (Long) m.get("itemsNum"))
            .sum();

        Map<String, Object> response = new HashMap<>();
        response.put("totalItems", totalItems);
        response.put("years", mapped);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/yearly-average")
    public ResponseEntity<?> getYearlyAverage(@RequestParam(required = false) String cutoffDate) {
        List<Object[]> results;

        if (cutoffDate == null || cutoffDate.isEmpty()) {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("dd.MM.yyyy");
            cutoffDate = LocalDate.now().format(formatter);
        }

        try {
            results = imdbRatingRepository.findYearAverageUntil(cutoffDate);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid date format. Expected dd.MM.yyyy");
        }

        List<Map<String, Object>> mapped = results.stream()
            .map(row -> {
                Map<String, Object> m = new HashMap<>();
                Integer year = ((Number) row[0]).intValue();
                Long itemsNum = ((Number) row[1]).longValue();
                Double avgRating = row[2] != null ? ((Number) row[2]).doubleValue() : 0.0;

                String avgRatingStr = String.format(Locale.US, "%.2f", avgRating);

                m.put("id", year);
                m.put("year", year);
                m.put("itemsNum", itemsNum);
                m.put("avgRating", avgRatingStr);
                return m;
            }).filter(m -> (Long) m.get("itemsNum") > 0).toList();

        return ResponseEntity.ok(mapped);
    }

    @GetMapping("/title-type-count")
    public ResponseEntity<?> getTitleTypeCount(@RequestParam(required = false) String fromDate) {
        List<Object[]> results;

        try {
            String effectiveDate = (fromDate != null && !fromDate.isEmpty())
                    ? fromDate
                    : LocalDate.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy"));

            results = imdbRatingRepository.findTitleTypeCountsFromDate(effectiveDate);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid date format. Expected dd.MM.yyyy");
        }

        List<Map<String, Object>> mapped = results.stream()
                .map(row -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("id", (String) row[0]);
                    m.put("titleType", (String) row[0]);
                    m.put("count", ((Number) row[1]).longValue());
                    return m;
                }).toList();

        return ResponseEntity.ok(mapped);
    }

    @GetMapping("/genre-stats")
    public ResponseEntity<?> getGenreStats(@RequestParam(required = false) String cutoffDate) {
        try {
            String effectiveDate = (cutoffDate != null && !cutoffDate.isEmpty())
                    ? cutoffDate
                    : LocalDate.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy"));

            List<Object[]> results = imdbRatingRepository.findGenreStatsUntil(effectiveDate);

            List<Map<String, Object>> mapped = results.stream()
                .map(row -> {
                    Map<String, Object> m = new HashMap<>();
                    String genre = (String) row[0];
                    Long total = ((Number) row[1]).longValue();
                    Double avgRating = row[2] != null ? ((Number) row[2]).doubleValue() : 0.0;

                    // Force 2 decimals with dot
                    avgRating = Math.round(avgRating * 100.0) / 100.0;

                    m.put("id", genre);
                    m.put("genre", genre);
                    m.put("count", total);
                    m.put("avgRating", avgRating);
                    return m;
                }).filter(m -> (Long) m.get("count") > 0)
                  .toList();

            return ResponseEntity.ok(mapped);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid date format. Expected dd.MM.yyyy");
        }
    }

    @GetMapping("/ratings-by-date")
    public ResponseEntity<?> getRatingsByDate(@RequestParam(required = false) String date) {
        try {
            String effectiveDate = (date != null && !date.isEmpty())
                    ? date
                    : LocalDate.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy"));

            List<Object[]> results = imdbRatingRepository.findRatingsByDate(effectiveDate);

            List<Map<String, Object>> mapped = results.stream().map(row -> {
                Map<String, Object> m = new HashMap<>();
                m.put("id", row[0]);
                m.put("const", row[0]);
                m.put("title", row[1]);
                m.put("originalTitle", row[2]);
                m.put("url", row[3]);
                m.put("titleType", row[4]);
                m.put("imdbRating", row[5]);
                m.put("runtime", row[6]);
                m.put("year", row[7]);
                m.put("yourRating", row[8]);
                m.put("dateRated", row[9]);
                m.put("genres", row[10]);
                m.put("numVotes", row[11]);
                m.put("releaseDate", row[12]);
                m.put("directors", row[13]);
                return m;
            }).toList();

            return ResponseEntity.ok(mapped);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Invalid date format. Expected dd.MM.yyyy");
        }
    }

    @GetMapping("/country-counts")
    public ResponseEntity<?> getCountryCounts() {
        List<Object[]> results = imdbRatingRepository.findMovieCountsByCountry();

        List<Map<String, Object>> mapped = results.stream()
            .map(row -> {
                Map<String, Object> m = new HashMap<>();
                m.put("country", (String) row[0]);
                m.put("count", ((Number) row[1]).intValue());
                return m;
            }).toList();

        return ResponseEntity.ok(mapped);
    }

    @DeleteMapping("/delete-by-file/{fileName}")
    public ResponseEntity<String> removeFileData(@PathVariable String fileName) {
        List<ImdbRating> affected = imdbRatingRepository.findByContainsContaining(fileName);

        if (affected.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No entries found containing file: " + fileName);
        }

        int updatedCount = 0;

        for (ImdbRating rating : affected) {
            boolean modified = false;

            // Remove file name from contains list
            if (rating.getContains() != null && rating.getContains().remove(fileName)) {
                modified = true;
            }

            // Remove entry from numVotes map
            if (rating.getNumVotes() != null && rating.getNumVotes().remove(fileName) != null) {
                modified = true;
            }

            // Remove entry from imdbRatings map
            if (rating.getImdbRatings() != null && rating.getImdbRatings().remove(fileName) != null) {
                modified = true;
            }

            if (modified) {
                imdbRatingRepository.save(rating);
                updatedCount++;
            }
        }

        return ResponseEntity.ok("Cleaned file data from " + updatedCount + " entries for file: " + fileName);
    }
}

package com.example.imdb_backend.service;

import java.io.InputStreamReader;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.opencsv.CSVReader;

import com.example.imdb_backend.model.ImdbRating;
import com.example.imdb_backend.repository.ImdbRatingRepository;

@Service
public class ImdbCsvImporter {

    @Autowired
    private ImdbRatingRepository imdbRatingRepository;

    public String importCsv(MultipartFile file) {
        String filename = file.getOriginalFilename();
        if (filename == null || !filename.endsWith(".csv")) {
            return "Invalid file name.";
        }

        String fileDate = filename.replace(".csv", "").trim();

        try (CSVReader reader = new CSVReader(new InputStreamReader(file.getInputStream()))) {
            reader.readNext();

            String[] line;
            int importedCount = 0;

            while ((line = reader.readNext()) != null) {
                if (line.length < 14) continue;

                String imdbConst = line[0];
                int votes = parseInt(line[11]);
                
                double rating = 0.0;
                if (line[7] != null && !line[7].isEmpty() && !line[7].equalsIgnoreCase("null")) {
                    rating = Double.parseDouble(line[7]);
                }
                final String[] currentLine = line;

                ImdbRating ratingEntity = imdbRatingRepository.findByImdbConst(imdbConst);
                if (ratingEntity == null) {
                    ratingEntity = new ImdbRating();
                    ratingEntity.setImdbConst(imdbConst);
                    ratingEntity.setTitle(currentLine[3]);
                    ratingEntity.setYourRating(parseInt(currentLine[1]));
                    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
                    ratingEntity.setDateRated(LocalDate.parse(currentLine[2], formatter));
                    ratingEntity.setOriginalTitle(currentLine[4]);
                    ratingEntity.setUrl(currentLine[5]);
                    ratingEntity.setTitleType(currentLine[6]);
                    ratingEntity.setRuntimeMinutes(parseInt(currentLine[8]));
                    ratingEntity.setYear(parseInt(currentLine[9]));
                    ratingEntity.setGenres(currentLine[10]);
                    ratingEntity.setReleaseDate(currentLine[12]);
                    ratingEntity.setDirectors(currentLine[13]);
                }

                // Add fileDate to contains list if not already
                if (!ratingEntity.getContains().contains(fileDate)) {
                    ratingEntity.getContains().add(fileDate);
                }

                // Update numVotes and imdbRating maps
                ratingEntity.getNumVotes().put(fileDate, votes);
                ratingEntity.getImdbRatings().put(fileDate, rating);

                imdbRatingRepository.save(ratingEntity);
                importedCount++;
            }

            return "Successfully imported " + importedCount + " records from " + filename;

        } catch (Exception e) {
            e.printStackTrace();
            return "Error importing CSV: " + e.getMessage();
        }
    }

    private Integer parseInt(String val) {
        try {
            return Integer.parseInt(val);
        } catch (Exception e) {
            return null;
        }
    }
    
}

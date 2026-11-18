package com.example.imdb_backend.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.nio.charset.StandardCharsets;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;

import com.example.imdb_backend.model.ImdbRating;
import com.example.imdb_backend.repository.ImdbRatingRepository;

@ExtendWith(MockitoExtension.class)
class ImdbCsvImporterTest {

    @Mock
    private ImdbRatingRepository imdbRatingRepository;

    @InjectMocks
    private ImdbCsvImporter importer;

    @Test
    void importCsvPreservesUtf8Titles() {
        String csv = """
                Const,Your Rating,Date Rated,Title,Original Title,URL,Title Type,IMDb Rating,Runtime,Year,Genres,Num Votes,Release Date,Directors
                tt1234567,8,2025-01-02,Lancôme,Lancôme,https://www.imdb.com/title/tt1234567/,movie,7.5,90,2024,Drama,100,2024-01-01,Director
                """;
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "01.02.2025.csv",
                "text/csv",
                csv.getBytes(StandardCharsets.UTF_8));
        when(imdbRatingRepository.findByImdbConst("tt1234567")).thenReturn(null);

        importer.importCsv(file);

        ArgumentCaptor<ImdbRating> ratingCaptor = ArgumentCaptor.forClass(ImdbRating.class);
        verify(imdbRatingRepository).save(ratingCaptor.capture());
        assertEquals("Lancôme", ratingCaptor.getValue().getTitle());
        assertEquals("Lancôme", ratingCaptor.getValue().getOriginalTitle());
    }

    @Test
    void reimportCorrectsPreviouslyMojibakedTitles() {
        String csv = """
                Const,Your Rating,Date Rated,Title,Original Title,URL,Title Type,IMDb Rating,Runtime,Year,Genres,Num Votes,Release Date,Directors
                tt1234567,8,2025-01-02,Lancôme,Lancôme,https://www.imdb.com/title/tt1234567/,movie,7.5,90,2024,Drama,100,2024-01-01,Director
                """;
        MockMultipartFile file = new MockMultipartFile(
                "file",
                "01.02.2025.csv",
                "text/csv",
                csv.getBytes(StandardCharsets.UTF_8));
        ImdbRating existingRating = new ImdbRating();
        existingRating.setImdbConst("tt1234567");
        existingRating.setTitle("LancÃ´me");
        existingRating.setOriginalTitle("LancÃ´me");
        when(imdbRatingRepository.findByImdbConst("tt1234567")).thenReturn(existingRating);

        importer.importCsv(file);

        assertEquals("Lancôme", existingRating.getTitle());
        assertEquals("Lancôme", existingRating.getOriginalTitle());
        verify(imdbRatingRepository).save(existingRating);
    }
}

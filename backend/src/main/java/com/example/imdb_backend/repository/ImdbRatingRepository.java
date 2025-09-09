package com.example.imdb_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.example.imdb_backend.model.ImdbRating;

@Repository
public interface ImdbRatingRepository extends JpaRepository<ImdbRating, Integer> {
    ImdbRating findByImdbConst(String imdbConst);

    List<ImdbRating> findByContainsContaining(String fileName);

    List<ImdbRating> findByCountryOfOriginIsNull();

    @Query("SELECT r.year, COUNT(r) " +
        "FROM ImdbRating r JOIN r.contains c " +
        "WHERE c LIKE %:fromDate% " +
        "GROUP BY r.year " +
        "ORDER BY r.year")
    List<Object[]> findYearCountsFromDate(@Param("fromDate") String fromDate);

    @Query(value = """
        SELECT year, COUNT(id) AS movie_count, AVG(your_rating) AS avg_rating
        FROM imdb_ratings
        WHERE date_rated <= STR_TO_DATE(:cutoffDate, '%d.%m.%Y')
        GROUP BY year
        ORDER BY year
        """, nativeQuery = true)
    List<Object[]> findYearAverageUntil(@Param("cutoffDate") String cutoffDate);

    @Query(value = """
        SELECT title_type, COUNT(*) 
        FROM imdb_ratings
        WHERE date_rated <= STR_TO_DATE(:fromDate, '%d.%m.%Y')
        GROUP BY title_type
        """, nativeQuery = true)
    List<Object[]> findTitleTypeCountsFromDate(@Param("fromDate") String fromDate);

    @Query(value = """
       SELECT 
            TRIM(SUBSTRING_INDEX(genres, ',', 1)) AS main_genre,
            COUNT(id) AS total,
            AVG(your_rating) AS avg_rating
        FROM imdb_ratings
        WHERE date_rated <= STR_TO_DATE(:cutoffDate, '%d.%m.%Y')
        GROUP BY main_genre
        ORDER BY total DESC
        """, nativeQuery = true)
    List<Object[]> findGenreStatsUntil(@Param("cutoffDate") String cutoffDate);

    @Query(value = """
        SELECT r.imdb_const,
            r.title,
            r.original_title,
            r.url,
            r.title_type,
            rm.imdb_rating,
            r.runtime_minutes,
            r.year,
            r.your_rating,
            r.date_rated,
            r.genres,
            nv.num_votes,
            r.release_date,
            r.directors
        FROM imdb_ratings r
        JOIN imdb_ratings_map rm ON r.id = rm.imdb_const 
            AND rm.file_date = :date
        JOIN imdb_num_votes nv ON r.id = nv.imdb_const 
            AND nv.file_date = rm.file_date
        """, nativeQuery = true)
    List<Object[]> findRatingsByDate(@Param("date") String date);
}

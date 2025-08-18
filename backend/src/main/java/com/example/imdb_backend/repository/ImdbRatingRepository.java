package com.example.imdb_backend.repository;

import com.example.imdb_backend.model.ImdbRating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImdbRatingRepository extends JpaRepository<ImdbRating, Integer> {
    ImdbRating findByImdbConst(String imdbConst);

    List<ImdbRating> findByContainsContaining(String fileName);

    @Query("SELECT r.year, COUNT(r) " +
        "FROM ImdbRating r " +
        "GROUP BY r.year " +
        "ORDER BY r.year")
    List<Object[]> findYearCounts();

    @Query("SELECT r.year, COUNT(r) " +
        "FROM ImdbRating r JOIN r.contains c " +
        "WHERE c LIKE %:fromDate% " +
        "GROUP BY r.year " +
        "ORDER BY r.year")
    List<Object[]> findYearCountsFromDate(@Param("fromDate") String fromDate);

    @Query(value = """
        SELECT year, COUNT(id) AS movie_count, AVG(your_rating) AS avg_rating
        FROM imdb_ratings
        GROUP BY year
        ORDER BY year
        """, nativeQuery = true)
    List<Object[]> findYearAverage();

    @Query(value = """
        SELECT year, COUNT(id) AS movie_count, AVG(your_rating) AS avg_rating
        FROM imdb_ratings
        WHERE date_rated <= STR_TO_DATE('01.07.2025', '%d.%m.%Y')
        GROUP BY year
        ORDER BY year
        """, nativeQuery = true)
    List<Object[]> findYearAverageUntil(@Param("cutoffDate") String cutoffDate);
}

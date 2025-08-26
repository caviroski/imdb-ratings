package com.example.imdb_backend.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.*;

@Entity
@Table(name = "imdb_ratings")
public class ImdbRating {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @Column(name = "imdb_const", unique = true)
    private String imdbConst;

    @ElementCollection
    @CollectionTable(name = "imdb_contains", joinColumns = @JoinColumn(name = "imdb_const"))
    @Column(name = "file_date")
    private List<String> contains = new ArrayList<>();

    @ElementCollection
    @CollectionTable(name = "imdb_num_votes", joinColumns = @JoinColumn(name = "imdb_const"))
    @MapKeyColumn(name = "file_date")
    @Column(name = "num_votes")
    private Map<String, Integer> numVotes = new HashMap<>();

    @ElementCollection
    @CollectionTable(name = "imdb_ratings_map", joinColumns = @JoinColumn(name = "imdb_const"))
    @MapKeyColumn(name = "file_date")
    @Column(name = "imdb_rating")
    private Map<String, Double> imdbRatings = new HashMap<>();

    @Column(name = "your_rating")
    private Integer yourRating;

    @Column(name = "date_rated")
    private LocalDate dateRated;

    @Column(name = "title")
    private String title;

    @Column(name = "original_title")
    private String originalTitle;

    @Column(name = "url", length = 500)
    private String url;

    @Column(name = "title_type")
    private String titleType;

    @Column(name = "runtime_minutes")
    private Integer runtimeMinutes;

    @Column(name = "year")
    private Integer year;

    @Column(name = "genres")
    private String genres;

    @Column(name = "release_date")
    private String releaseDate;

    @Column(name = "directors", length = 2500)
    private String directors;

    @Column(name = "country_of_origin")
    private String countryOfOrigin;

    // Getters and setters

    public int getId() {
        return id;
    }

    public List<String> getContains() {
        return contains;
    }

    public void setContains(List<String> contains) {
        this.contains = contains;
    }

    public String getImdbConst() {
        return imdbConst;
    }

    public void setImdbConst(String imdbConst) {
        this.imdbConst = imdbConst;
    }

    public Integer getYourRating() {
        return yourRating;
    }

    public void setYourRating(Integer yourRating) {
        this.yourRating = yourRating;
    }

    public LocalDate getDateRated() {
        return dateRated;
    }

    public void setDateRated(LocalDate dateRated) {
        this.dateRated = dateRated;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getOriginalTitle() {
        return originalTitle;
    }

    public void setOriginalTitle(String originalTitle) {
        this.originalTitle = originalTitle;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getTitleType() {
        return titleType;
    }

    public void setTitleType(String titleType) {
        this.titleType = titleType;
    }

    public Map<String, Double> getImdbRatings() {
        return imdbRatings;
    }

    public void setImdbRatings(Map<String, Double> imdbRatings) {
        this.imdbRatings = imdbRatings;
    }


    public Integer getRuntimeMinutes() {
        return runtimeMinutes;
    }

    public void setRuntimeMinutes(Integer runtimeMinutes) {
        this.runtimeMinutes = runtimeMinutes;
    }

    public Integer getYear() {
        return year;
    }

    public void setYear(Integer year) {
        this.year = year;
    }

    public String getGenres() {
        return genres;
    }

    public void setGenres(String genres) {
        this.genres = genres;
    }

    public Map<String, Integer> getNumVotes() {
        return numVotes;
    }

    public void setNumVotes(Map<String, Integer> numVotes) {
        this.numVotes = numVotes;
    }


    public String getReleaseDate() {
        return releaseDate;
    }

    public void setReleaseDate(String releaseDate) {
        this.releaseDate = releaseDate;
    }

    public String getDirectors() {
        return directors;
    }

    public void setDirectors(String directors) {
        this.directors = directors;
    }

    public String getCountryOfOrigin() {
        return countryOfOrigin;
    }

    public void setCountryOfOrigin(String countryOfOrigin) {
        this.countryOfOrigin = countryOfOrigin;
    }
}

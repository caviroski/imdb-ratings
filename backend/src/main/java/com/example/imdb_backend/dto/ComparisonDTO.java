package com.example.imdb_backend.dto;

import java.time.LocalDate;

public class ComparisonDTO {
    private int id;
    private LocalDate dateRatd;
    private String name;
    private int firstDate;
    private int secondDate;
    private int difference;

    // Getters and setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public LocalDate getDateRatd() { return dateRatd; }
    public void setDateRatd(LocalDate dateRatd) { this.dateRatd = dateRatd; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public int getFirstDate() { return firstDate; }
    public void setFirstDate(int firstDate) { this.firstDate = firstDate; }

    public int getSecondDate() { return secondDate; }
    public void setSecondDate(int secondDate) { this.secondDate = secondDate; }

    public int getDifference() { return difference; }
    public void setDifference(int difference) { this.difference = difference; }
}

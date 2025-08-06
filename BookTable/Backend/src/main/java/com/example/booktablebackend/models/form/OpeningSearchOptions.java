package com.example.booktablebackend.models.form;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class OpeningSearchOptions {
    private Integer numPeople;
    private LocalDateTime dateTime;
    private Long restaurantId;
    private String restaurantZipcode;
    private String restaurantCity;
    private List<Long> restaurantIds;
    private Long userId;
    private Boolean arrived;
    private Boolean checkin;
    private int page = 0;
    private int size = 10;
    private String sortBy = "dateTime";
    private String sortDirection = "asc";
}


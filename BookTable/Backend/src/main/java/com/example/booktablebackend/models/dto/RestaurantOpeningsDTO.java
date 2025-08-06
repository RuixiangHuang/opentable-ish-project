package com.example.booktablebackend.models.dto;

import com.example.booktablebackend.models.Opening.Opening;
import com.example.booktablebackend.models.Restaurant;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class RestaurantOpeningsDTO {
    private Restaurant restaurant;
    private List<Opening> openings;
}


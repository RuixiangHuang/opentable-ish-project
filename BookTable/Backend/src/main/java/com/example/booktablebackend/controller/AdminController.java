package com.example.booktablebackend.controller;

import com.example.booktablebackend.component.ResponseDTO;
import com.example.booktablebackend.services.OpeningService;
import com.example.booktablebackend.services.RestaurantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * @author :37824
 * @description:TODO
 * @date :2025/05/02 23:40
 */
@RestController
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    RestaurantService restaurantService;

    @Autowired
    OpeningService openingService;

    @PostMapping("/remove/{id}")
    public ResponseDTO<String> removeRestaurant(@PathVariable long id){
        restaurantService.auditRestaurant(id, false);
        return ResponseDTO.ok();
    }

    @PostMapping("/approve/{id}")
    public ResponseDTO<String> approveRestaurant(@PathVariable long id){
        restaurantService.auditRestaurant(id, true);
        return ResponseDTO.ok();
    }

    @GetMapping("/reservation_number/{year}/{month}")
    public ResponseDTO<List<Map<String, Object>>> reservationNum(@PathVariable int year, @PathVariable int month){
        return ResponseDTO.ok(openingService.getDailyOpeningReservationStats(year, month));
    }

}

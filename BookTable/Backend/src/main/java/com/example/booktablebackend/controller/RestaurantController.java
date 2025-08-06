package com.example.booktablebackend.controller;


import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.booktablebackend.models.Restaurant;
import com.example.booktablebackend.services.RestaurantService;

@RestController
@RequestMapping("/api/restaurants")
public class RestaurantController {

        @Autowired
        private RestaurantService restaurantService;

        // https://developers.google.com/maps/documentation/embed/embedding-map
        @GetMapping("/restaurant/{restaurantId}/map")
        public ResponseEntity<String> getMapSrc(@PathVariable Long restaurantId) {
            try {
                String encodedUrl = restaurantService.generateEncodedMapSrc(restaurantId);
                return new ResponseEntity<>(encodedUrl, HttpStatus.OK);
            } catch (Exception e) {
                return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        @PostMapping
        public ResponseEntity<Restaurant> createRestaurant(@RequestBody Restaurant restaurant) {
            Restaurant saved = restaurantService.saveRestaurant(restaurant);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        }
    
        @PostMapping("/batch")
        public ResponseEntity<List<Restaurant>> createRestaurants(@RequestBody List<Restaurant> restaurants) {
            List<Restaurant> saved = restaurantService.saveRestaurants(restaurants);
            return new ResponseEntity<>(saved, HttpStatus.CREATED);
        }
    
        @GetMapping
        public ResponseEntity<List<Restaurant>> getAllRestaurants() {
            List<Restaurant> restaurants = restaurantService.findAllAudit(true);
            return new ResponseEntity<>(restaurants, HttpStatus.OK);
        }

        @GetMapping("/unapproved")
        public ResponseEntity<List<Restaurant>> getAllUnapprovedRestaurants() {
            List<Restaurant> restaurants = restaurantService.findAllAudit(false);
            return new ResponseEntity<>(restaurants, HttpStatus.OK);
        }



        @GetMapping("/{id}")
        public ResponseEntity<Restaurant> getRestaurantById(@PathVariable long id) {
            Restaurant restaurant = restaurantService.getRestaurantById(id);
            if (restaurant == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            return new ResponseEntity<>(restaurant, HttpStatus.OK);
        }

        @PostMapping("/search")
        public ResponseEntity<List<Restaurant>> searchRestaurants(@RequestBody Map<String, Object> options) {
            List<Restaurant> results = restaurantService.findBy(options);
            return new ResponseEntity<>(results, HttpStatus.OK);
        }

        /* 
        // Update a restaurant
        @PutMapping("/{id}")
        public ResponseEntity<Restaurant> updateRestaurant(@PathVariable long id, @RequestBody Restaurant restaurant) {
            restaurant.setId(id);
            Restaurant updated = restaurantService.updateRestaurant(restaurant);
            return new ResponseEntity<>(updated, HttpStatus.OK);
        }
        */

        @DeleteMapping("/{id}")
        public ResponseEntity<Void> deleteRestaurant(@PathVariable long id) {
            Restaurant restaurant = restaurantService.getRestaurantById(id);
            if (restaurant == null) {
                return new ResponseEntity<>(HttpStatus.NOT_FOUND);
            }
            restaurantService.deleteRestaurant(restaurant);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        @PatchMapping("/{id}")
        public ResponseEntity<Restaurant> partialUpdateRestaurant(@PathVariable long id, @RequestBody Map<String, Object> fields) {
            try {
                Restaurant updatedRestaurant = restaurantService.partialUpdateRestaurant(id, fields);
                if (updatedRestaurant == null) {
                    return new ResponseEntity<>(HttpStatus.NOT_FOUND);
                }
                return new ResponseEntity<>(updatedRestaurant, HttpStatus.OK);
            } catch (Exception e) {
                return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
            }
        }

}

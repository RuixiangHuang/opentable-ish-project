package com.example.booktablebackend.controller;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

import com.example.booktablebackend.component.ResponseDTO;
import com.example.booktablebackend.component.constants.HTTPCode;
import com.example.booktablebackend.models.Restaurant;
import com.example.booktablebackend.models.User;
import com.example.booktablebackend.models.dto.RestaurantOpeningsDTO;
import com.example.booktablebackend.models.form.OpeningSearchOptions;
import com.example.booktablebackend.services.MailService;
import com.example.booktablebackend.services.RestaurantService;
import com.example.booktablebackend.services.UserService;
import jakarta.mail.MessagingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.booktablebackend.models.Opening.Opening;
import com.example.booktablebackend.services.OpeningService;

@RestController
@RequestMapping("/api/openings")
public class OpeningController {

    @Autowired
    private OpeningService openingService;

    @Autowired
    private RestaurantService restaurantService;

    @Autowired
    private UserService userService;

    @Autowired
    private MailService mailService;

    @PostMapping
    public ResponseDTO<Opening> createOpening(@RequestBody Opening opening) {
        return ResponseDTO.ok(openingService.saveOpening(opening));
    }

    @PostMapping("/batch")
    public ResponseDTO<List<Opening>> createOpenings(@RequestBody List<Opening> openings) {
        return ResponseDTO.ok(openingService.saveOpenings(openings));
    }

    @GetMapping("/query_opening")
    public ResponseDTO<List<Opening>> getAllOpenings() {
        return ResponseDTO.ok(openingService.findAllOpenings());
    }

    @GetMapping("/{id}")
    public ResponseDTO<Opening> getOpeningById(@PathVariable long id) {
        return ResponseDTO.ok(openingService.findOpeningById(id));
    }

    @PostMapping("/search")
    public ResponseDTO<List<RestaurantOpeningsDTO>> searchOpenings(@RequestBody OpeningSearchOptions options) {
        Set<Long> ids = new HashSet<>();
        if (options.getRestaurantZipcode() != null) {
            List<Restaurant> restaurants = restaurantService.getRestaurantsByZipcode(options.getRestaurantZipcode());
            ids.addAll(restaurants.stream().map(Restaurant::getId).collect(Collectors.toSet()));
        }
        if (options.getRestaurantCity() != null) {
            List<Restaurant> restaurants = restaurantService.getRestaurantsByCity(options.getRestaurantCity());
            ids.addAll(restaurants.stream().map(Restaurant::getId).collect(Collectors.toSet()));
        }
        if (!ids.isEmpty()) {
            options.setRestaurantIds(ids.stream().toList());
        }
        return ResponseDTO.ok(openingService.searchOpenings(options));
    }

    @PutMapping("/{id}")
    public ResponseDTO<Opening> updateOpening(@PathVariable long id, @RequestBody Opening opening) throws MessagingException {
        opening.setId(id);
        return ResponseDTO.ok(openingService.updateOpening(opening));
    }

    @PutMapping("/book/{id}")
    public ResponseDTO<Opening> updateBook(@PathVariable long id, @RequestBody Map<String, Long> userId) throws MessagingException {
        Opening opening = openingService.findOpeningById(id);
        if (opening.getUser() != null) {
            return ResponseDTO.fail(HTTPCode.BAD_REQUEST, "Opening already booked");
        }
        Optional<User> user = userService.findById(userId.get("userId"));
        if (user.isPresent()) {
            opening.setUser(user.get());
            opening = openingService.updateOpening(opening);
            mailService.sendReservationSuccessEmail(opening.getUser().getUsername(), opening.getUser().getEmail(), opening.getRestaurant().getName(), opening.getDateTime(), opening.getNumPeople(), opening.getId());
            return ResponseDTO.ok(opening);
        } else {
            return ResponseDTO.fail(HTTPCode.BAD_REQUEST, "Unknown userId");
        }
    }

    @PostMapping("/cancel/{id}")
    public ResponseDTO<Opening> cancelOpening(@PathVariable long id) throws MessagingException {
        Opening opening = openingService.findOpeningById(id);
        opening.setUser(null);
        return ResponseDTO.ok(openingService.updateOpening(opening));
    }

    @DeleteMapping("/{id}")
    public ResponseDTO<String> deleteOpening(@PathVariable long id) {
        openingService.deleteOpening(id);
        return ResponseDTO.ok();
    }

    @PostMapping("/checkin/{openingId}")
    public ResponseDTO<String> checkingUser(@PathVariable long openingId){
        openingService.checkinOpening(openingId);
        return ResponseDTO.ok();
    }

    @GetMapping("/booked_today/{id}/{date}")
    public ResponseDTO<Integer> numberBookedToday(@PathVariable Long id, @PathVariable LocalDate date){
        return ResponseDTO.ok(openingService.numberBookedToday(id, date));
    }

    @GetMapping("/list/{userId}")
    public ResponseDTO<List<Opening>> listUserOpening(@PathVariable Long userId){
        return ResponseDTO.ok(openingService.queryUserOpening(userId));
    }

    @GetMapping("/restaurantOpenings/{restaurantId}/{date}")
    public ResponseDTO<List<Opening>> listRestaurantOpening(@PathVariable Long restaurantId, @PathVariable LocalDate date){
        return ResponseDTO.ok(openingService.queryRestaurantOpening(restaurantId, date));
    }
}

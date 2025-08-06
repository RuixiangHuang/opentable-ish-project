package com.example.booktablebackend.controller;

import com.example.booktablebackend.component.ResponseDTO;
import com.example.booktablebackend.models.Review;
import com.example.booktablebackend.services.RestaurantService;
import com.example.booktablebackend.services.ReviewService;
import org.springdoc.core.annotations.ParameterObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author :37824
 * @description:TODO
 * @date :2025/05/02 21:15
 */
@RestController
@RequestMapping("/api/review")
public class ReviewController {
    @Autowired
    ReviewService reviewService;

    @Autowired
    RestaurantService restaurantService;
    @GetMapping("/restaurant/{id}")
    public ResponseDTO<List<Review>> restaurantReview(@PathVariable long id, @ParameterObject Pageable pageable){
        return ResponseDTO.ok(reviewService.findReviewsByRestaurantId(id));
    }

    @PostMapping("/write_review")
    public ResponseDTO<String> writeReview(@RequestBody Review review){
        reviewService.saveReview(review);
        restaurantService.updateRating(review.getRestaurantId(), review.getRating());
        return ResponseDTO.ok();
    }
}

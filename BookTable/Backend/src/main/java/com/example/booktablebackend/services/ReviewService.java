package com.example.booktablebackend.services;

import com.example.booktablebackend.models.Review;
import com.example.booktablebackend.repos.ReviewRepository;
import org.hibernate.PropertyValueException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    public Review saveReview(Review review) {
        return reviewRepository.save(review);
    }

    public List<Review> saveReviews(List<Review> reviews) {
        return reviewRepository.saveAll(reviews);
    }

    public List<Review> findReviewsByRestaurantId(Long id) {
        return reviewRepository.findByRestaurantId(id);
    }

    public Review updateReview(Review review) throws PropertyValueException {
        Review existingReview = reviewRepository.findById(review.getId()).orElse(null);
        if (existingReview == null) {
            return reviewRepository.save(review);
        }
        existingReview.setText(review.getText());
        try {
           existingReview.setRestaurantId(review.getRestaurantId());
        } catch (NullPointerException e) {
            throw new PropertyValueException("Not-null property references a null or transient value", "Review", "restaurant");
        }
        return reviewRepository.save(existingReview);
    }

    public void deleteReview(Long id) {
        reviewRepository.deleteById(id);
    }

}

package com.example.booktablebackend.models.Opening;

import com.example.booktablebackend.models.form.OpeningSearchOptions;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.util.*;

public class OpeningSpecification {

    public static Specification<Opening> build(OpeningSearchOptions options) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (options.getNumPeople() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("numPeople"), options.getNumPeople()));
            }
            if (options.getDateTime() != null) {
                predicates.add(cb.between(root.get("dateTime"), options.getDateTime().minusMinutes(30), options.getDateTime().plusMinutes(30)));
            }
            if (options.getRestaurantIds() != null) {
                predicates.add(root.get("restaurant").get("id").in(options.getRestaurantIds()));
            }
            if (options.getRestaurantId() != null) {
                predicates.add(cb.equal(root.get("restaurant").get("id"), options.getRestaurantId()));
            }
            if (options.getUserId() != null) {
                predicates.add(cb.equal(root.get("user").get("id"), options.getUserId()));
            }
            if (options.getArrived() != null) {
                predicates.add(cb.equal(root.get("arrived"), options.getArrived()));
            }
            if (options.getCheckin() != null) {
                predicates.add(cb.equal(root.get("checkin"), options.getCheckin()));
            }
            predicates.add(cb.isTrue(root.get("restaurant").get("isApproved")));
            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}


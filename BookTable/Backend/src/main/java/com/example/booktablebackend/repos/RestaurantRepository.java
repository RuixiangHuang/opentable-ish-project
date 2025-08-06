package com.example.booktablebackend.repos;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.booktablebackend.models.Restaurant;
import org.springframework.data.repository.query.QueryByExampleExecutor;

import java.util.List;


public interface RestaurantRepository extends JpaRepository<Restaurant, Long>, QueryByExampleExecutor<Restaurant> {

    List<Restaurant> findByZipCode(String zipCode);

    List<Restaurant> findByCity(String city);
    List<Restaurant> findByIsApproved(Boolean flag);
}

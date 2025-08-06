package com.example.booktablebackend.repos;

import com.example.booktablebackend.models.Restaurant;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.booktablebackend.models.Opening.Opening;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.data.repository.query.QueryByExampleExecutor;

import java.time.LocalDateTime;
import java.util.List;


public interface OpeningRepository extends JpaRepository<Opening, Long>, QueryByExampleExecutor<Opening> {

    @Query("SELECT o FROM Opening o WHERE o.numPeople >= :num")
    List<Opening> findByNumPeople(@Param("num") int min);

    Page<Opening> findAll(Specification<Opening> spec, Pageable pageable);

    @Query("SELECT DATE(o.dateTime) as date, COUNT(o) as count " +
            "FROM Opening o " +
            "WHERE YEAR(o.dateTime) = :year AND MONTH(o.dateTime) = :month AND o.user IS NOT NULL " +
            "GROUP BY DATE(o.dateTime) " +
            "ORDER BY DATE(o.dateTime)")
    List<Object[]> countReservedOpeningsByDay(@Param("year") int year, @Param("month") int month);

    List<Opening> findByRestaurantId(Long id);

    @Query("SELECT COUNT(o) FROM Opening o " +
            "WHERE o.restaurant.id = :restaurantId " +
            "AND o.dateTime BETWEEN :startOfDay AND :endOfDay " +
            "AND o.user IS NOT NULL")
    Integer countBookedToday(
            @Param("restaurantId") Long restaurantId,
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay
    );

    @Query("SELECT o FROM Opening o WHERE o.user.id = :userId")
    List<Opening> queryUserOpeningList(@Param("userId") Long userId);


    @Query("SELECT o FROM Opening o WHERE o.restaurant.id = :restaurantId AND o.dateTime BETWEEN :startOfDay AND :endOfDay")
    List<Opening> queryRestaurantOpeningList(
            @Param("restaurantId") Long restaurantId,
            @Param("startOfDay") LocalDateTime startOfDay,
            @Param("endOfDay") LocalDateTime endOfDay
    );

}

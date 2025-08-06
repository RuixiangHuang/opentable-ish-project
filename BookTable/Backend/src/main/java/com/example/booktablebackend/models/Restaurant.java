package com.example.booktablebackend.models;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.Data;

import jakarta.persistence.*;
import java.io.Serializable;
import java.util.List;

@Data
@Entity
@Inheritance(strategy = InheritanceType.JOINED)
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Table(name = "restaurants")
public class Restaurant implements Serializable{

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column()
    private Long managerId;
    @Column(name = "is_approved", nullable = false)
    private Boolean isApproved = false;
    @Column(name = "address", nullable = false)
    private String address;
    @Column(name = "city", nullable = false)
    private String city;
    @Column(name = "state", nullable = false)
    private String state;
    @Column(name = "zipCode", nullable = false)
    private String zipCode;
    @Column(name = "name", nullable = false)
    private String name;
    @Column(name = "cuisine", nullable = false)
    private String cuisine;
    @Column(name = "costRating", nullable = false)
    private int costRating;
    @Column(name = "timesBooked", nullable = false)
    private int timesBooked;
    @Column
    private Double rating;
    @Column
    private Long reviewNumber;
    @Column(name = "contactInfo", nullable = false)
    private String contactInfo;
    @Column(name = "hours", nullable = false)
    private String hours;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @ElementCollection
    @CollectionTable(name = "restaurant_photos", joinColumns = @JoinColumn(name = "restaurant_id"))
    @Column(name = "photo_urls")
    private List<String> photos;
}

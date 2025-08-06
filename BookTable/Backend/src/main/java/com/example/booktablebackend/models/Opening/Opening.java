package com.example.booktablebackend.models.Opening;

import java.io.Serializable;
import java.time.LocalDateTime;

import com.example.booktablebackend.models.Restaurant;
import com.example.booktablebackend.models.User;
import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table(name = "openings")
public class Opening implements Serializable {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "numPeople")
    private int numPeople;

    @Column(name = "numSeat", nullable = false)
    private int numSeat;

    @Column(name = "dateTime", nullable = false)
    private LocalDateTime dateTime;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "restaurantId", nullable = false)
    private Restaurant restaurant;

    @ManyToOne
    @JoinColumn(name = "userId")
    private User user;

    @Column(name = "arrived", nullable = false)
    private boolean arrived = false;

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}

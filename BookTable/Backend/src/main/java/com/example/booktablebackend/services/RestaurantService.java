package com.example.booktablebackend.services;

import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.stream.Collectors;

import org.hibernate.PropertyValueException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Example;
import org.springframework.data.domain.ExampleMatcher;
import org.springframework.stereotype.Service;
import com.example.booktablebackend.models.Restaurant;
import com.example.booktablebackend.repos.RestaurantRepository;

import java.util.*;

@Service
@Slf4j
public class RestaurantService {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Value("${google.api.key}")
    private String googleApiKey;


    public Restaurant saveRestaurant(Restaurant restaurant) {
        restaurant.setRating(0.0);
        restaurant.setReviewNumber(0L);
        return restaurantRepository.save(restaurant);
    }

    public List<Restaurant> saveRestaurants(List<Restaurant> restaurants) {
        return restaurantRepository.saveAll(restaurants);
    }

    public Restaurant getRestaurantById(long id) {
        return restaurantRepository.findById(id).orElse(null);
    }

    public List<Restaurant> getRestaurantsByZipcode(String zip) {return restaurantRepository.findByZipCode(zip);}

    public List<Restaurant> getRestaurantsByCity(String city) {return restaurantRepository.findByCity(city);}

    public List<Restaurant> findAll() {
        return restaurantRepository.findAll();
    }
    public List<Restaurant> findAllAudit(Boolean flag){
        return restaurantRepository.findByIsApproved(flag);
    }

    public List<Restaurant> findBy(Map<String, Object> options) {
        Set<String> optionKeys = options.keySet();
        List<Field> fields = Arrays.asList(Restaurant.class.getDeclaredFields());
        Set<String> attributes = fields.stream().map(Field::getName).collect(Collectors.toSet());
        if (optionKeys.isEmpty()) {
            return new ArrayList<>();
        }
        Set<String> badKeys = new HashSet<>(options.keySet());
        badKeys.removeAll(attributes);
        if (!badKeys.isEmpty()) {
            throw new IllegalArgumentException("Invalid options: " + badKeys);
        }

        Set<String> ignoredKeys = new HashSet<>(attributes);
        ignoredKeys.removeAll(optionKeys);

        Restaurant restaurant = new Restaurant();
        try {
            for (String key : optionKeys) {
                String setterName = "set" + key.substring(0, 1).toUpperCase() + key.substring(1);
                Method setter = Restaurant.class.getMethod(setterName, options.get(key).getClass());
                setter.invoke(restaurant, options.get(key));
            }
        } catch (InvocationTargetException | NoSuchMethodException | IllegalAccessException e) {
            log.error(e.getMessage());
        }

        ExampleMatcher matcher = ExampleMatcher.matching().withIncludeNullValues();
        matcher = matcher.withIgnorePaths(ignoredKeys.toArray(new String[0]));
        Example<Restaurant> example = Example.of(restaurant, matcher);
        return restaurantRepository.findAll(example);
    }

    public Restaurant updateRestaurant(Restaurant restaurant) {
        Restaurant existingRestaurant = restaurantRepository.findById(restaurant.getId()).orElse(null);
        if (existingRestaurant == null) {
            return restaurantRepository.save(restaurant);
        }
        String field = "";
        try {
            field = "name";
            existingRestaurant.setName(restaurant.getName());
            field = "description";
            existingRestaurant.setDescription(restaurant.getDescription());
            field = "address";
            existingRestaurant.setAddress(restaurant.getAddress());
            field = "city";
            existingRestaurant.setCity(restaurant.getCity());
            field = "contactInfo";
            existingRestaurant.setContactInfo(restaurant.getContactInfo());
            field = "costRating";
            existingRestaurant.setCostRating(restaurant.getCostRating());
            field = "hours";
            existingRestaurant.setHours(restaurant.getHours());
            field = "cuisine";
            existingRestaurant.setCuisine(restaurant.getCuisine());
            field = "state";
            existingRestaurant.setState(restaurant.getState());
            field = "photos";
            existingRestaurant.setPhotos(restaurant.getPhotos());
            field = "timesBooked";
            existingRestaurant.setTimesBooked(restaurant.getTimesBooked());
            field = "zipCode";
            existingRestaurant.setZipCode(restaurant.getZipCode());
        } catch (NullPointerException e) {
            throw new PropertyValueException("Not-null property references a null or transient value", "Restaurant", field);
        }
        return restaurantRepository.save(existingRestaurant);
    }

    public String generateEncodedMapSrc(Long restaurantId){
        Restaurant restaurant = getRestaurantById(restaurantId);
        String address = restaurant.getAddress() + ", " +
                restaurant.getCity() + ", " +
                restaurant.getState() + " " +
                restaurant.getZipCode();

        String encodedAddress = URLEncoder.encode(address, StandardCharsets.UTF_8);
        return String.format(
                "https://www.google.com/maps/embed/v1/place?key=%s&q=%s",
                googleApiKey, encodedAddress
        );
    }

    public void deleteRestaurant(Restaurant restaurant) {
        restaurantRepository.delete(restaurant);
    }

    public Restaurant partialUpdateRestaurant(long id, Map<String, Object> fields) {
        Restaurant existingRestaurant = restaurantRepository.findById(id).orElse(null);
        if (existingRestaurant == null) {
            return null;
        }

        for (Map.Entry<String, Object> entry : fields.entrySet()) {
            String fieldName = entry.getKey();
            Object fieldValue = entry.getValue();

            try {
                Field field = Restaurant.class.getDeclaredField(fieldName);
                field.setAccessible(true);
                field.set(existingRestaurant, fieldValue);
            } catch (NoSuchFieldException | IllegalAccessException e) {
                log.error("Error updating field: {}", fieldName, e);
                throw new IllegalArgumentException("Invalid field: " + fieldName);
            }
        }

        return restaurantRepository.save(existingRestaurant);
    }


    public void auditRestaurant(long id, boolean flag){
        Optional<Restaurant> tempR = restaurantRepository.findById(id);
        Restaurant r = tempR.get();
        r.setIsApproved(flag);
        restaurantRepository.save(r);
    }

    @Transactional
    public void updateRating(Long restaurantId, Integer newRating){
        Restaurant tempRestaurant = restaurantRepository.findById(restaurantId).get();
        Long currentReviewNumber = tempRestaurant.getReviewNumber();
        double totalPoints = tempRestaurant.getRating()*currentReviewNumber;
        double resultRating = (totalPoints + newRating)/(currentReviewNumber+1);
        tempRestaurant.setRating(resultRating);
        tempRestaurant.setReviewNumber(currentReviewNumber+1);
        log.info("new rating: {}", resultRating);
        restaurantRepository.save(tempRestaurant);
    }
}

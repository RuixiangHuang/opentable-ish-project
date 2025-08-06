package com.example.booktablebackend.services;

import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

import com.example.booktablebackend.models.Opening.OpeningSpecification;
import com.example.booktablebackend.models.Restaurant;
import com.example.booktablebackend.models.dto.RestaurantOpeningsDTO;
import com.example.booktablebackend.models.form.OpeningSearchOptions;
import jakarta.mail.MessagingException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.hibernate.PropertyValueException;
import com.example.booktablebackend.models.Opening.Opening;
import com.example.booktablebackend.repos.OpeningRepository;

@Service
@Slf4j
public class OpeningService {

    @Autowired
    private OpeningRepository openingRepository;


    public Opening saveOpening(Opening opening) {
        return openingRepository.save(opening);
    }

    public List<Opening> saveOpenings(List<Opening> openings) {
        return openingRepository.saveAll(openings);
    }

    public List<Opening> findAllOpenings() {
        return openingRepository.findAll();
    }

    public Opening findOpeningById(long id) {
        return openingRepository.findById(id).orElse(null);
    }

    public List<Opening> findBy(Map<String, Object> options) {
        Set<String> optionKeys = options.keySet();
        List<Field> fields = Arrays.asList(Opening.class.getDeclaredFields());
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

        Opening openingExample = new Opening();
        try {
            for (String key : optionKeys) {
                String setterName = "set" + key.substring(0, 1).toUpperCase() + key.substring(1);
                Method setter = Opening.class.getMethod(setterName, options.get(key).getClass());
                setter.invoke(openingExample, options.get(key));
            }
        } catch (InvocationTargetException | NoSuchMethodException | IllegalAccessException e) {
            log.error(e.getMessage(), e);
        }

        ExampleMatcher matcher = ExampleMatcher.matching().withIncludeNullValues();
        matcher = matcher.withIgnorePaths(ignoredKeys.toArray(new String[0]));
        if (optionKeys.contains("numPeople")) {
            matcher = matcher.withIgnorePaths("numPeople");

        }
        Example<Opening> example = Example.of(openingExample, matcher);
        List<Opening> openingsOther = openingRepository.findAll(example);
        List<Opening> numPeopleOpenings = openingRepository.findByNumPeople(openingExample.getNumPeople());
        List<Opening> openings = openingsOther.stream().distinct().filter(numPeopleOpenings::contains).toList();

        return openings.stream()
                .collect(Collectors.collectingAndThen(
                        Collectors.toMap(
                                opening -> opening.getDateTime().truncatedTo(ChronoUnit.MINUTES) + "-" + opening.getRestaurant().getId(),
                                opening -> opening,
                                (existing, replacement) -> existing
                        ),
                        map -> new ArrayList<>(map.values())
                ));
    }

    public List<RestaurantOpeningsDTO> searchOpenings(OpeningSearchOptions options) {
        Specification<Opening> spec = OpeningSpecification.build(options);
        Sort sort = Sort.by(Sort.Direction.fromString(options.getSortDirection()), options.getSortBy());
        Pageable pageable = PageRequest.of(options.getPage(), options.getSize(), sort);

        Page<Opening> page = openingRepository.findAll(spec, pageable);
        return groupOpeningsByRestaurant(page.getContent());
    }

    public List<RestaurantOpeningsDTO> groupOpeningsByRestaurant(List<Opening> openings) {
        Map<Long, List<Opening>> grouped = openings.stream()
                .collect(Collectors.groupingBy(o -> o.getRestaurant().getId()));

        List<RestaurantOpeningsDTO> result = new ArrayList<>();
        for (Map.Entry<Long, List<Opening>> entry : grouped.entrySet()) {
            Long restaurantId = entry.getKey();
            Restaurant restaurant = entry.getValue().get(0).getRestaurant();

            Set<LocalDateTime> seenTimes = new HashSet<>();
            List<Opening> deduplicatedOpenings = entry.getValue().stream()
                    .filter(o -> seenTimes.add(o.getDateTime()))
                    .collect(Collectors.toList());

            result.add(new RestaurantOpeningsDTO(restaurant, deduplicatedOpenings));
        }

        return result;
    }




    public Opening updateOpening(Opening opening) {
        Opening existingOpening = openingRepository.findById(opening.getId()).orElse(null);
        if (existingOpening == null) {
            return openingRepository.save(opening);
        }
        try {
            existingOpening.setNumPeople(opening.getNumPeople());
        } catch (NullPointerException e) {
            throw new PropertyValueException("Not-null property references a null or transient value", "Opening", "numPeople");
        }
        try {
            existingOpening.setDateTime(opening.getDateTime());
        } catch (NullPointerException e) {
            throw new PropertyValueException("Not-null property references a null or transient value", "Opening", "dateTime");
        }
        try {
            existingOpening.setRestaurant(opening.getRestaurant());
        } catch (NullPointerException e) {
            throw new PropertyValueException("Not-null property references a null or transient value", "Opening", "restaurant");
        }
        existingOpening.setUser(opening.getUser());
        return openingRepository.save(existingOpening);
    }

    public void deleteOpening(long id) {
        openingRepository.deleteById(id);
    }

    public void deleteOpening(Opening opening) {
        openingRepository.delete(opening);
    }


    public void checkinOpening(long openingId) {
        Optional<Opening> opening = openingRepository.findById(openingId);
        opening.get().setArrived(true);
        openingRepository.save(opening.get());
    }

    public List<Map<String, Object>> getDailyOpeningReservationStats(int year, int month) {
        List<Object[]> rawResults = openingRepository.countReservedOpeningsByDay(year, month);
        List<Map<String, Object>> stats = new ArrayList<>();

        for (Object[] row : rawResults) {
            Map<String, Object> dayStat = new HashMap<>();
            dayStat.put("date", row[0].toString()); // e.g., 2025-05-04
            dayStat.put("count", ((Number) row[1]).intValue());
            stats.add(dayStat);
        }

        return stats;
    }

    public Integer numberBookedToday(Long id, LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);
        return openingRepository.countBookedToday(id, startOfDay, endOfDay);

    }

    public List<Opening> queryUserOpening(Long userId){
        return openingRepository.queryUserOpeningList(userId);
    }

    public List<Opening> queryRestaurantOpening(Long restaurantId, LocalDate date) {
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(LocalTime.MAX);
        return openingRepository.queryRestaurantOpeningList(restaurantId, startOfDay, endOfDay);
    }
}

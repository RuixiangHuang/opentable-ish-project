package com.example.booktablebackend.models;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter()
public class RoleConverter implements AttributeConverter<Role, Integer> {

    @Override
    public Integer convertToDatabaseColumn(Role role) {
        return role != null ? role.getDbCode() : null;
    }

    @Override
    public Role convertToEntityAttribute(Integer dbCode) {
        return dbCode != null ? Role.fromDbCode(dbCode) : null;
    }
}

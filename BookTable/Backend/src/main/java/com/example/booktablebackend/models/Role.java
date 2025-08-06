package com.example.booktablebackend.models;

public enum Role {

    ADMIN(0, "admin"),
    MANAGER(1, "manager"),
    USER(2, "user");

    private final int dbCode;
    private final String code;

    Role(int dbCode, String code) {
        this.dbCode = dbCode;
        this.code = code;
    }

    public int getDbCode() {
        return dbCode;
    }

    public String getCode() {
        return code;
    }

    public static Role fromDbCode(int dbCode) {
        for (Role role : values()) {
            if (role.dbCode == dbCode) {
                return role;
            }
        }
        throw new IllegalArgumentException("Unknown db code for Role: " + dbCode);
    }

    public static Role fromCode(String code) {
        for (Role role : values()) {
            if (role.code.equalsIgnoreCase(code)) {
                return role;
            }
        }
        throw new IllegalArgumentException("Unknown code for Role: " + code);
    }
}

package com.example.booktablebackend.component.constants;

import lombok.NoArgsConstructor;

@NoArgsConstructor
public enum HTTPCode {

    SUCCESS(200, "OK"),
    BAD_REQUEST(400, "bad request"),
    UNAUTHORIZED(401, "unauthorized"),
    FORBIDDEN(403, "forbidden"),
    NOT_FOUND(404, "Not found"),
    INTERNAL_ERROR (500, "error"),
    PWD_ERROR(10001,"wrong password"),

    ;
    private String description;
    private int code;
    HTTPCode(int code, String description) {
        this.code = code;
        this.description = description;
    }

    public int getCode() {
        return code;
    }

    public String getDescription(){
        return description;
    }

}

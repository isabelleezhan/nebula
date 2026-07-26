package com.izhan.nebula.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateSubjectRequest {

    @NotBlank
    private String name;

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}

package com.izhan.nebula.controller;

import com.izhan.nebula.dto.CreateSubjectRequest;
import com.izhan.nebula.dto.SubjectResponse;
import com.izhan.nebula.model.Subject;
import com.izhan.nebula.service.SubjectService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    private final SubjectService subjectService;

    public SubjectController(
            SubjectService subjectService) {

        this.subjectService = subjectService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SubjectResponse createSubject(
            @Valid
            @RequestBody
            CreateSubjectRequest request) {

        Subject subject =
                subjectService.createSubject(
                        request.getName()
                );

        return SubjectResponse.from(subject);
    }
}

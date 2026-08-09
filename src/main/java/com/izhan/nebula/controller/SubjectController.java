package com.izhan.nebula.controller;

import com.izhan.nebula.dto.CreateSubjectRequest;
import com.izhan.nebula.dto.FocusSessionResponse;
import com.izhan.nebula.dto.RenameSubjectRequest;
import com.izhan.nebula.dto.SubjectResponse;
import com.izhan.nebula.model.Subject;
import com.izhan.nebula.model.User;
import com.izhan.nebula.service.FocusSessionService;
import com.izhan.nebula.service.SubjectService;

import com.izhan.nebula.service.UserService;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/subjects")
public class SubjectController {

    private final UserService userService;
    private final SubjectService subjectService;
    private final FocusSessionService focusSessionService;

    public SubjectController(
            SubjectService subjectService,
            UserService userService,
            FocusSessionService focusSessionService) {

        this.subjectService = subjectService;
        this.userService = userService;
        this.focusSessionService = focusSessionService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SubjectResponse createSubject(
            @Valid
            @RequestBody
            CreateSubjectRequest request,
            Principal principal) {

        User user = userService.getByEmail(principal.getName());

        Subject subject =
                subjectService.createSubject(
                        request.getName(),
                        user
                );

        return SubjectResponse.from(subject);
    }

    @GetMapping
    public List<SubjectResponse> getAllSubjects(Principal principal) {
        User user = userService.getByEmail(principal.getName());

        List<Subject> subjects = subjectService.getAllSubjects(user);
        List<SubjectResponse> subjectResponses = new ArrayList<>();

        for (Subject subject : subjects) {
            subjectResponses.add(SubjectResponse.from(subject));
        }

        return subjectResponses;
    }

    @GetMapping("/{subjectId}")
    public SubjectResponse getSubject(
            @PathVariable Long subjectId, Principal principal) {

        User user = userService.getByEmail(principal.getName());

        Subject subject =
                subjectService.getSubject(subjectId, user);

        return SubjectResponse.from(subject);
    }

    @GetMapping("/{subjectId}/sessions")
    public List<FocusSessionResponse> getSessionsForSubject(
            @PathVariable Long subjectId,
            Principal principal) {

        User user = userService.getByEmail(
                principal.getName()
        );

        return focusSessionService
                .getSessionsForSubject(
                        subjectId,
                        user
                )
                .stream()
                .map(FocusSessionResponse::from)
                .toList();
    }

    @PatchMapping("/{subjectId}")
    public SubjectResponse renameSubject(
            @PathVariable Long subjectId,
            @Valid
            @RequestBody
            RenameSubjectRequest request,
            Principal principal) {

        User user =
                userService.getByEmail(
                        principal.getName()
                );

        Subject subject =
                subjectService.renameSubject(
                        subjectId,
                        request.getName(),
                        user
                );

        return SubjectResponse.from(subject);
    }
}

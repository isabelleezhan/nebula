package com.izhan.nebula.controller;

import com.izhan.nebula.dto.FocusSessionResponse;
import com.izhan.nebula.dto.RecordFocusSessionRequest;
import com.izhan.nebula.model.FocusSession;
import com.izhan.nebula.model.User;
import com.izhan.nebula.service.FocusSessionService;

import com.izhan.nebula.service.UserService;
import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/focus-sessions")
public class FocusSessionController {

    private final FocusSessionService focusSessionService;
    private final UserService userService;

    public FocusSessionController(
            FocusSessionService focusSessionService,
            UserService userService) {

        this.focusSessionService = focusSessionService;
        this.userService = userService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FocusSessionResponse recordCompletedSession(
            @Valid // After creating the request DTO, apply its validation annotations
            @RequestBody // Read the HTTP request's JSON body and convert it into a RecordFocusSessionRequest
            RecordFocusSessionRequest request,
            Principal principal) {

        User user = userService.getByEmail(principal.getName());

        FocusSession session =
                focusSessionService.recordCompletedSession(
                        request.getPlanetId(),
                        request.getStartedAt(),
                        request.getEndedAt(),
                        request.getDurationMinutes(),
                        user
                );

        return FocusSessionResponse.from(session);
    }
}

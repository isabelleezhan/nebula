package com.izhan.nebula.controller;

import com.izhan.nebula.dto.FocusSessionResponse;
import com.izhan.nebula.dto.RecordFocusSessionRequest;
import com.izhan.nebula.model.FocusSession;
import com.izhan.nebula.service.FocusSessionService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/focus-sessions")
public class FocusSessionController {

    private final FocusSessionService focusSessionService;

    public FocusSessionController(
            FocusSessionService focusSessionService) {

        this.focusSessionService = focusSessionService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public FocusSessionResponse recordCompletedSession(
            @Valid // After creating the request DTO, apply its validation annotations
            @RequestBody // Read the HTTP request's JSON body and convert it into a RecordFocusSessionRequest
            RecordFocusSessionRequest request) {

        FocusSession session =
                focusSessionService.recordCompletedSession(
                        request.getPlanetId(),
                        request.getStartedAt(),
                        request.getEndedAt(),
                        request.getDurationMinutes()
                );

        return FocusSessionResponse.from(session);
    }
}

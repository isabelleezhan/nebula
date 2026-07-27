package com.izhan.nebula.controller;

import com.izhan.nebula.dto.FocusSessionResponse;
import com.izhan.nebula.model.User;
import com.izhan.nebula.service.FocusSessionService;
import com.izhan.nebula.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/planets")
public class PlanetSessionController {

    private final FocusSessionService focusSessionService;
    private final UserService userService;

    public PlanetSessionController(
            FocusSessionService focusSessionService,
            UserService userService) {

        this.focusSessionService = focusSessionService;
        this.userService = userService;
    }

    @GetMapping("/{planetId}/sessions")
    public List<FocusSessionResponse> getSessionsForPlanet(
            @PathVariable Long planetId,
            Principal principal) {

        User user = userService.getByEmail(
                principal.getName()
        );

        return focusSessionService
                .getSessionsForPlanet(
                        planetId,
                        user
                )
                .stream()
                .map(FocusSessionResponse::from)
                .toList();
    }
}

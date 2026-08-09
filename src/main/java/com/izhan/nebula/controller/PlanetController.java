package com.izhan.nebula.controller;

import com.izhan.nebula.dto.PlanetResponse;
import com.izhan.nebula.model.Planet;
import com.izhan.nebula.model.User;
import com.izhan.nebula.service.PlanetService;
import com.izhan.nebula.service.UserService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/subjects")
public class PlanetController {

    private final PlanetService planetService;
    private final UserService userService;

    public PlanetController(PlanetService planetService,
                            UserService userService) {
        this.planetService = planetService;
        this.userService = userService;
    }

    @GetMapping("/{subjectId}/active-planet")
    public PlanetResponse getActivePlanet(
            @PathVariable
            Long subjectId,
            Principal principal) {

        User user = userService.getByEmail(principal.getName());
        Planet planet =
                planetService.getActivePlanet(subjectId, user);

        return PlanetResponse.from(planet);
    }

    @GetMapping("/{subjectId}/planets")
    public List<PlanetResponse> getPlanetsForSubject(
            @PathVariable
            Long subjectId,
            Principal principal) {

        User user = userService.getByEmail(principal.getName());

        List<PlanetResponse> responses = new ArrayList<>();
        List<Planet> planets = planetService.getPlanetsForSubject(subjectId, user);

        for (Planet planet : planets) {
            responses.add(PlanetResponse.from(planet));
        }

        return responses;
    }

}

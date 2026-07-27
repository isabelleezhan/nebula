package com.izhan.nebula.controller;

import com.izhan.nebula.dto.PlanetResponse;
import com.izhan.nebula.model.Planet;
import com.izhan.nebula.service.PlanetService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;

@RestController
@RequestMapping("/api/subjects")
public class PlanetController {

    private final PlanetService planetService;

    public PlanetController(PlanetService planetService) {
        this.planetService = planetService;
    }

    @GetMapping("/{subjectId}/active-planet")
    public PlanetResponse getActivePlanet(
            @PathVariable Long subjectId) {

        Planet planet =
                planetService.getActivePlanet(subjectId);

        return PlanetResponse.from(planet);
    }

    @GetMapping("/{subjectId}/planets")
    public List<PlanetResponse> getPlanetsForSubject(
            @PathVariable
            Long subjectId) {

        List<PlanetResponse> responses = new ArrayList<>();
        List<Planet> planets = planetService.getPlanetsForSubject(subjectId);

        for (Planet planet : planets) {
            responses.add(PlanetResponse.from(planet));
        }

        return responses;
    }
}

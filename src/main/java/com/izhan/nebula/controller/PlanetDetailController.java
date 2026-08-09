package com.izhan.nebula.controller;

import com.izhan.nebula.dto.PlanetResponse;
import com.izhan.nebula.dto.RenamePlanetRequest;
import com.izhan.nebula.model.Planet;
import com.izhan.nebula.model.User;
import com.izhan.nebula.service.PlanetService;
import com.izhan.nebula.service.UserService;

import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/planets")
public class PlanetDetailController {

    private final PlanetService planetService;
    private final UserService userService;

    public PlanetDetailController(
            PlanetService planetService,
            UserService userService) {

        this.planetService = planetService;
        this.userService = userService;
    }

    @GetMapping("/{planetId}")
    public PlanetResponse getPlanet(
            @PathVariable Long planetId,
            Principal principal) {

        User user = userService.getByEmail(
                principal.getName()
        );

        Planet planet = planetService.getPlanet(
                planetId,
                user
        );

        return PlanetResponse.from(planet);
    }

    @PatchMapping("/{planetId}")
    public PlanetResponse renamePlanet(
            @PathVariable Long planetId,
            @Valid @RequestBody RenamePlanetRequest request,
            Principal principal) {

        User user = userService.getByEmail(
                principal.getName()
        );

        Planet planet = planetService.renamePlanet(
                planetId,
                request.getName(),
                user
        );

        return PlanetResponse.from(planet);
    }
}

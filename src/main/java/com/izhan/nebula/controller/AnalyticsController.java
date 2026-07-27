package com.izhan.nebula.controller;

import com.izhan.nebula.dto.WeeklyAnalyticsResponse;
import com.izhan.nebula.model.User;
import com.izhan.nebula.service.AnalyticsService;
import com.izhan.nebula.service.UserService;

import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    private final AnalyticsService analyticsService;
    private final UserService userService;

    public AnalyticsController(
            AnalyticsService analyticsService,
            UserService userService) {

        this.analyticsService = analyticsService;
        this.userService = userService;
    }

    @GetMapping("/weekly")
    public WeeklyAnalyticsResponse getWeeklyAnalytics(
            Principal principal) {

        User user = userService.getByEmail(
                principal.getName()
        );

        return analyticsService
                .getWeeklyAnalytics(user);
    }
}

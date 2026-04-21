package com.linhdev.drumify.controller;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.linhdev.drumify.dto.ApiResponse;
import com.linhdev.drumify.dto.warehouse.DashboardResponse;
import com.linhdev.drumify.service.ReportService;

import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;

@RestController
@RequestMapping("/warehouse")
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class DashboardController {
    ReportService reportService;

    @GetMapping("/dashboard")
    ApiResponse<DashboardResponse> showDashboard() {
        return ApiResponse.<DashboardResponse>builder()
                .result(reportService.getDashboard())
                .build();
    }
}

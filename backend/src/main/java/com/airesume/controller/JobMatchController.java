package com.airesume.controller;

import com.airesume.dto.JobMatchDtos;
import com.airesume.service.JobMatchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/job-match")
@RequiredArgsConstructor
public class JobMatchController {

    private final JobMatchService jobMatchService;

    @PostMapping("/analyze")
    public ResponseEntity<JobMatchDtos.JobMatchResponse> analyzeJobMatch(@Valid @RequestBody JobMatchDtos.JobMatchRequest request) {
        return ResponseEntity.ok(jobMatchService.analyzeJobMatch(request));
    }

    @GetMapping("/history")
    public ResponseEntity<List<JobMatchDtos.JobMatchResponse>> getJobMatchHistory() {
        return ResponseEntity.ok(jobMatchService.getUserJobMatches());
    }
}

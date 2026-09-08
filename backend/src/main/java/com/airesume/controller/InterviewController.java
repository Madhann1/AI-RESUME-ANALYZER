package com.airesume.controller;

import com.airesume.dto.InterviewDtos;
import com.airesume.service.InterviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/interview")
@RequiredArgsConstructor
public class InterviewController {

    private final InterviewService interviewService;

    @PostMapping("/generate")
    public ResponseEntity<InterviewDtos.InterviewGenerateResponse> generateQuestions(@RequestBody InterviewDtos.InterviewGenerateRequest request) {
        return ResponseEntity.ok(interviewService.generateQuestions(request));
    }

    @GetMapping("/questions")
    public ResponseEntity<List<InterviewDtos.InterviewQuestionDto>> getQuestions(
            @RequestParam(required = false) Long resumeReportId,
            @RequestParam(required = false) String category
    ) {
        return ResponseEntity.ok(interviewService.getUserQuestions(resumeReportId, category));
    }
}

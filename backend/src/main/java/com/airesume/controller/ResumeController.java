package com.airesume.controller;

import com.airesume.dto.ResumeDtos;
import com.airesume.service.ResumeAnalysisService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/resumes")
@RequiredArgsConstructor
public class ResumeController {

    private final ResumeAnalysisService resumeAnalysisService;

    @PostMapping("/upload")
    public ResponseEntity<ResumeDtos.ResumeReportDetailDto> uploadResume(@RequestParam("file") MultipartFile file) {
        return ResponseEntity.ok(resumeAnalysisService.uploadAndAnalyzeResume(file));
    }

    @GetMapping
    public ResponseEntity<List<ResumeDtos.ResumeReportSummaryDto>> getUserResumes() {
        return ResponseEntity.ok(resumeAnalysisService.getUserResumes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ResumeDtos.ResumeReportDetailDto> getResumeById(@PathVariable Long id) {
        return ResponseEntity.ok(resumeAnalysisService.getResumeById(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, String>> deleteResume(@PathVariable Long id) {
        resumeAnalysisService.deleteResume(id);
        return ResponseEntity.ok(Map.of("message", "Resume report deleted successfully"));
    }
}

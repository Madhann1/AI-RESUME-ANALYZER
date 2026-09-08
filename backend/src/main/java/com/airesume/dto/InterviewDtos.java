package com.airesume.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

public class InterviewDtos {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InterviewGenerateRequest {
        private Long resumeReportId;
        private List<String> categories; // HR, Java, OOP, DBMS, SQL, Spring Boot, Project, Behavioral
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class InterviewQuestionDto {
        private Long id;
        private String category;
        private String question;
        private String sampleAnswer;
        private String difficulty;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class InterviewGenerateResponse {
        private Long resumeReportId;
        private List<InterviewQuestionDto> questions;
    }
}

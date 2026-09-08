package com.airesume.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "resume_reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ResumeReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String originalFileName;

    @Column(nullable = false)
    private String fileStoragePath;

    @Column(columnDefinition = "LONGTEXT")
    private String parsedText;

    private String candidateName;
    private String candidateEmail;
    private String candidatePhone;

    @Column(columnDefinition = "TEXT")
    private String skillsJson; // JSON array of skills

    @Column(columnDefinition = "TEXT")
    private String educationJson; // JSON array of education details

    @Column(columnDefinition = "TEXT")
    private String projectsJson; // JSON array of projects

    @Column(columnDefinition = "TEXT")
    private String experienceJson; // JSON array of experience entries

    @Column(columnDefinition = "TEXT")
    private String certificationsJson; // JSON array of certifications

    @Column(columnDefinition = "TEXT")
    private String strengthsJson; // JSON array of strengths

    @Column(columnDefinition = "TEXT")
    private String weaknessesJson; // JSON array of weaknesses

    @Column(columnDefinition = "TEXT")
    private String improvementSuggestionsJson; // JSON array of improvement suggestions

    private Integer overallScore; // 0 to 100

    private Integer skillsScore;
    private Integer projectsScore;
    private Integer experienceScore;
    private Integer formattingScore;
    private Integer technicalDepthScore;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}

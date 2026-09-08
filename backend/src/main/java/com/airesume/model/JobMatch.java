package com.airesume.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "job_matches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class JobMatch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "resume_report_id", nullable = false)
    private ResumeReport resumeReport;

    private String jobTitle;

    @Column(columnDefinition = "LONGTEXT")
    private String jobDescription;

    private Integer matchPercentage;

    @Column(columnDefinition = "TEXT")
    private String matchingSkillsJson;

    @Column(columnDefinition = "TEXT")
    private String missingSkillsJson;

    @Column(columnDefinition = "TEXT")
    private String learningPathJson;

    @Column(columnDefinition = "TEXT")
    private String hiringRecommendation;

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}

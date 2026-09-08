package com.airesume.repository;

import com.airesume.model.ResumeReport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ResumeReportRepository extends JpaRepository<ResumeReport, Long> {
    List<ResumeReport> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<ResumeReport> findByIdAndUserId(Long id, Long userId);
    Long countByUserId(Long userId);

    @Query("SELECT AVG(r.overallScore) FROM ResumeReport r WHERE r.user.id = :userId")
    Double findAverageOverallScoreByUserId(Long userId);
}

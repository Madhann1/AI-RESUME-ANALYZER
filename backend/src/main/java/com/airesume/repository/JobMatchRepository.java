package com.airesume.repository;

import com.airesume.model.JobMatch;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobMatchRepository extends JpaRepository<JobMatch, Long> {
    List<JobMatch> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<JobMatch> findByIdAndUserId(Long id, Long userId);
}

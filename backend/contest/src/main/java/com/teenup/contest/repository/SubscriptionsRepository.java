package com.teenup.contest.repository;

import com.teenup.contest.entity.SubscriptionsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SubscriptionsRepository extends JpaRepository<SubscriptionsEntity, Long> {
    List<SubscriptionsEntity> findByStudent_Id(Long studentId);

    @Query("""
        SELECT CASE WHEN COUNT(s) > 0 THEN TRUE ELSE FALSE END
        FROM SubscriptionsEntity s
        WHERE s.student.id = :studentId
          AND (
                (CURRENT_DATE BETWEEN s.startDate AND s.endDate)
             OR (s.usedSessions < s.totalSessions)
          )
    """)
    boolean existsActiveByStudent(Long studentId);
}

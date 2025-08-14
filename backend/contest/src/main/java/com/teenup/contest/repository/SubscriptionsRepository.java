package com.teenup.contest.repository;

import com.teenup.contest.entity.SubscriptionsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SubscriptionsRepository extends JpaRepository<SubscriptionsEntity, Long> {
    List<SubscriptionsEntity> findByStudent_Id(Long studentId);
}

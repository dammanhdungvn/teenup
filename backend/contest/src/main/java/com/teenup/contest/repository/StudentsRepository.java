package com.teenup.contest.repository;

import com.teenup.contest.entity.StudentsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface StudentsRepository extends JpaRepository<StudentsEntity, Long> {
    @Query("SELECT COUNT(s) FROM StudentsEntity s WHERE s.parent.id = :parentId")
    long countByParentId(Long parentId);
}

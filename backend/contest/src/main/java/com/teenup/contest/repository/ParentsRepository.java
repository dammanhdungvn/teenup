package com.teenup.contest.repository;

import com.teenup.contest.entity.ParentsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ParentsRepository extends JpaRepository<ParentsEntity, Long> {
    boolean existsByEmail(String email);

    @Query("SELECT DISTINCT p FROM ParentsEntity p LEFT JOIN FETCH p.students")
    List<ParentsEntity> findAllWithStudents();

    @Query("SELECT p FROM ParentsEntity p LEFT JOIN FETCH p.students WHERE p.id = :id")
    java.util.Optional<ParentsEntity> findByIdWithStudents(@Param("id") Long id);
}

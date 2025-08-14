package com.teenup.contest.repository;

import com.teenup.contest.entity.StudentsEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentsRepository extends JpaRepository<StudentsEntity, Long> {
}

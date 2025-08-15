package com.teenup.contest.repository;


import com.teenup.contest.entity.ClassRegistrationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ClassRegistrationsRepository extends JpaRepository<ClassRegistrationEntity, Long> {

    boolean existsByClazzIdAndStudentId(Long clazzId, Long studentId);

    int countByClazzId(Long clazzId);

    // Lấy tất cả registrations của một student, kèm theo dữ liệu lớp để check lịch (tránh N+1)
    @Query("""
        select r from ClassRegistrationEntity r
        join fetch r.clazz c
        where r.student.id = :studentId
    """)
    List<ClassRegistrationEntity> findAllByStudentIdWithClass(Long studentId);

    // Các regs của 1 class, kèm Student
    @Query("""
        select r from ClassRegistrationEntity r
        join fetch r.student s
        where r.clazz.id = :classId
    """)
    List<ClassRegistrationEntity> findAllByClazzIdWithStudent(Long classId);

    @Query("SELECT COUNT(r) FROM ClassRegistrationEntity r WHERE r.student.id = :studentId")
    long countByStudentId(Long studentId);

    @Query("SELECT COUNT(r) FROM ClassRegistrationEntity r WHERE r.clazz.id = :classId")
    long countByClassId(Long classId);

}
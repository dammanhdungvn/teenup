package com.teenup.contest.repository;


import com.teenup.contest.entity.ClassRegistrationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

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

    //register classes
    @Query("""
        SELECT r FROM ClassRegistrationEntity r
        WHERE r.clazz.id = :classId AND r.student.id = :studentId
    """)
    Optional<ClassRegistrationEntity> findByClassIdAndStudentId(Long classId, Long studentId);

    @Query("""
        SELECT CASE WHEN COUNT(r)>0 THEN TRUE ELSE FALSE END
        FROM ClassRegistrationEntity r
        WHERE r.clazz.id = :classId AND r.student.id = :studentId
    """)
    boolean existsByClassIdAndStudentId(Long classId, Long studentId);


    @Query(value = """
        SELECT CASE WHEN COUNT(*) > 0 THEN TRUE ELSE FALSE END
        FROM class_registrations r_src
        JOIN class_registrations r_other
             ON r_other.student_id = r_src.student_id
            AND r_other.class_id  <> :classId
        JOIN classes c_other ON c_other.id = r_other.class_id
        WHERE r_src.class_id = :classId
          AND c_other.day_of_week = :dayOfWeek
          AND STR_TO_DATE(SUBSTRING_INDEX(c_other.time_slot, '-', 1), '%H:%i')
                < STR_TO_DATE(:end,  '%H:%i')
          AND STR_TO_DATE(:start, '%H:%i')
                < STR_TO_DATE(SUBSTRING_INDEX(c_other.time_slot, '-', -1), '%H:%i')
        """, nativeQuery = true)

    boolean existsConflictWhenReschedule(Long classId, Integer dayOfWeek, String start, String end);

}
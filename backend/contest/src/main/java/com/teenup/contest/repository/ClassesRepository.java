package com.teenup.contest.repository;


import com.teenup.contest.entity.ClassesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ClassesRepository extends JpaRepository<ClassesEntity, Long> {
    List<ClassesEntity> findByDayOfWeek(Integer dayOfWeek);

    // Lấy class + registrations + students (1 query)
    @Query("""
        select distinct c from ClassesEntity c
        left join fetch c.registrations r
        left join fetch r.student s
        where c.id = :classId
    """)
    ClassesEntity findByIdWithStudents(Long classId);

    // MỚI: lấy TẤT CẢ lớp + students (dùng cho expand=registrations, không lọc theo ngày)
    @Query("""
        select distinct c from ClassesEntity c
        left join fetch c.registrations r
        left join fetch r.student s
    """)
    List<ClassesEntity> findAllWithStudents();

    // MỚI: lấy lớp THEO NGÀY + students (dùng cho expand=registrations & day)
    @Query("""
        select distinct c from ClassesEntity c
        left join fetch c.registrations r
        left join fetch r.student s
        where (:day is null or c.dayOfWeek = :day)
    """)
    List<ClassesEntity> findAllWithStudentsByDay(Integer day);
}

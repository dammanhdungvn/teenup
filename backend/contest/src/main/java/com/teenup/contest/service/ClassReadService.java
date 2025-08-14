package com.teenup.contest.service;

import com.teenup.contest.dto.response.ClassWithStudentsResponse;
import com.teenup.contest.dto.response.RegisteredStudentBrief;
import com.teenup.contest.dto.response.StudentClassBrief;
import com.teenup.contest.entity.ClassesEntity;
import com.teenup.contest.entity.StudentsEntity;
import com.teenup.contest.exception.StudentNotFoundException;
import com.teenup.contest.mapper.ClassReadMapper;
import com.teenup.contest.mapper.StudentReadMapper;
import com.teenup.contest.repository.ClassRegistrationsRepository;
import com.teenup.contest.repository.ClassesRepository;
import com.teenup.contest.repository.StudentsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClassReadService {

    private final ClassesRepository classesRepo;
    private final ClassRegistrationsRepository regsRepo;
    private final StudentsRepository studentsRepo;
    private final ClassReadMapper classReadMapper;
    private final StudentReadMapper studentReadMapper;

    /** GET /api/classes/{id} → class + students */
    @Transactional(readOnly = true)
    public ClassWithStudentsResponse getClassWithStudents(Long classId) {
        ClassesEntity c = classesRepo.findByIdWithStudents(classId);
        if (c == null) {
            throw new com.teenup.contest.exception.ClassNotFoundException(classId);
        }

        // khi dùng fetch join, students có trong c.registrations
        List<StudentsEntity> students = c.getRegistrations()
                .stream().map(r -> r.getStudent()).distinct().toList();

        return classReadMapper.toClassWithStudents(c, students);
    }

    /** GET /api/classes/{id}/registrations → chỉ danh sách student */
    @Transactional(readOnly = true)
    public List<RegisteredStudentBrief> listStudentsOfClass(Long classId) {
        // kiểm tra class tồn tại cho đẹp lỗi
        if (!classesRepo.existsById(classId)) throw new com.teenup.contest.exception.ClassNotFoundException(classId);

        return regsRepo.findAllByClazzIdWithStudent(classId).stream()
                .map(r -> r.getStudent())
                .distinct()
                .map(classReadMapper::toStudentBrief)
                .toList();
    }

    /** GET /api/students/{id}/classes → các class của 1 student */
    @Transactional(readOnly = true)
    public List<StudentClassBrief> listClassesOfStudent(Long studentId) {
        if (!studentsRepo.existsById(studentId)) throw new StudentNotFoundException(studentId);

        return regsRepo.findAllByStudentIdWithClass(studentId).stream()
                .map(r -> r.getClazz())
                .distinct()
                .map(studentReadMapper::toClassBrief)
                .toList();
    }
}

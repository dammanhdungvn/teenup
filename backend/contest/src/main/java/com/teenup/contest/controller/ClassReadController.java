package com.teenup.contest.controller;

import com.teenup.contest.dto.response.ClassWithStudentsResponse;
import com.teenup.contest.dto.response.RegisteredStudentBrief;
import com.teenup.contest.dto.response.StudentClassBrief;
import com.teenup.contest.service.ClassReadService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class ClassReadController {

    private final ClassReadService service;

    // 1) Class detail + students
    @GetMapping("/classes/{classId}")
    public ClassWithStudentsResponse classDetail(@PathVariable Long classId) {
        return service.getClassWithStudents(classId);
    }

    // 2) Students of a class
    @GetMapping("/classes/{classId}/registrations")
    public List<RegisteredStudentBrief> classRegistrations(@PathVariable Long classId) {
        return service.listStudentsOfClass(classId);
    }

    // 3) Classes of a student
    @GetMapping("/students/{studentId}/classes")
    public List<StudentClassBrief> studentClasses(@PathVariable Long studentId) {
        return service.listClassesOfStudent(studentId);
    }
}

package com.teenup.contest.mapper;

import com.teenup.contest.dto.response.ClassWithStudentsResponse;
import com.teenup.contest.dto.response.RegisteredStudentBrief;
import com.teenup.contest.entity.ClassesEntity;
import com.teenup.contest.entity.StudentsEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ClassReadMapper {

    // Student -> brief
    @Mapping(target = "currentGrade", source = "currentGrade")
    RegisteredStudentBrief toStudentBrief(StudentsEntity s);

    // Class + list<Student> -> ClassWithStudentsResponse
    @Mapping(target = "students", source = "students")
    ClassWithStudentsResponse toClassWithStudents(ClassesEntity c, List<StudentsEntity> students);
}

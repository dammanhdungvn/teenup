package com.teenup.contest.service;

import com.teenup.contest.dto.request.CreateStudentRequest;
import com.teenup.contest.dto.response.StudentResponse;
import com.teenup.contest.entity.ParentsEntity;
import com.teenup.contest.entity.StudentsEntity;
import com.teenup.contest.exception.ParentNotFoundException;
import com.teenup.contest.exception.StudentNotFoundException;
import com.teenup.contest.mapper.StudentMapper;
import com.teenup.contest.repository.ParentsRepository;
import com.teenup.contest.repository.StudentsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentService {
    private final StudentsRepository studentsRepo;
    private final ParentsRepository parentsRepo;
    private final StudentMapper mapper;

    @Transactional
    public StudentResponse create(CreateStudentRequest req) {
        ParentsEntity parent = parentsRepo.findById(req.parentId())
                .orElseThrow(() -> new ParentNotFoundException(req.parentId()));

        StudentsEntity entity = mapper.toEntity(req);
        entity.setParent(parent);

        StudentsEntity saved = studentsRepo.save(entity);
        return mapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public StudentResponse getById(Long id) {
        StudentsEntity e = studentsRepo.findById(id)
                .orElseThrow(() -> new StudentNotFoundException(id));
        return mapper.toResponse(e);
    }

    @Transactional(readOnly = true)
    public List<StudentResponse> getAll() {
        return mapper.toResponses(studentsRepo.findAll());
    }
}

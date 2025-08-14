package com.teenup.contest.service;

import com.teenup.contest.dto.request.CreateClassRequest;
import com.teenup.contest.dto.response.ClassResponse;
import com.teenup.contest.entity.ClassesEntity;
import com.teenup.contest.exception.InvalidDayException;
import com.teenup.contest.mapper.ClassMapper;
import com.teenup.contest.repository.ClassesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClassService {

    private final ClassesRepository repo;
    private final ClassMapper mapper;

    @Transactional
    public ClassResponse create(CreateClassRequest req) {
        ClassesEntity saved = repo.save(mapper.toEntity(req));
        return mapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ClassResponse> listByDay(Integer day) {
        if (day != null && (day < 1 || day > 7)) {
            throw new InvalidDayException(day);
        }
        List<ClassesEntity> list = (day == null) ? repo.findAll() : repo.findByDayOfWeek(day);
        return list.stream().map(mapper::toResponse).toList();
    }

    // MỚI: trả entity có fetch join students (phục vụ expand=registrations)
    @Transactional(readOnly = true)
    public List<ClassesEntity> listEntitiesByDay(Integer day) {
        return repo.findAllWithStudentsByDay(day);
    }
}
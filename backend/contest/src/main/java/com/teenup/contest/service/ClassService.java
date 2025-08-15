package com.teenup.contest.service;

import com.teenup.contest.dto.request.CreateClassRequest;
import com.teenup.contest.dto.request.UpdateClassRequest;
import com.teenup.contest.dto.response.ClassResponse;
import com.teenup.contest.entity.ClassesEntity;
import com.teenup.contest.exception.ClassCapacityTooSmallException;
import com.teenup.contest.exception.ClassHasRegistrationsException;
import com.teenup.contest.exception.ClassNotFoundException;
import com.teenup.contest.exception.InvalidDayException;
import com.teenup.contest.mapper.ClassMapper;
import com.teenup.contest.repository.ClassRegistrationsRepository;
import com.teenup.contest.repository.ClassesRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ClassService {

    private final ClassesRepository classesRepo;
    private final ClassRegistrationsRepository regsRepo;
    private final ClassMapper mapper;

    @Transactional
    public ClassResponse create(CreateClassRequest req) {
        ClassesEntity saved = classesRepo.save(mapper.toEntity(req));
        return mapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ClassResponse> listByDay(Integer day) {
        if (day != null && (day < 1 || day > 7)) {
            throw new InvalidDayException(day);
        }
        List<ClassesEntity> list = (day == null) ? classesRepo.findAll() : classesRepo.findByDayOfWeek(day);
        return list.stream().map(mapper::toResponse).toList();
    }

    // MỚI: trả entity có fetch join students (phục vụ expand=registrations)
    @Transactional(readOnly = true)
    public List<ClassesEntity> listEntitiesByDay(Integer day) {
        return classesRepo.findAllWithStudentsByDay(day);
    }

    @Transactional
    public ClassResponse update(Long id, UpdateClassRequest req) {
        ClassesEntity entity = classesRepo.findById(id)
                .orElseThrow(() -> new com.teenup.contest.exception.ClassNotFoundException(id));

        // Nếu giảm maxStudents, phải >= số đăng ký hiện tại
        if (req.maxStudents() != null) {
            long currentRegs = regsRepo.countByClassId(id);
            if (req.maxStudents() < currentRegs) {
                throw new ClassCapacityTooSmallException(req.maxStudents(), currentRegs);
            }
        }

        mapper.updateEntityFromDto(req, entity);
        return mapper.toResponse(entity);
    }

    @Transactional
    public void delete(Long id) {
        ClassesEntity entity = classesRepo.findById(id)
                .orElseThrow(() -> new ClassNotFoundException(id));

        long currentRegs = regsRepo.countByClassId(id);
        if (currentRegs > 0) {
            throw new ClassHasRegistrationsException(id);
        }

        classesRepo.delete(entity);
    }
}
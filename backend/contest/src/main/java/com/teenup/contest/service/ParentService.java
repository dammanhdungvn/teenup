package com.teenup.contest.service;

import com.teenup.contest.dto.request.CreateParentRequest;
import com.teenup.contest.dto.request.UpdateParentRequest;
import com.teenup.contest.dto.response.ParentResponse;
import com.teenup.contest.entity.ParentsEntity;
import com.teenup.contest.exception.ParentHasStudentsException;
import com.teenup.contest.exception.ParentNotFoundException;
import com.teenup.contest.mapper.ParentMapper;
import com.teenup.contest.repository.ParentsRepository;
import com.teenup.contest.repository.StudentsRepository;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ParentService {
    private final ParentsRepository parentsRepo;
    private final StudentsRepository studentsRepo;
    private final ParentMapper mapper;

    @Transactional
    public ParentResponse create(CreateParentRequest req) {
        if (req.email() != null && !req.email().isBlank() && parentsRepo.existsByEmail(req.email())) {
            throw new IllegalArgumentException("Email đã tồn tại");
        }
        ParentsEntity saved = parentsRepo.save(mapper.toEntity(req));
        return mapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public ParentResponse getById(Long id) {
        ParentsEntity e = parentsRepo.findById(id)
                .orElseThrow(() -> new ParentNotFoundException(id));
        return mapper.toResponse(e);
    }

    @Transactional(readOnly = true)
    public List<ParentResponse> getAll() {
        return mapper.toResponses(parentsRepo.findAll());
    }

    @Transactional
    public ParentResponse update(Long id, UpdateParentRequest req) {
        ParentsEntity entity = parentsRepo.findById(id)
                .orElseThrow(() -> new ParentNotFoundException(id));

        mapper.updateEntityFromDto(req, entity);
        // JPA dirty checking tự lưu
        return mapper.toResponse(entity);
    }

    @Transactional
    public void delete(Long id) {
        ParentsEntity entity = parentsRepo.findById(id)
                .orElseThrow(() -> new ParentNotFoundException(id));

        long childCount = studentsRepo.countByParentId(id);
        if (childCount > 0) {
            throw new ParentHasStudentsException(id);
        }

        parentsRepo.delete(entity);
    }
}

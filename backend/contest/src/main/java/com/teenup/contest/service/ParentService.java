package com.teenup.contest.service;

import com.teenup.contest.dto.request.CreateParentRequest;
import com.teenup.contest.dto.request.ReassignStudentsRequest;
import com.teenup.contest.dto.request.UpdateParentRequest;
import com.teenup.contest.dto.response.ParentResponse;
import com.teenup.contest.dto.response.ParentStudentItem;
import com.teenup.contest.dto.response.ReassignResultResponse;
import com.teenup.contest.entity.ParentsEntity;
import com.teenup.contest.entity.StudentsEntity;
import com.teenup.contest.exception.*;
import com.teenup.contest.mapper.ParentMapper;
import com.teenup.contest.mapper.StudentMapper;
import com.teenup.contest.repository.ClassRegistrationsRepository;
import com.teenup.contest.repository.ParentsRepository;
import com.teenup.contest.repository.StudentsRepository;
import com.teenup.contest.repository.SubscriptionsRepository;
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
    private final StudentMapper studentMapper;
    private final ClassRegistrationsRepository regsRepo;
    private final SubscriptionsRepository subsRepo;

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

    @Transactional
    public ReassignResultResponse reassign(Long sourceParentId, ReassignStudentsRequest req) {
        ParentsEntity source = parentsRepo.findById(sourceParentId)
                .orElseThrow(() -> new ParentNotFoundException(sourceParentId));

        Long targetParentId = req.targetParentId();
        if (sourceParentId.equals(targetParentId)) {
            throw new SameParentTargetException(targetParentId);
        }
        ParentsEntity target = parentsRepo.findById(targetParentId)
                .orElseThrow(() -> new ParentNotFoundException(targetParentId));

        int moved;
        if (req.studentIds() == null || req.studentIds().isEmpty()) {
            // chuyển TẤT CẢ
            moved = studentsRepo.reassignAll(source, target);
        } else {
            // xác thực mọi id đều thuộc parent nguồn
            List<Long> invalid = studentsRepo.findIdsNotBelongToParent(req.studentIds(), sourceParentId);
            if (!invalid.isEmpty()) {
                throw new StudentNotBelongToParentException(sourceParentId, invalid);
            }
            moved = studentsRepo.reassignSome(req.studentIds(), source, target);
        }

        long remaining = studentsRepo.countByParentId(sourceParentId);
        return new ReassignResultResponse(sourceParentId, targetParentId, moved, remaining);
    }

    @Transactional(readOnly = true)
    public List<ParentStudentItem> listStudents(Long parentId) {
        // đảm bảo báo lỗi 404 khi parent không tồn tại
        parentsRepo.findById(parentId).orElseThrow(() -> new ParentNotFoundException(parentId));

        return studentsRepo.findAllByParentId(parentId)
                .stream()
                .map(studentMapper::toParentStudentItem)
                .toList();
    }

    /** Xoá học sinh thuộc parent (unassign theo ngữ cảnh parent) */
    @Transactional
    public void deleteChild(Long parentId, Long studentId) {
        // 1) Parent phải tồn tại (để báo 404 đúng ngữ cảnh)
        parentsRepo.findById(parentId).orElseThrow(() -> new ParentNotFoundException(parentId));

        // 2) Student tồn tại?
        StudentsEntity s = studentsRepo.findById(studentId)
                .orElseThrow(() -> new StudentNotFoundException(studentId));

        // 3) Student phải thuộc parentId
        if (s.getParent() == null || !s.getParent().getId().equals(parentId)) {
            throw new StudentNotBelongToParentException(parentId, java.util.List.of(studentId));
        }

        // 4) Ràng buộc an toàn như xoá student trực tiếp
        if (regsRepo.countByStudentId(studentId) > 0) {
            throw new StudentHasRegistrationsException(studentId);
        }
        if (subsRepo.existsActiveByStudent(studentId)) {
            throw new StudentHasActiveSubscriptionsException(studentId);
        }

        // 5) Xoá
        studentsRepo.delete(s);
    }

}

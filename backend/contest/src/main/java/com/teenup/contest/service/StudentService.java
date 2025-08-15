package com.teenup.contest.service;

import com.teenup.contest.dto.request.CreateStudentRequest;
import com.teenup.contest.dto.request.UpdateStudentRequest;
import com.teenup.contest.dto.response.StudentResponse;
import com.teenup.contest.entity.ParentsEntity;
import com.teenup.contest.entity.StudentsEntity;
import com.teenup.contest.exception.*;
import com.teenup.contest.mapper.StudentMapper;
import com.teenup.contest.repository.ClassRegistrationsRepository;
import com.teenup.contest.repository.ParentsRepository;
import com.teenup.contest.repository.StudentsRepository;
import com.teenup.contest.repository.SubscriptionsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class StudentService {
    private final StudentsRepository studentsRepo;
    private final ParentsRepository parentsRepo;
    private final SubscriptionsRepository subsRepo;
    private final ClassRegistrationsRepository regsRepo;
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

    // ✅ Xoá học sinh có ràng buộc
    @Transactional
    public void delete(Long id) {
        StudentsEntity student = studentsRepo.findById(id)
                .orElseThrow(() -> new StudentNotFoundException(id));

        // 1) Còn đăng ký lớp?
        if (regsRepo.countByStudentId(id) > 0) {
            throw new StudentHasRegistrationsException(id);
        }

        // 2) Có gói còn hiệu lực / còn buổi?
        if (subsRepo.existsActiveByStudent(id)) {
            throw new StudentHasActiveSubscriptionsException(id);
        }

        // 3) Xoá
        studentsRepo.delete(student);
    }

    @Transactional
    public StudentResponse update(Long id, UpdateStudentRequest req) {
        StudentsEntity entity = studentsRepo.findById(id)
                .orElseThrow(() -> new StudentNotFoundException(id));

        // validate đơn giản: dob nếu có thì phải là quá khứ
        if (req.dob() != null && req.dob().isAfter(LocalDate.now())) {
            throw new BaseException(ErrorCode.VALIDATION_FAILED, "dob phải là ngày trong quá khứ");
        }

        // map các field != null vào entity
        mapper.updateEntityFromDto(req, entity);

        // xử lý parent nếu có parentId
        if (req.parentId() != null) {
            ParentsEntity parent = parentsRepo.findById(req.parentId())
                    .orElseThrow(() -> new ParentNotFoundException(req.parentId()));
            entity.setParent(parent);
        }

        // JPA dirty checking sẽ flush
        return mapper.toResponse(entity);
    }
}

package com.teenup.contest.service;

import com.teenup.contest.dto.request.CreateSubscriptionRequest;
import com.teenup.contest.dto.response.SubscriptionResponse;
import com.teenup.contest.entity.StudentsEntity;
import com.teenup.contest.entity.SubscriptionsEntity;
import com.teenup.contest.exception.*;
import com.teenup.contest.mapper.SubscriptionMapper;
import com.teenup.contest.repository.StudentsRepository;
import com.teenup.contest.repository.SubscriptionsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SubscriptionService {

    private final SubscriptionsRepository repo;
    private final StudentsRepository studentsRepo;
    private final SubscriptionMapper mapper;

    @Transactional
    public SubscriptionResponse create(CreateSubscriptionRequest req) {
        StudentsEntity student = studentsRepo.findById(req.studentId())
                .orElseThrow(() -> new StudentNotFoundException(req.studentId()));

        if (req.endDate().isBefore(req.startDate())) {
            throw new BaseException(ErrorCode.VALIDATION_FAILED, "endDate phải >= startDate");
        }

        SubscriptionsEntity entity = mapper.toEntity(req);
        entity.setStudent(student);

        SubscriptionsEntity saved = repo.save(entity);
        return mapper.toResponse(saved);
    }

    @Transactional
    public SubscriptionResponse useOne(Long id) {
        SubscriptionsEntity s = repo.findById(id)
                .orElseThrow(() -> new SubscriptionNotFoundException(id));

        LocalDate today = LocalDate.now();
        if (today.isBefore(s.getStartDate()) || today.isAfter(s.getEndDate())) {
            throw new SubscriptionInactiveException(id);
        }
        if (s.getUsedSessions() >= s.getTotalSessions()) {
            throw new NoRemainingSessionsException(id);
        }

        s.setUsedSessions(s.getUsedSessions() + 1);
        // JPA dirty checking sẽ tự flush
        return mapper.toResponse(s);
    }

    @Transactional(readOnly = true)
    public SubscriptionResponse get(Long id) {
        SubscriptionsEntity s = repo.findById(id)
                .orElseThrow(() -> new SubscriptionNotFoundException(id));
        return mapper.toResponse(s);
    }

    @Transactional(readOnly = true)
    public List<SubscriptionResponse> list(Long studentId) {
        List<SubscriptionsEntity> list = (studentId == null)
                ? repo.findAll()
                : repo.findByStudent_Id(studentId);
        return list.stream().map(mapper::toResponse).toList();
    }
}

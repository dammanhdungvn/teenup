package com.teenup.contest.service;

import com.teenup.contest.dto.request.CreateClassRequest;
import com.teenup.contest.dto.request.UpdateClassRequest;
import com.teenup.contest.dto.response.ClassResponse;
import com.teenup.contest.entity.ClassesEntity;
import com.teenup.contest.exception.*;
import com.teenup.contest.exception.ClassNotFoundException;
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

//    @Transactional
//    public ClassResponse update(Long id, UpdateClassRequest req) {
//        ClassesEntity entity = classesRepo.findById(id)
//                .orElseThrow(() -> new com.teenup.contest.exception.ClassNotFoundException(id));
//
//        // Nếu giảm maxStudents, phải >= số đăng ký hiện tại
//        if (req.maxStudents() != null) {
//            long currentRegs = regsRepo.countByClassId(id);
//            if (req.maxStudents() < currentRegs) {
//                throw new ClassCapacityTooSmallException(req.maxStudents(), currentRegs);
//            }
//        }
//
//        mapper.updateEntityFromDto(req, entity);
//        return mapper.toResponse(entity);
//    }

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


    @Transactional
    public ClassResponse update(Long id, UpdateClassRequest req) {
        ClassesEntity entity = classesRepo.findById(id)
                .orElseThrow(() -> new ClassNotFoundException(id));

        // 1) Nếu giảm maxStudents → không < số đăng ký hiện tại
        if (req.maxStudents() != null) {
            long currentRegs = regsRepo.countByClassId(id);
            if (req.maxStudents() < currentRegs) {
                throw new ClassCapacityTooSmallException(req.maxStudents(), currentRegs);
            }
        }

        // 2) Nếu đổi dayOfWeek/timeSlot → kiểm tra conflict với lịch hiện có của học sinh
        Integer targetDay = (req.dayOfWeek() != null) ? req.dayOfWeek() : entity.getDayOfWeek();
        String  targetTS  = (req.timeSlot()  != null) ? req.timeSlot()  : entity.getTimeSlot();

        // Chỉ check nếu có thay đổi (hoặc bạn muốn luôn check cũng được)
        boolean changedDay   = (req.dayOfWeek() != null && !req.dayOfWeek().equals(entity.getDayOfWeek()));
        boolean changedSlot  = (req.timeSlot()  != null && !req.timeSlot().equals(entity.getTimeSlot()));
        if (changedDay || changedSlot) {
            String[] parts = targetTS.split("-");
            if (parts.length != 2) {
                throw new BaseException(ErrorCode.VALIDATION_FAILED, "timeSlot phải dạng HH:mm-HH:mm");
            }
            String start = parts[0].trim();
            String end   = parts[1].trim();

            boolean conflict = regsRepo.existsConflictWhenReschedule(id, targetDay, start, end);
            if (conflict) {
                throw new BaseException(
                        ErrorCode.SCHEDULE_CONFLICT,
                        "Đổi lịch gây trùng với lịch hiện có của học sinh (day=" + targetDay + ", time=" + targetTS + ")"
                );
            }
        }

        // 3) Map các field != null
        mapper.updateEntityFromDto(req, entity);

        return mapper.toResponse(entity);
    }  
}
package com.teenup.contest.service;


import com.teenup.contest.dto.request.RegisterRequest;
import com.teenup.contest.dto.request.UpdateClassRequest;
import com.teenup.contest.dto.response.ClassResponse;
import com.teenup.contest.entity.ClassRegistrationEntity;
import com.teenup.contest.entity.ClassesEntity;
import com.teenup.contest.entity.StudentsEntity;
import com.teenup.contest.exception.*;
import com.teenup.contest.exception.ClassNotFoundException;
import com.teenup.contest.mapper.ClassMapper;
import com.teenup.contest.repository.ClassRegistrationsRepository;
import com.teenup.contest.repository.ClassesRepository;
import com.teenup.contest.repository.StudentsRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ClassRegistrationService {

    private final ClassRegistrationsRepository regRepo;
    private final ClassesRepository classRepo;
    private final StudentsRepository studentRepo;
    @Transactional
    public void register(Long classId, RegisterRequest req) {
        Long studentId = req.studentId();

        ClassesEntity clazz = classRepo.findById(classId)
                .orElseThrow(() -> new ClassNotFoundException(classId));

        StudentsEntity student = studentRepo.findById(studentId)
                .orElseThrow(() -> new StudentNotFoundException(studentId));

        // 1) Trùng đăng ký?
        boolean exists = regRepo.existsByClazzIdAndStudentId(classId, studentId);
        if (exists) throw new AlreadyRegisteredException(classId, studentId);

        // 2) Lớp đã đầy?
        int current = regRepo.countByClazzId(classId);
        if (current >= clazz.getMaxStudents()) throw new ClassFullException(classId);

        // 3) Trùng lịch? (same dayOfWeek && time overlap)
        var regs = regRepo.findAllByStudentIdWithClass(studentId);
        if (hasScheduleConflict(clazz, regs)) {
            throw new ScheduleConflictException("Học sinh " + studentId +
                    " trùng lịch với lớp khác vào " + describeSlot(clazz));
        }

        // 4) Lưu
        regRepo.save(new ClassRegistrationEntity(clazz, student));
    }

    private boolean hasScheduleConflict(ClassesEntity target, List<ClassRegistrationEntity> existingRegs) {
        for (var r : existingRegs) {
            ClassesEntity c = r.getClazz();
            if (c.getDayOfWeek().equals(target.getDayOfWeek())) {
                if (isOverlap(c.getTimeSlot(), target.getTimeSlot())) return true;
            }
        }
        return false;
    }

    // timeSlot format: "HH:mm-HH:mm"
    private boolean isOverlap(String slotA, String slotB) {
        var a = slotA.split("-");
        var b = slotB.split("-");
        LocalTime aStart = LocalTime.parse(a[0]);
        LocalTime aEnd   = LocalTime.parse(a[1]);
        LocalTime bStart = LocalTime.parse(b[0]);
        LocalTime bEnd   = LocalTime.parse(b[1]);

        return aStart.isBefore(bEnd) && bStart.isBefore(aEnd);
    }

    private String describeSlot(ClassesEntity c) {
        return "day=" + c.getDayOfWeek() + ", time=" + c.getTimeSlot();
    }

}

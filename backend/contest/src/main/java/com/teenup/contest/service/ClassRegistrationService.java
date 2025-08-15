package com.teenup.contest.service;


import com.teenup.contest.dto.request.MoveRegistrationRequest;
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


    // Huỷ đăng ký
    @Transactional
    public void unregister(Long classId, Long studentId) {
        var reg = regRepo.findByClassIdAndStudentId(classId, studentId)
                .orElseThrow(() -> new RegistrationNotFoundException(classId, studentId));
        regRepo.delete(reg);
    }

    // Chuyển lớp: từ classId -> targetClassId
    @Transactional
    public void move(Long classId, Long studentId, MoveRegistrationRequest req) {
        var src = classRepo.findById(classId)
                .orElseThrow(() -> new ClassNotFoundException(classId));
        var student = studentRepo.findById(studentId)
                .orElseThrow(() -> new StudentNotFoundException(studentId));

        Long targetId = req.targetClassId();
        if (targetId.equals(classId)) {
            throw new SameClassTargetException(classId);
        }
        var target = classRepo.findById(targetId)
                .orElseThrow(() -> new ClassNotFoundException(targetId));

        // phải đang đăng ký ở classId
        regRepo.findByClassIdAndStudentId(classId, studentId)
                .orElseThrow(() -> new RegistrationNotFoundException(classId, studentId));

        // đã đăng ký lớp đích?
        if (regRepo.existsByClassIdAndStudentId(targetId, studentId)) {
            throw new BaseException(ErrorCode.ALREADY_REGISTERED,
                    "Học sinh đã đăng ký lớp đích: classId=" + targetId);
        }

        // lớp đích còn chỗ?
        long targetCount = regRepo.countByClassId(targetId);
        if (targetCount >= target.getMaxStudents()) {
            throw new BaseException(ErrorCode.CLASS_FULL,
                    "Lớp đích đã đủ: classId=" + targetId);
        }

        // kiểm tra trùng lịch với các lớp khác của học sinh (ngoại trừ lớp nguồn)
        // logic: dayOfWeek trùng & timeSlot overlap
        if (hasScheduleConflict(student, target, classId)) {
            throw new BaseException(ErrorCode.SCHEDULE_CONFLICT,
                    "Trùng lịch khi chuyển sang lớp: day=" + target.getDayOfWeek()
                            + ", time=" + target.getTimeSlot());
        }

        // Thực hiện: xoá đăng ký cũ, thêm đăng ký mới
        regRepo.delete(regRepo.findByClassIdAndStudentId(classId, studentId).get());
        regRepo.save(new ClassRegistrationEntity(target, student));
    }

    // ---- Helper ----
    private boolean hasScheduleConflict(StudentsEntity student, ClassesEntity targetClass, Long ignoreClassId) {
        // Lấy toàn bộ đăng ký của học sinh (có thể tối ưu query riêng)
        // Ở đây tận dụng mapping: student.getRegistrations()
        return student.getRegistrations().stream()
                .filter(r -> !r.getClazz().getId().equals(ignoreClassId))
                .map(r -> r.getClazz())
                .anyMatch(c ->
                        c.getDayOfWeek().equals(targetClass.getDayOfWeek())
                                && isTimeOverlap(c.getTimeSlot(), targetClass.getTimeSlot())
                );
    }

    // timeSlot "HH:mm-HH:mm"
    static boolean isTimeOverlap(String a, String b) {
        String[] A = a.split("-");
        String[] B = b.split("-");
        int aStart = toMinutes(A[0]), aEnd = toMinutes(A[1]);
        int bStart = toMinutes(B[0]), bEnd = toMinutes(B[1]);
        return aStart < bEnd && bStart < aEnd;
    }

    static int toMinutes(String hhmm) {
        var p = hhmm.split(":");
        return Integer.parseInt(p[0]) * 60 + Integer.parseInt(p[1]);
    }
}

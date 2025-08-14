package com.teenup.contest.config;

import com.teenup.contest.entity.*;
import com.teenup.contest.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Profile;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Component
@Profile("dev")
@RequiredArgsConstructor
public class DevDataSeeder implements CommandLineRunner {

    private final ParentsRepository parentsRepo;
    private final StudentsRepository studentsRepo;
    private final ClassesRepository classesRepo;
    private final ClassRegistrationsRepository regsRepo;
    private final SubscriptionsRepository subsRepo;

    @Override
    @Transactional
    public void run(String... args) {
        if (parentsRepo.count() > 0 || studentsRepo.count() > 0 || classesRepo.count() > 0) {
            log.info("[DevDataSeeder] Bỏ qua seed vì database không rỗng.");
            return;
        }
        log.info("[DevDataSeeder] Bắt đầu seed dữ liệu mẫu...");

        // ===== Parents =====
        ParentsEntity p1 = new ParentsEntity();
        p1.setName("Nguyen Van A"); p1.setPhone("0901111111"); p1.setEmail("a@example.com");

        ParentsEntity p2 = new ParentsEntity();
        p2.setName("Tran Thi B");   p2.setPhone("0902222222"); p2.setEmail("b@example.com");

        parentsRepo.saveAll(List.of(p1, p2));

        // ===== Students =====
        StudentsEntity s1 = new StudentsEntity();
        s1.setName("Minh");
        s1.setDob(LocalDate.of(2012, 5, 10));
        s1.setGender(Gender.M);
        s1.setCurrentGrade("Grade 7");
        s1.setParent(p1);

        StudentsEntity s2 = new StudentsEntity();
        s2.setName("Lan");
        s2.setDob(LocalDate.of(2011, 9, 1));
        s2.setGender(Gender.F);
        s2.setCurrentGrade("Grade 8");
        s2.setParent(p1);

        StudentsEntity s3 = new StudentsEntity();
        s3.setName("Hoang");
        s3.setDob(LocalDate.of(2013, 1, 20));
        s3.setGender(Gender.M);
        s3.setCurrentGrade("Grade 6");
        s3.setParent(p2);

        studentsRepo.saveAll(List.of(s1, s2, s3));

        // ===== Classes =====
        ClassesEntity c1 = new ClassesEntity();
        c1.setName("Toán Nâng Cao");
        c1.setSubject("Math");
        c1.setDayOfWeek(2);
        c1.setTimeSlot("14:00-15:30");
        c1.setTeacherName("Thầy A");
        c1.setMaxStudents(20);

        ClassesEntity c2 = new ClassesEntity();
        c2.setName("Tiếng Anh A2");
        c2.setSubject("English");
        c2.setDayOfWeek(4);
        c2.setTimeSlot("08:00-09:30");
        c2.setTeacherName("Cô B");
        c2.setMaxStudents(20);

        ClassesEntity c3 = new ClassesEntity();
        c3.setName("Khoa học Vui");
        c3.setSubject("Science");
        c3.setDayOfWeek(6);
        c3.setTimeSlot("09:00-10:30");
        c3.setTeacherName("Thầy C");
        c3.setMaxStudents(15);

        classesRepo.saveAll(List.of(c1, c2, c3));

        // ===== Registrations (không trùng lịch) =====
        regsRepo.save(new ClassRegistrationEntity(c1, s1)); // Minh -> Toán
        regsRepo.save(new ClassRegistrationEntity(c2, s2)); // Lan  -> Anh

        // ===== Subscriptions =====
        SubscriptionsEntity sub1 = new SubscriptionsEntity();
        sub1.setStudent(s1);
        sub1.setPackageName("Basic-12");
        sub1.setStartDate(LocalDate.of(2025, 8, 1));
        sub1.setEndDate(LocalDate.of(2025, 12, 31));
        sub1.setTotalSessions(12);
        sub1.setUsedSessions(0);

        SubscriptionsEntity sub2 = new SubscriptionsEntity();
        sub2.setStudent(s2);
        sub2.setPackageName("Basic-08");
        sub2.setStartDate(LocalDate.of(2025, 8, 1));
        sub2.setEndDate(LocalDate.of(2025, 11, 30));
        sub2.setTotalSessions(8);
        sub2.setUsedSessions(1);

        subsRepo.saveAll(List.of(sub1, sub2));

        log.info("[DevDataSeeder] Seed dữ liệu mẫu xong.");
    }
}

package com.teenup.contest.controller;

import com.teenup.contest.dto.request.CreateClassRequest;
import com.teenup.contest.dto.request.MoveRegistrationRequest;
import com.teenup.contest.dto.request.UpdateClassRequest;
import com.teenup.contest.dto.response.ClassResponse;
import com.teenup.contest.entity.ClassRegistrationEntity;
import com.teenup.contest.mapper.ClassReadMapper;
import com.teenup.contest.service.ClassRegistrationService;
import com.teenup.contest.service.ClassService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/classes")
public class ClassController {

    private final ClassService service;
    private final ClassReadMapper mapper;
    private final ClassRegistrationService regService;
    // POST /api/classes – tạo lớp mới
    @PostMapping
    public ResponseEntity<ClassResponse> create(@Valid @RequestBody CreateClassRequest req) {
        ClassResponse resp = service.create(req);
        return ResponseEntity.created(URI.create("/api/classes/" + resp.id())).body(resp);
    }

    // GET /api/classes?day={weekday} – danh sách lớp theo ngày
    // (không truyền day => trả tất cả)
    @GetMapping
    public List<ClassResponse> list(@RequestParam(name = "day", required = false) Integer day) {
        return service.listByDay(day);
    }

    @GetMapping(params = "expand=registrations")
    public List<?> list(@RequestParam(name = "day", required = false) Integer day,
                        @RequestParam(name = "expand", required = false) String expand) {
        if ("registrations".equalsIgnoreCase(expand)) {
            // Lấy entity đã fetch join
            var classes = service.listEntitiesByDay(day);
            // Map sang DTO có students
            return classes.stream().map(c ->
                    mapper.toClassWithStudents(
                            c,
                            c.getRegistrations().stream()
                                    .map(ClassRegistrationEntity::getStudent)
                                    .distinct()
                                    .toList()
                    )
            ).toList();
        }
        // Trả gọn như cũ (không students)
        return service.listByDay(day);
    }

    // Cập nhật lớp (partial)
    @PatchMapping("/{id}")
    public ClassResponse update(@PathVariable Long id, @Valid @RequestBody UpdateClassRequest req) {
        return service.update(id, req);
    }

    // Xoá lớp (chặn nếu đang có đăng ký)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    // 1) Huỷ đăng ký một học sinh khỏi lớp
    @DeleteMapping("/{classId}/registrations/{studentId}")
    public ResponseEntity<Void> unregister(@PathVariable Long classId, @PathVariable Long studentId) {
        regService.unregister(classId, studentId);
        return ResponseEntity.noContent().build();
    }

    // 2) Chuyển lớp cho học sinh
    @PatchMapping("/{classId}/registrations/{studentId}")
    public ResponseEntity<Void> move(
            @PathVariable Long classId,
            @PathVariable Long studentId,
            @Valid @RequestBody MoveRegistrationRequest req
    ) {
        regService.move(classId, studentId, req);
        return ResponseEntity.noContent().build();
    }
}

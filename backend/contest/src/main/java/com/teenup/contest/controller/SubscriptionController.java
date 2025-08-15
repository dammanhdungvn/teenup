package com.teenup.contest.controller;

import com.teenup.contest.dto.request.CreateSubscriptionRequest;
import com.teenup.contest.dto.request.ExtendSubscriptionRequest;
import com.teenup.contest.dto.request.UpdateSubscriptionRequest;
import com.teenup.contest.dto.response.SubscriptionResponse;
import com.teenup.contest.service.SubscriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/subscriptions")
public class SubscriptionController {

    private final SubscriptionService service;

    // POST /api/subscriptions – khởi tạo gói học
    @PostMapping
    public ResponseEntity<SubscriptionResponse> create(@Valid @RequestBody CreateSubscriptionRequest req) {
        SubscriptionResponse resp = service.create(req);
        return ResponseEntity.created(URI.create("/api/subscriptions/" + resp.id())).body(resp);
    }

    // PATCH /api/subscriptions/{id}/use – dùng 1 buổi
    @PatchMapping("/{id}/use")
    public SubscriptionResponse use(@PathVariable Long id) {
        return service.useOne(id);
    }

    // GET /api/subscriptions/{id} – trạng thái gói
    @GetMapping("/{id}")
    public SubscriptionResponse get(@PathVariable Long id) {
        return service.get(id);
    }

    @GetMapping
    public List<SubscriptionResponse> list(
            @RequestParam(name = "studentId", required = false) Long studentId
    ) {
        return service.list(studentId); // service.list đã map entity -> DTO
    }

    // ✅ BỔ SUNG: cập nhật partial
    @PatchMapping("/{id}")
    public SubscriptionResponse update(@PathVariable Long id, @Valid @RequestBody UpdateSubscriptionRequest req) {
        return service.update(id, req);
    }

    // ✅ BỔ SUNG: xóa gói
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    // ✅ Reset usedSessions về 0
    @PatchMapping("/{id}/reset-used")
    public SubscriptionResponse resetUsed(@PathVariable Long id) {
        return service.resetUsed(id);
    }

    // ✅ Extend: cộng thêm buổi và/hoặc gia hạn endDate
    @PatchMapping("/{id}/extend")
    public SubscriptionResponse extend(@PathVariable Long id,
                                       @Valid @RequestBody ExtendSubscriptionRequest req) {
        return service.extend(id, req);
    }
}


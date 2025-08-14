package com.teenup.contest.controller;

import com.teenup.contest.dto.request.CreateSubscriptionRequest;
import com.teenup.contest.dto.response.SubscriptionResponse;
import com.teenup.contest.service.SubscriptionService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

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
}


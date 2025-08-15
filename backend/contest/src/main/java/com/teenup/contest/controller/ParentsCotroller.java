package com.teenup.contest.controller;

import com.teenup.contest.dto.request.CreateParentRequest;
import com.teenup.contest.dto.request.ReassignStudentsRequest;
import com.teenup.contest.dto.request.UpdateParentRequest;
import com.teenup.contest.dto.response.ParentResponse;
import com.teenup.contest.dto.response.ReassignResultResponse;
import com.teenup.contest.service.ParentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/parents")
public class ParentsCotroller {
    private final ParentService service;
    @PostMapping
    public ResponseEntity<ParentResponse> create(@Valid @RequestBody CreateParentRequest req) {
        ParentResponse resp = service.create(req);
        return ResponseEntity.created(URI.create("/api/parents/" + resp.id())).body(resp);
    }

    // GET /api/parents/{id} – xem chi tiết
    @GetMapping("/{id}")
    public ResponseEntity<ParentResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("list")
    public ResponseEntity<List<ParentResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    // Cập nhật 1 phần thông tin phụ huynh
    @PatchMapping("/{id}")
    public ParentResponse update(@PathVariable Long id, @Valid @RequestBody UpdateParentRequest req) {
        return service.update(id, req);
    }

    // Xóa phụ huynh (chặn nếu còn học sinh)
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }

    // PATCH /api/parents/{sourceParentId}/reassign
    @PatchMapping("/{sourceParentId}/reassign")
    public ReassignResultResponse reassign(
            @PathVariable Long sourceParentId,
            @Valid @RequestBody ReassignStudentsRequest req
    ) {
        return service.reassign(sourceParentId, req);
    }
}

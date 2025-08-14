package com.teenup.contest.controller;

import com.teenup.contest.dto.request.CreateParentRequest;
import com.teenup.contest.dto.response.ParentResponse;
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
}

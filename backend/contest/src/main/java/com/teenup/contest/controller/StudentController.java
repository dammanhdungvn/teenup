package com.teenup.contest.controller;

import com.teenup.contest.dto.request.CreateStudentRequest;
import com.teenup.contest.dto.response.StudentResponse;
import com.teenup.contest.service.StudentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;
import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("api/students")
public class StudentController {
    private final StudentService service;
    @PostMapping
    public ResponseEntity<StudentResponse> create(@Valid @RequestBody CreateStudentRequest req) {
        StudentResponse resp = service.create(req);
        return ResponseEntity.created(URI.create("/api/students/" + resp.id())).body(resp);
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudentResponse> get(@PathVariable Long id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("list")
    public  ResponseEntity<List<StudentResponse>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }
}

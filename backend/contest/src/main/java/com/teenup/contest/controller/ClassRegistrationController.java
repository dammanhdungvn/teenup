package com.teenup.contest.controller;

import com.teenup.contest.dto.request.RegisterRequest;
import com.teenup.contest.service.ClassRegistrationService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/classes")
public class ClassRegistrationController {

    private final ClassRegistrationService service;

    @PostMapping("/{classId}/register")
    public ResponseEntity<Void> register(@PathVariable("classId") Long classId,
                                         @Valid @RequestBody RegisterRequest req) {
        service.register(classId, req);
        return ResponseEntity.noContent().build(); // 204 No Content
    }
}

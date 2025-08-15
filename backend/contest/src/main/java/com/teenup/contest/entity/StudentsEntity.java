package com.teenup.contest.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;

import java.time.LocalDate;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Entity
@Table(name = "students")
public class StudentsEntity extends BaseAuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank @Size(max = 100)
    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @NotNull @Past
    @Column(name = "dob", nullable = false)
    private LocalDate dob;

    @NotNull
    @Enumerated(EnumType.STRING)
    @Column(name = "gender", nullable = false, length = 1)
    private Gender gender;

    @NotBlank @Size(max = 50)
    @Column(name = "current_grade", nullable = false, length = 50)
    private String currentGrade;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "parent_id", nullable = true,
            foreignKey = @ForeignKey(name = "fk_student_parent"))
    private ParentsEntity parent;

    // N - N qua bảng trung gian (1 student có nhiều registrations)
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ClassRegistrationEntity> registrations = new LinkedHashSet<>();

    // 1 - N Subscriptions
    @OneToMany(mappedBy = "student", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<SubscriptionsEntity> subscriptions = new LinkedHashSet<>();
}
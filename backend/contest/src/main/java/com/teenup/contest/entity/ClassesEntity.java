package com.teenup.contest.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.*;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor @AllArgsConstructor
@Entity
@Table(name = "classes")
public class ClassesEntity extends BaseAuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank @Size(max = 100)
    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @NotBlank @Size(max = 100)
    @Column(name = "subject", nullable = false, length = 100)
    private String subject;

    /** 1 = Mon … 7 = Sun */
    @NotNull @Min(1) @Max(7)
    @Column(name = "day_of_week", nullable = false)
    private Integer dayOfWeek;

    /** "HH:mm-HH:mm" */
    @NotBlank @Size(max = 20)
    @Pattern(regexp = "^\\d{2}:\\d{2}-\\d{2}:\\d{2}$", message = "time_slot phải dạng HH:mm-HH:mm")
    @Column(name = "time_slot", nullable = false, length = 20)
    private String timeSlot;

    @NotBlank @Size(max = 100)
    @Column(name = "teacher_name", nullable = false, length = 100)
    private String teacherName;

    @NotNull @Min(1)
    @Column(name = "max_students", nullable = false)
    private Integer maxStudents;

    // 1 class có nhiều registrations
    @OneToMany(mappedBy = "clazz", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<ClassRegistrationEntity> registrations = new LinkedHashSet<>();
}
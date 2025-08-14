package com.teenup.contest.entity;
import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;
import java.util.LinkedHashSet;
import java.util.Set;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Entity
@Table(name = "parents",
        uniqueConstraints = @UniqueConstraint(name = "uk_parent_email", columnNames = "email"))
public class ParentsEntity extends BaseAuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank @Size(max = 100)
    @Column(name = "name", nullable = false, length = 100)
    private String name;

    @NotBlank @Size(max = 20)
    @Column(name = "phone", nullable = false, length = 20)
    private String phone;

    @Email @Size(max = 100)
    @Column(name = "email", length = 100)
    private String email;

    // 1 - N Students
    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<StudentsEntity> students = new LinkedHashSet<>();
}
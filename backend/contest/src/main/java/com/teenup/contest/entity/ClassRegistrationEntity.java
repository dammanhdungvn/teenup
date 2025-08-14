package com.teenup.contest.entity;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "class_registrations",
        uniqueConstraints = @UniqueConstraint(name = "uk_class_student",
                columnNames = {"class_id","student_id"}),
        indexes = {
                @Index(name = "idx_reg_class", columnList = "class_id"),
                @Index(name = "idx_reg_student", columnList = "student_id")
        })
public class ClassRegistrationEntity extends BaseAuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "class_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_reg_class"))
    private ClassesEntity clazz;

    @NotNull
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id", nullable = false,
            foreignKey = @ForeignKey(name = "fk_reg_student"))
    private StudentsEntity student;

    public ClassRegistrationEntity(ClassesEntity clazz, StudentsEntity student) {
        this.clazz = clazz;
        this.student = student;
    }
}

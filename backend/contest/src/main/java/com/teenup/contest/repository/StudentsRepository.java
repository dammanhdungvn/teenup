package com.teenup.contest.repository;

import com.teenup.contest.entity.ParentsEntity;
import com.teenup.contest.entity.StudentsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;
import java.util.List;

public interface StudentsRepository extends JpaRepository<StudentsEntity, Long> {
    @Query("SELECT COUNT(s) FROM StudentsEntity s WHERE s.parent.id = :parentId")
    long countByParentId(Long parentId);

    @Query("SELECT s.id FROM StudentsEntity s WHERE s.parent.id = :parentId")
    List<Long> findIdsByParentId(Long parentId);

    @Query("""
        SELECT s.id FROM StudentsEntity s
        WHERE s.id IN :studentIds AND s.parent.id <> :parentId
    """)
    List<Long> findIdsNotBelongToParent(Collection<Long> studentIds, Long parentId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
        UPDATE StudentsEntity s
        SET s.parent = :target
        WHERE s.parent = :source
    """)
    int reassignAll(ParentsEntity source, ParentsEntity target);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("""
        UPDATE StudentsEntity s
        SET s.parent = :target
        WHERE s.id IN :studentIds AND s.parent = :source
    """)
    int reassignSome(Collection<Long> studentIds, ParentsEntity source, ParentsEntity target);
}

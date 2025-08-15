package com.teenup.contest.mapper;

import com.teenup.contest.dto.request.CreateStudentRequest;
import com.teenup.contest.dto.request.UpdateStudentRequest;
import com.teenup.contest.dto.response.ParentBrief;
import com.teenup.contest.dto.response.ParentResponse;
import com.teenup.contest.dto.response.ParentStudentItem;
import com.teenup.contest.dto.response.StudentResponse;
import com.teenup.contest.entity.ParentsEntity;
import com.teenup.contest.entity.StudentsEntity;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface StudentMapper {
    // DTO -> Entity (parent sẽ set trong service)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "parent", ignore = true)
    @Mapping(target = "registrations", ignore = true)
    @Mapping(target = "subscriptions", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    StudentsEntity toEntity(CreateStudentRequest req);

    // Entity -> DTO
    @Mapping(target = "parent", source = "parent")
    StudentResponse toResponse(StudentsEntity entity);

    // Map parent -> ParentBrief
    ParentBrief toBrief(ParentsEntity parent);

    List<StudentResponse> toResponses(List<StudentsEntity> list);

    // ✅ PATCH: chỉ map các field != null
    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(UpdateStudentRequest req, @MappingTarget StudentsEntity entity);

    ParentStudentItem toParentStudentItem(StudentsEntity e);
}

package com.teenup.contest.mapper;


import com.teenup.contest.dto.request.CreateClassRequest;
import com.teenup.contest.dto.request.UpdateClassRequest;
import com.teenup.contest.dto.response.ClassResponse;
import com.teenup.contest.entity.ClassesEntity;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ClassMapper {

    // DTO -> Entity (create)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "registrations", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    ClassesEntity toEntity(CreateClassRequest req);

    // Entity -> DTO
    ClassResponse toResponse(ClassesEntity e);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(UpdateClassRequest req, @MappingTarget ClassesEntity entity);
}
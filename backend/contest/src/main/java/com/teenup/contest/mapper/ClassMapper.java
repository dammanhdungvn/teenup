package com.teenup.contest.mapper;


import com.teenup.contest.dto.request.CreateClassRequest;
import com.teenup.contest.dto.response.ClassResponse;
import com.teenup.contest.entity.ClassesEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

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

//    List<ClassResponse> toResponses(List<ClassesEntity> e);
}
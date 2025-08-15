package com.teenup.contest.mapper;

import com.teenup.contest.dto.request.CreateParentRequest;
import com.teenup.contest.dto.request.UpdateParentRequest;
import com.teenup.contest.dto.response.ParentResponse;
import com.teenup.contest.entity.ParentsEntity;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ParentMapper {
    //DTO -> Entity
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "students", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    ParentsEntity toEntity(CreateParentRequest req);

    // Entity -> DTO
    ParentResponse toResponse(ParentsEntity e);

    List<ParentResponse> toResponses(List<ParentsEntity> list);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateEntityFromDto(UpdateParentRequest req, @MappingTarget ParentsEntity entity);
}

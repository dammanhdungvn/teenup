package com.teenup.contest.mapper;


import com.teenup.contest.dto.request.CreateSubscriptionRequest;
import com.teenup.contest.dto.response.SubscriptionResponse;
import com.teenup.contest.entity.SubscriptionsEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface SubscriptionMapper {

    // DTO -> Entity (student sẽ set ở service)
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "student", ignore = true)
    @Mapping(target = "usedSessions", constant = "0")
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "version", ignore = true)
    SubscriptionsEntity toEntity(CreateSubscriptionRequest req);

    // Entity -> DTO
    @Mapping(target = "studentId", source = "student.id")
    @Mapping(target = "remainingSessions", expression = "java(e.getTotalSessions() - e.getUsedSessions())")
    SubscriptionResponse toResponse(SubscriptionsEntity e);
}

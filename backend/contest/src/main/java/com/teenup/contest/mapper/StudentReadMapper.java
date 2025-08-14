package com.teenup.contest.mapper;

import com.teenup.contest.dto.response.StudentClassBrief;
import com.teenup.contest.entity.ClassesEntity;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface StudentReadMapper {
    StudentClassBrief toClassBrief(ClassesEntity c);
}

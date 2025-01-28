package com.POSproject.posproject.assemblers

import com.POSproject.posproject.controllers.SubjectController
import com.POSproject.posproject.controllers.TeacherController
import com.POSproject.posproject.dto.SubjectDTO
import com.POSproject.posproject.dto.TeacherDTO
import com.POSproject.posproject.dto.TeacherDTOWrapper
import com.POSproject.posproject.enums.SubjectCategory
import com.POSproject.posproject.enums.SubjectType
import com.POSproject.posproject.enums.TestType
import org.springframework.stereotype.Component
import org.springframework.hateoas.server.RepresentationModelAssembler
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder

@Component
class TeacherDTOAssembler : RepresentationModelAssembler<TeacherDTO, TeacherDTOWrapper> {

    override fun toModel(teacherDTO: TeacherDTO): TeacherDTOWrapper {

        val teacherDTOWrapper = TeacherDTOWrapper(teacherDTO)

        teacherDTOWrapper.add(
            WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(TeacherController::class.java)
                    .getTeacherById(null, teacherDTO.id.toString())
            ).withSelfRel())


        teacherDTOWrapper.add(
            WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(TeacherController::class.java)
                    .getTeachers(null)
            ).withRel("parent"))

        teacherDTOWrapper.add(
            WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(TeacherController::class.java)
                    .getTeacherById(null, teacherDTO.id.toString())
            ).withRel("get"))

        teacherDTOWrapper.add(
            WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(TeacherController::class.java)
                    .getTeachersByName(null, teacherDTO.name)
            ).withRel("search_by_name"))

        teacherDTOWrapper.add(
            WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(TeacherController::class.java)
                    .getTeachersByRank(null, teacherDTO.didacticGrade.toString())
            ).withRel("search_by_rank"))

        teacherDTOWrapper.add(
            WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(TeacherController::class.java)
                    .deleteTeacher(null, teacherDTO.id.toString())
            ).withRel("delete"))

        teacherDTOWrapper.add(
            WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(TeacherController::class.java)
                    .updateTeacher(null, teacherDTO.id.toString(), null)
            ).withRel("update"))

        teacherDTOWrapper.add(
            WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(TeacherController::class.java)
                    .addTeacher(null, null)
            ).withRel("create"))

        teacherDTOWrapper.add(
            WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(TeacherController::class.java)
                    .getTeacherSubjects(null, teacherDTO.id.toString())
            ).withRel("subjects_owned"))

        teacherDTOWrapper.add(
            WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(SubjectController::class.java)
                    .upcertSubject(null, "", SubjectDTO("", "", 0,
                        SubjectType.OBLIGATORIE, TestType.EXAMEN, SubjectCategory.DOMENIU, 0, 1 ))
            ).withRel("update_create_subject"))

        return teacherDTOWrapper
    }
}

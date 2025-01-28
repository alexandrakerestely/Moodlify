package com.POSproject.posproject.assemblers

import com.POSproject.posproject.controllers.SubjectController
import com.POSproject.posproject.controllers.TeacherController
import com.POSproject.posproject.dto.SubjectDTO
import com.POSproject.posproject.dto.SubjectDTOWrapper
import org.springframework.hateoas.server.RepresentationModelAssembler
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder
import org.springframework.stereotype.Component
import org.springframework.hateoas.Link

@Component
class SubjectDTOAssembler : RepresentationModelAssembler<SubjectDTO, SubjectDTOWrapper> {

    override fun toModel(subjectDTO : SubjectDTO): SubjectDTOWrapper {

        val subjectDTOWrapper = SubjectDTOWrapper(subjectDTO)

        subjectDTOWrapper.add(
            WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(SubjectController::class.java)
                    .getSubjectById(null, subjectDTO.cod)
            ).withSelfRel())

        subjectDTOWrapper.add(
            WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(SubjectController::class.java)
                    .getSubjects(null)
            ).withRel("parent"))

        subjectDTOWrapper.add(
            WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(SubjectController::class.java)
                    .getSubjectsByTypeAndCategory(null,subjectDTO.subjectType.toString(),subjectDTO.subjectCategory.toString())
            ).withRel("search_by_type_and_category"))

        subjectDTOWrapper.add(
            WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(TeacherController::class.java)
                    .getTeacherById(null, subjectDTO.teacherId.toString())
            ).withRel("owner_teacher"))

        subjectDTOWrapper.add(
            WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(SubjectController::class.java)
                    .getSubjectById(null, subjectDTO.cod)
            ).withRel("get"))

        subjectDTOWrapper.add(
            WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(SubjectController::class.java)
                    .upcertSubject(null, subjectDTO.cod, subjectDTO)
            ).withRel("update_create"))

        subjectDTOWrapper.add(
            WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(SubjectController::class.java)
                    .deleteSubject(null, subjectDTO.cod)
            ).withRel("delete"))

        subjectDTOWrapper.add(
            WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(SubjectController::class.java)
                    .getSubjectStudents(null, subjectDTO.cod)
            ).withRel("get_subject_students"))

        val fastApiLink = Link.of("http://subjects-service:8000/subjects/getByCode/${subjectDTO.cod}").withRel("subject_materials")
        subjectDTOWrapper.add(fastApiLink)

        return subjectDTOWrapper
    }
}
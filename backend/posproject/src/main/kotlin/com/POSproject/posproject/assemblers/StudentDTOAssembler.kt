package com.POSproject.posproject.assemblers

import com.POSproject.posproject.controllers.StudentController
import com.POSproject.posproject.dto.StudentDTO
import com.POSproject.posproject.dto.StudentDTOWrapper
import org.springframework.hateoas.server.RepresentationModelAssembler
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder
import org.springframework.stereotype.Component

@Component
class StudentDTOAssembler : RepresentationModelAssembler<StudentDTO, StudentDTOWrapper> {

    override fun toModel(studentDTO: StudentDTO): StudentDTOWrapper {

        val studentDTOWrapper = StudentDTOWrapper(studentDTO)

        studentDTOWrapper.add(
            WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(StudentController::class.java)
                    .getStudentById(null, studentDTO.id.toString())
            ).withSelfRel())

        studentDTOWrapper.add(
            WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(StudentController::class.java)
                    .getStudents(null)
            ).withRel("parent"))

        studentDTOWrapper.add(
            WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(StudentController::class.java)
                    .getStudentById(null, studentDTO.id.toString())
            ).withRel("get"))

        studentDTOWrapper.add(
            WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(StudentController::class.java)
                    .addStudent(null, null)
            ).withRel("create"))

        studentDTOWrapper.add(
            WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(StudentController::class.java)
                    .updateStudent(null, studentDTO.id.toString(), null)
            ).withRel("update"))

        studentDTOWrapper.add(
            WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(StudentController::class.java)
                    .deleteStudent(null, studentDTO.id.toString())
            ).withRel("delete"))

        studentDTOWrapper.add(
            WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(StudentController::class.java)
                    .getStudentSubjects(null, studentDTO.id.toString())
            ).withRel("joined_subjects"))

        return studentDTOWrapper
    }
}
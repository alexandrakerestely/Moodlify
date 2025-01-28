package com.POSproject.posproject.dto

import com.POSproject.posproject.entity.Student
import com.POSproject.posproject.enums.StudyCycle
import org.springframework.hateoas.RepresentationModel
import org.springframework.hateoas.server.core.Relation

data class StudentDTO (
    val surname : String,
    val name : String,
    val email : String,
    val group : String,
    val studyYear : Int,
    val studyCycle: StudyCycle,
    val id : Int,
    var joinedSubjects : List<String>
)

fun StudentDTO.toEntity() = Student(
    this.surname,
    this.name,
    this.email,
    this.group,
    this.studyYear,
    this.studyCycle
)

@Relation(collectionRelation = "students")
data class StudentDTOWrapper(

    val studentDTO: StudentDTO
) : RepresentationModel<StudentDTOWrapper>()
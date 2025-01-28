package com.POSproject.posproject.dto

import com.POSproject.posproject.entity.Teacher
import com.POSproject.posproject.enums.DidacticGrade
import com.POSproject.posproject.enums.ProfessorType

data class TeacherAddDTO (

    val surname : String,

    val name : String,

    val email : String,

    val affiliation : String,

    val didacticGrade : DidacticGrade,

    val professorType : ProfessorType,

)

fun TeacherAddDTO.toEntity() = Teacher(
    surname = this.surname,
    name = this.name,
    email = this.email,
    affiliation = this.affiliation,
    didacticGrade = this.didacticGrade,
    professorType = this.professorType,

    )

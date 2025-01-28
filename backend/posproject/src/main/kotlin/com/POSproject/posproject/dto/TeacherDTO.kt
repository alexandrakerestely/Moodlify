package com.POSproject.posproject.dto

import com.POSproject.posproject.entity.Teacher
import com.POSproject.posproject.enums.DidacticGrade
import com.POSproject.posproject.enums.ProfessorType
import org.springframework.hateoas.RepresentationModel
import org.springframework.hateoas.server.core.Relation

data class TeacherDTO (

    val surname : String,

    val name : String,

    val email : String,

    val affiliation : String,

    val didacticGrade : DidacticGrade,

    val professorType : ProfessorType,

    val id : Int,

    var subjectsOwned : List<String>  //id of owned subjects (cod - string)
)

fun TeacherDTO.toEntity() = Teacher(
        surname = this.surname,
        name = this.name,
        email = this.email,
        affiliation = this.affiliation,
        didacticGrade = this.didacticGrade,
        professorType = this.professorType,

)


@Relation(collectionRelation = "teachers")
data class TeacherDTOWrapper(

    val teacherDTO: TeacherDTO
) : RepresentationModel<TeacherDTOWrapper>()

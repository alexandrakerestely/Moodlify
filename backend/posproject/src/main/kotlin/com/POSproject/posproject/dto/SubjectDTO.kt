package com.POSproject.posproject.dto

import com.POSproject.posproject.enums.SubjectCategory
import com.POSproject.posproject.enums.SubjectType
import com.POSproject.posproject.enums.TestType
import com.POSproject.posproject.entity.Subject
import org.springframework.hateoas.RepresentationModel
import org.springframework.hateoas.server.core.Relation

data class SubjectDTO (
    var cod : String,
    val name : String,
    val studyYear : Int,
    val subjectType : SubjectType,
    val testType : TestType,
    val subjectCategory : SubjectCategory,
    val creditsNumber : Int,
    val teacherId : Int
)

fun SubjectDTO.toEntity() = Subject(
    this.name,
    this.studyYear,
    this.subjectType,
    this.testType,
    this.subjectCategory,
    this.creditsNumber,
    this.cod
)

@Relation(collectionRelation = "subjects")
data class SubjectDTOWrapper(
    val subjectDTO  : SubjectDTO
) : RepresentationModel<SubjectDTOWrapper>()
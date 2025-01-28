package com.POSproject.posproject.dto

import com.POSproject.posproject.entity.Teacher
import com.POSproject.posproject.enums.SubjectCategory
import com.POSproject.posproject.enums.SubjectType
import com.POSproject.posproject.enums.TestType
import org.springframework.hateoas.RepresentationModel
import org.springframework.hateoas.server.core.Relation

class SubjectTransferDTO (

    var cod : String,
    val name : String,
    val studyYear : Int,
    val subjectType : SubjectType,
    val testType : TestType,
    val subjectCategory : SubjectCategory,
    val creditsNumber : Int,
    val teacherId : Int
)


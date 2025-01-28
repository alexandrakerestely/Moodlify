package com.POSproject.posproject.dto

import com.POSproject.posproject.entity.Student
import com.POSproject.posproject.enums.StudyCycle

data class StudentAddDTO (
    val surname : String,
    val name : String,
    val email : String,
    val group : String,
    val studyYear : Int,
    val studyCycle: StudyCycle,
    var joinedSubjects : List<String>
)


fun StudentAddDTO.toEntity() = Student(
    this.surname,
    this.name,
    this.email,
    this.group,
    this.studyYear,
    this.studyCycle
)
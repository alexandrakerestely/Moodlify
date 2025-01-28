package com.POSproject.posproject.repository

import com.POSproject.posproject.entity.Teacher
import com.POSproject.posproject.enums.DidacticGrade
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface TeacherRepository : JpaRepository<Teacher, Long> {

    fun findById(id: Int): Optional<Teacher>
    fun findByName(name: String): Optional<Teacher>
    fun findBySurname(surname: String): Optional<Teacher>
    fun findByEmail(email: String): Optional<Teacher>
    fun findByDidacticGrade(didacticGrade: DidacticGrade): List<Teacher>
    fun findTeachersByName(name : String) : List<Teacher>
    fun deleteById(id: Int) : Optional<Teacher>
}
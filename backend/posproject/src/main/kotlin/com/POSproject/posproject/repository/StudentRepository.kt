package com.POSproject.posproject.repository

import com.POSproject.posproject.entity.Student
import org.springframework.data.jpa.repository.JpaRepository
import java.util.*

interface StudentRepository : JpaRepository<Student, Long> {

    fun findByEmail(email: String): Optional<Student>
    fun findByName(name: String): Optional<Student>
    fun findBySurname(surname: String): Optional<Student>
}
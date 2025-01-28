package com.POSproject.posproject.repository

import com.POSproject.posproject.entity.Student
import com.POSproject.posproject.entity.Subject
import com.POSproject.posproject.enums.SubjectCategory
import com.POSproject.posproject.enums.SubjectType
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param
import org.springframework.transaction.annotation.Transactional
import java.util.*

interface SubjectRepository: JpaRepository<Subject, String> {

    fun findByTeacherId(teacherId: Int): List<Subject>
    fun findByCod(cod: String): Optional<Subject>
    fun findByName(name: String): Optional<Subject>
    fun findBySubjectTypeAndSubjectCategory(subjectType: SubjectType, subjectCategory: SubjectCategory): List<Subject>

    fun existsByCod(cod: String): Boolean
    @Modifying
    @Transactional
    @Query("DELETE FROM Subject s WHERE s.cod = :cod")
    fun deleteByCod(@Param("cod") cod: String): Int

    @Query("SELECT s FROM Subject s")
    fun findAllSubjects(pageable: Pageable): Page<Subject>
}
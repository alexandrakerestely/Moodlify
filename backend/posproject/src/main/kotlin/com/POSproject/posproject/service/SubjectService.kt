package com.POSproject.posproject.service

import com.POSproject.posproject.dto.SubjectDTO
import com.POSproject.posproject.dto.toEntity
import com.POSproject.posproject.entity.Subject
import com.POSproject.posproject.entity.toDTO
import com.POSproject.posproject.enums.SubjectType
import com.POSproject.posproject.enums.SubjectCategory
import com.POSproject.posproject.exceptions.SubjectConflictException
import com.POSproject.posproject.exceptions.SubjectNotFoundException
import com.POSproject.posproject.exceptions.SubjectUnprocessableContentException
import com.POSproject.posproject.exceptions.TeacherNotFoundException
import com.POSproject.posproject.repository.SubjectRepository
import com.POSproject.posproject.repository.TeacherRepository
import jakarta.transaction.Transactional
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import java.util.*

@Service
public class SubjectService {
    @Autowired
    private lateinit var teacherRepository: TeacherRepository

    @Autowired
    private lateinit var subjectRepository : SubjectRepository

    fun getPaginatedSubjects(page: Int, itemsPerPage: Int): Page<SubjectDTO>
    {
        val pageable: Pageable = PageRequest.of(page, itemsPerPage)
        val subjectPage: Page<Subject> = subjectRepository.findAllSubjects(pageable)

        return subjectPage.map { it.toDTO() }
    }

    fun getTeacherSubjects(id: String): List<SubjectDTO> {

        val subjects : List<Subject> = subjectRepository.findByTeacherId(id.toInt())
        val subjectsDTO : MutableList<SubjectDTO> = mutableListOf<SubjectDTO>()

        for(subject in subjects)
        {
            subjectsDTO.add(subject.toDTO())
        }

        return subjectsDTO
    }

    fun findSubjectsByTeacherId(id: Int): List<String> {

        val subjects : List<Subject> = subjectRepository.findByTeacherId(id)
        var subjectsID : List<String> = mutableListOf()

        subjectsID = subjects.map { it.cod }

       return subjectsID
    }

    fun getAllSubjects() : List<SubjectDTO> {

        val subjects = subjectRepository.findAll()

        return subjects.map { it.toDTO() }
    }

    fun getSubjectByCode(cod: String): SubjectDTO? {

        val subject : Optional<Subject> = subjectRepository.findByCod(cod)

        if(subject.isPresent)
        {
            val subjectDto = subject.get().toDTO()

            return subjectDto
        }
        else return null
    }

    fun addSubject(subject : SubjectDTO) : SubjectDTO? {

        var created : Boolean = false
        if(subject.creditsNumber < 0 ||
            subject.studyYear < 0 || subject.studyYear > 4 ||
            subject.cod.length != 6 ||
            subject.cod.substring(0,3).contains(Regex(pattern = "[0-9]+")) ||
            subject.cod.substring(3,6).contains(Regex(pattern = "^[A-Za-z]+$"))
        )
            throw SubjectUnprocessableContentException("Subject data does not correspond with formatting rules")

        val subjectEntity : Subject

        if(subjectRepository.findByCod(subject.cod).isPresent)
        {
            //update
            val existingSubject = subjectRepository.findByCod(subject.cod)

            subjectEntity = existingSubject.get()

            val oldTeacher = subjectEntity.teacher

            oldTeacher?.subjects?.remove(subjectEntity)

            subjectEntity.name = subject.name
            subjectEntity.subjectType = subject.subjectType
            subjectEntity.subjectCategory = subject.subjectCategory
            subjectEntity.studyYear = subject.studyYear
            subjectEntity.creditsNumber = subject.creditsNumber
            subjectEntity.testType = subject.testType


        }
        else
        {
            if(subjectRepository.findByName(subject.name).isPresent)
                throw SubjectConflictException("Subject already exists with these details.")

            //add
            subjectEntity = subject.toEntity()

            created = true

        }

        val teacherEntity = teacherRepository.findById(subject.teacherId)
            .orElseThrow { TeacherNotFoundException("Teacher with ID ${subject.teacherId} not found") }

        subjectEntity.teacher = teacherEntity

        teacherEntity.subjects.add(subjectEntity)

        teacherRepository.save(teacherEntity)

        val resultEntity : Subject = subjectRepository.save(subjectEntity)

        if(created)
            return resultEntity.toDTO()
        return null
    }
    @Transactional
    fun deleteSubject(cod: String) : Int
    {

        if (subjectRepository.existsByCod(cod)) {
            subjectRepository.deleteByCod(cod) != 0
            return 1
        } else {
            return -1
        }
    }

    fun getSubjectEntityByCode(cod : String) : Subject
    {
        val subject = subjectRepository.findByCod(cod)

        if(subject.isPresent)
            return subject.get()
        else throw SubjectNotFoundException("Subject with code $cod not found")
    }

    fun getSubjectsByTypeAndCategory(type: String, category: String): List<SubjectDTO> {
        val subjectType = try {
            SubjectType.valueOf(type.uppercase())
        } catch (e: IllegalArgumentException) {
            throw IllegalArgumentException("Invalid type: $type")
        }

        val subjectCategory = try {
            SubjectCategory.valueOf(category.uppercase())
        } catch (e: IllegalArgumentException) {
            throw IllegalArgumentException("Invalid category: $category")
        }

        return subjectRepository.findBySubjectTypeAndSubjectCategory(subjectType, subjectCategory)
            .map { it.toDTO() }
    }

}
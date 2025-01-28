package com.POSproject.posproject.service

import com.POSproject.posproject.dto.*
import com.POSproject.posproject.entity.*
import com.POSproject.posproject.enums.DidacticGrade
import com.POSproject.posproject.exceptions.StudentNotFoundException
import com.POSproject.posproject.exceptions.TeacherConflictException
import com.POSproject.posproject.exceptions.TeacherUnprocessableContentException
import com.POSproject.posproject.exceptions.TeacherNotFoundException
import com.POSproject.posproject.repository.SubjectRepository
import com.POSproject.posproject.repository.TeacherRepository
import jakarta.transaction.Transactional
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.web.bind.annotation.RequestBody
import java.util.*

@Service
public class TeacherService {

    @Autowired
    private lateinit var subjectRepository: SubjectRepository

    @Autowired
    private lateinit var teacherRepository : TeacherRepository

    public fun getTeacherById(id: String): TeacherDTO? {

        val teacher : Optional<Teacher> = teacherRepository.findById(id.toInt())

        if(teacher.isPresent)
        {
            val teacherDto = teacher.get().toDTO()

            return teacherDto
        }
        else return null
    }

    fun getAllTeachers(): List<TeacherDTO> {

        val teachers = teacherRepository.findAll()

        return teachers.map { it.toDTO() }
    }

    fun deleteTeacher(id: String) {

        val teacherId = id.toLong()
        if (teacherRepository.existsById(teacherId)) {
            teacherRepository.deleteById(teacherId)

        } else throw TeacherNotFoundException("Could not find teacher with id $id")
    }

    fun addTeacher( teacher: TeacherAddDTO): TeacherDTO
    {

        if((teacherRepository.findBySurname(teacher.surname).isPresent &&
            teacherRepository.findByName(teacher.name).isPresent) ||
            teacherRepository.findByEmail(teacher.email).isPresent)
            throw TeacherConflictException("Teacher already exists with these details.")

        val emailRegex = Regex(pattern = "@.*\\.", options = setOf(RegexOption.IGNORE_CASE))
        val numRegex = Regex(pattern = "[0-9]+")

        if(!teacher.email.contains(emailRegex) ||
            teacher.name.contains(numRegex) ||
            teacher.surname.contains(numRegex))
            throw TeacherUnprocessableContentException("Teacher data does not correspond with formatting rules")

        val teacherEntity : Teacher = teacher.toEntity()


        val resultEntity : Teacher = teacherRepository.save(teacherEntity)

        return resultEntity.toDTO()
    }

    fun updateTeacher(id : String , teacher: TeacherAddDTO) : TeacherDTO
    {

        val entity = teacherRepository.findById(id.toInt())

        if(entity.isPresent)
        {

            val emailRegex = Regex(pattern = "@.*\\.", options = setOf(RegexOption.IGNORE_CASE))
            val numRegex = Regex(pattern = "[0-9]+")

            if(!teacher.email.contains(emailRegex) ||
                teacher.name.contains(numRegex) ||
                teacher.surname.contains(numRegex))
                throw TeacherUnprocessableContentException("Teacher data does not correspond with formatting rules")

            val existingTeacher = entity.get()
            existingTeacher.surname = teacher.surname
            existingTeacher.name = teacher.name
            existingTeacher.email = teacher.email
            existingTeacher.affiliation = teacher.affiliation
            existingTeacher.didacticGrade = teacher.didacticGrade
            existingTeacher.professorType = teacher.professorType

            teacherRepository.save(existingTeacher)

            return existingTeacher.toDTO()
        }
        else throw TeacherNotFoundException("Teacher with ID $id not found")
    }

    fun getTeacherByEmail(email : String)  : TeacherDTO
    {
        val teacher : Optional<Teacher> = teacherRepository.findByEmail(email)

        if(teacher.isPresent)
        {
            return  teacher.get().toDTO()
        }
        else throw TeacherNotFoundException("Teacher not found")
    }

    fun getTeachersByName(name : String)  : List<TeacherDTO>
    {
        return teacherRepository.findTeachersByName(name)
            .map { it.toDTO() }
    }

    fun getTeachersByRank(rank : String)  : List<TeacherDTO>
    {
        val didacticGrade = try {
            DidacticGrade.valueOf(rank.uppercase())
        } catch (e: IllegalArgumentException) {
            throw IllegalArgumentException("Invalid rank: $rank")
        }

        return teacherRepository.findByDidacticGrade(didacticGrade)
            .map { it.toDTO() }
    }


}
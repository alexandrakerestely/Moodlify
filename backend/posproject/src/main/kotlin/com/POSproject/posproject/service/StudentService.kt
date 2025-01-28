package com.POSproject.posproject.service

import com.POSproject.posproject.dto.StudentAddDTO
import com.POSproject.posproject.dto.StudentDTO
import com.POSproject.posproject.dto.SubjectDTO
import com.POSproject.posproject.dto.toEntity
import com.POSproject.posproject.entity.Student
import com.POSproject.posproject.entity.Subject
import com.POSproject.posproject.entity.toDTO
import com.POSproject.posproject.exceptions.*
import com.POSproject.posproject.repository.StudentRepository
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import java.util.*

@Service
class StudentService {

    @Autowired
    private lateinit var subjectService: SubjectService

    @Autowired
    private lateinit var studentRepository  : StudentRepository

    fun getStudents() : List<StudentDTO>
    {
        val students : List<Student> = studentRepository.findAll()

        return students.map { it.toDTO() }

    }

    fun getStudentById(id : String)  : StudentDTO
    {
        val student : Optional<Student> = studentRepository.findById(id.toLong())

        if(student.isPresent)
        {
            return student.get().toDTO()
        }
        else throw StudentNotFoundException("Student not found")
    }

    fun addStudent(student: StudentAddDTO) : StudentDTO
    {

        if((studentRepository.findBySurname(student.surname).isPresent &&
            studentRepository.findByName(student.name).isPresent) ||
            studentRepository.findByEmail(student.email).isPresent)
            throw StudentConflictException("Student already exists with these details.")

        val emailRegex = Regex(pattern = "@.*\\.", options = setOf(RegexOption.IGNORE_CASE))
        val nameRegex = Regex(pattern = "[0-9]+")

        if(student.name.contains(nameRegex) ||
            student.surname.contains(nameRegex) ||
            !student.email.contains(emailRegex) ||
            student.studyYear <= 0 || student.studyYear > 4
        )
            throw StudentUnprocessableContentException("Student data does not correspond with formatting rules")

        val studentEntity : Student = student.toEntity()

        for(subjectCode in student.joinedSubjects)
        {
            val subject = subjectService.getSubjectEntityByCode(subjectCode)
            studentEntity.subjects.add(subject)
        }

        val resultEntity : Student = studentRepository.save(studentEntity)

        return resultEntity.toDTO()

    }

    fun deleteStudent(id: String) : StudentDTO
    {
        if (studentRepository.existsById(id.toLong()))
        {
            val student = studentRepository.findById(id.toLong())

            student.get().subjects.clear()
            studentRepository.save(student.get())

            studentRepository.deleteById(id.toLong())
            return student.get().toDTO()
        }
        else throw StudentNotFoundException("Student not found")
    }

    fun updateStudent(student: StudentAddDTO, id :String, newSubjects : MutableList<SubjectDTO>) : StudentDTO
    {
        val emailRegex = Regex(pattern = "@.*\\.", options = setOf(RegexOption.IGNORE_CASE))
        val nameRegex = Regex(pattern = "[0-9]+")


        if (student.name.contains(nameRegex) ||

            student.surname.contains(nameRegex) ||
            !student.email.contains(emailRegex) ||
            student.studyYear <= 0 || student.studyYear > 4
        )
            throw StudentUnprocessableContentException("Student data does not correspond with formatting rules")


        val entity = studentRepository.findById(id.toLong())

        if(entity.isPresent) {


            val existingStudent = entity.get()
            existingStudent.surname = student.surname
            existingStudent.name = student.name
            existingStudent.email = student.email
            existingStudent.studyYear = student.studyYear
            existingStudent.studyCycle = student.studyCycle
            existingStudent.group = student.group

            existingStudent.subjects = mutableListOf()
            for(subjectDTO in newSubjects)
            {
                val subject = subjectService.getSubjectEntityByCode(subjectDTO.cod)
                existingStudent.subjects.add(subject)
            }

            val resultEntity: Student = studentRepository.save(existingStudent)

            return resultEntity.toDTO()
        }
        else throw StudentNotFoundException("Student not found")

    }

    fun getStudentByEmail(email : String)  : StudentDTO
    {
        val student : Optional<Student> = studentRepository.findByEmail(email)

        if(student.isPresent)
        {
            return student.get().toDTO()
        }
        else throw StudentNotFoundException("Student not found")
    }


}
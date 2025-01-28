package com.POSproject.posproject.controllers

import com.POSproject.posproject.assemblers.StudentDTOAssembler
import com.POSproject.posproject.assemblers.SubjectDTOAssembler
import com.POSproject.posproject.dto.*
import com.POSproject.posproject.service.StudentService
import com.POSproject.posproject.service.SubjectService
import com.POSproject.posproject.service.TeacherService
import jakarta.servlet.http.HttpServletRequest
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/academia/students")
class StudentController {

    @Autowired
    private lateinit var teacherService: TeacherService

    @Autowired
    private lateinit var studentDTOAssembler: StudentDTOAssembler

    @Autowired
    private lateinit var subjectDTOAssembler: SubjectDTOAssembler

    @Autowired
    private lateinit var studentService : StudentService

    @Autowired
    private lateinit var subjectService : SubjectService


    @GetMapping("")
    public fun getStudents(request: HttpServletRequest?): ResponseEntity<List<StudentDTOWrapper>>
    {
        val role = request!!.getAttribute("userRole") as String?
        val email = request.getAttribute("userEmail") as String?

        if(role != "admin" && role != "teacher" && role != "student")
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()

        if (role == "student") {
            val student = studentService.getStudentByEmail(email!!)
            val students = listOf(student)
            val wrappedStudents = students.map { studentDTOAssembler.toModel(it) }
            return ResponseEntity.status(HttpStatus.OK).body(wrappedStudents)
        }


        val students = studentService.getStudents()

        if(students.isEmpty())
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build()

       else
        {
            if(role == "teacher")
            {
                var selectedStudents: MutableList<StudentDTO> = mutableListOf()
                for(student in students)
                {
                    var isValid : Boolean = false
                    for (subject in student.joinedSubjects)
                    {
                        val subj = subjectService.getSubjectByCode(subject)
                        val teacher = teacherService.getTeacherById(subj!!.teacherId.toString())
                        if(teacher!!.email == email) {
                            isValid = true
                            break
                        }
                    }
                    if(isValid)
                        selectedStudents.add(student)
                }

                val wrappedStudents = selectedStudents.map { studentDTOAssembler.toModel(it)}

                return ResponseEntity.status(HttpStatus.OK).body(wrappedStudents)
            }

            val wrappedStudents = students.map { studentDTOAssembler.toModel(it)}

            return ResponseEntity.status(HttpStatus.OK).body(wrappedStudents)
        }

    }

    @GetMapping("/{id}")
    public fun getStudentById(request: HttpServletRequest?, @PathVariable id: String) : ResponseEntity<StudentDTOWrapper>
    {
        val role = request!!.getAttribute("userRole") as String?
        val email = request.getAttribute("userEmail") as String?

        if(role != "admin" && role != "teacher" && role != "student")
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()

        if(role == "student")
        {
            val student = studentService.getStudentById(id)
            if(student.email != email)
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build()
        }
        else if(role == "teacher")
        {
           val student= studentService.getStudentById(id)
            var isValid : Boolean = false
            for (subject in student.joinedSubjects)
            {
                val subj = subjectService.getSubjectByCode(subject)
                val teacher = teacherService.getTeacherById(subj!!.teacherId.toString())
                if(teacher!!.email == email) {
                    isValid = true
                    break
                }
            }
            if(!isValid)
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build()
        }

        val student = studentService.getStudentById(id)

        val wrappedStudent = studentDTOAssembler.toModel(student)

        return ResponseEntity.status(HttpStatus.OK).body(wrappedStudent)

    }

    @PostMapping("", consumes = ["application/json"])
    public fun addStudent(request: HttpServletRequest?, @RequestBody student: StudentAddDTO?) : ResponseEntity<StudentDTOWrapper>
    {
        val role = request!!.getAttribute("userRole") as String?

        if (role != "admin") {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()
        }

        for(subject in student!!.joinedSubjects)
        {
            if(subjectService.getSubjectByCode(subject) == null)
            {
                return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).build()
            }
        }

        val result = studentService.addStudent(student!!)

        val wrapped = studentDTOAssembler.toModel(result)
        return ResponseEntity.status(HttpStatus.CREATED).body(wrapped)
    }

    @DeleteMapping("/{id}")
    public fun deleteStudent(request: HttpServletRequest?, @PathVariable id: String) : ResponseEntity<StudentDTOWrapper>
    {
        val role = request!!.getAttribute("userRole") as String?

        if (role != "admin") {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()
        }

        val student = studentService.deleteStudent(id)
        val wrapped = studentDTOAssembler.toModel(student)
        return ResponseEntity.status(HttpStatus.OK).body(wrapped)
    }


    @GetMapping("/{id}/subjects")
    public fun getStudentSubjects(request: HttpServletRequest?, @PathVariable id: String) : ResponseEntity<List<SubjectDTOWrapper>>
    {
        val role = request!!.getAttribute("userRole") as String?
        val email = request.getAttribute("userEmail") as String?

        if(role != "admin" && role != "teacher" && role != "student")
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()

        if(role == "student")
        {
            val student = studentService.getStudentById(id)
            if(student.email != email)
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build()
        }

        if(role=="teacher")
        {
            val student= studentService.getStudentById(id)
            var isValid : Boolean = false
            for (subject in student.joinedSubjects)
            {
                val subj = subjectService.getSubjectByCode(subject)
                val teacher = teacherService.getTeacherById(subj!!.teacherId.toString())
                if(teacher!!.email == email) {
                    isValid = true
                    break
                }
            }
            if(!isValid)
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build()
        }

        val student = studentService.getStudentById(id)

        val subjectsCodes = student.joinedSubjects

        if(subjectsCodes.isEmpty())
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build()

        val subjects : MutableList<SubjectDTOWrapper> = mutableListOf()

        for (subjectsCode in subjectsCodes) {

            val subject = subjectService.getSubjectByCode(subjectsCode)

            subjects.add(subjectDTOAssembler.toModel(subject!!))

        }

        return ResponseEntity.status(HttpStatus.OK).body(subjects)

    }

    @PutMapping("/{id}", consumes = ["application/json"])
    public fun updateStudent(request: HttpServletRequest?, @PathVariable id: String, @RequestBody student: StudentAddDTO?) : ResponseEntity<Any>
    {
        val role = request!!.getAttribute("userRole") as String?
        val email = request.getAttribute("userEmail") as String?

        if(role != "admin" && role != "teacher" && role != "student")
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()

        if (role == "teacher") {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()
        }
        else if(role == "student")
        {
            if (student != null && student.email != email) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build()
            }
        }

        var newSubjects : MutableList<SubjectDTO> = mutableListOf()

        if(student!!.joinedSubjects.isNotEmpty())
        {
            for(subject in student.joinedSubjects)
            {
                subjectService.getSubjectByCode(subject)?.let { newSubjects.add(it) }

            }
        }

        val result = studentService.updateStudent(student, id, newSubjects)

        val wrappedResult = studentDTOAssembler.toModel(result)

        return ResponseEntity.status(HttpStatus.NO_CONTENT).build()
    }


}
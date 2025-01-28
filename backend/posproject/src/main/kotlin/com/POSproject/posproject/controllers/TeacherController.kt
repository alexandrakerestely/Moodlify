package com.POSproject.posproject.controllers

import com.POSproject.posproject.assemblers.SubjectDTOAssembler
import com.POSproject.posproject.assemblers.TeacherDTOAssembler
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
@RequestMapping("/api/academia/professors")
class TeacherController {

    @Autowired
    private lateinit var studentService: StudentService

    @Autowired
    private lateinit var teacherService : TeacherService

    @Autowired
    private lateinit var subjectsService: SubjectService

    @Autowired
    private lateinit var teacherDTOAssembler: TeacherDTOAssembler

    @Autowired
    private lateinit var subjectDTOAssembler: SubjectDTOAssembler


    @GetMapping("")
    public fun getTeachers(request: HttpServletRequest?): ResponseEntity<List<TeacherDTOWrapper>>
    {
        val role = request!!.getAttribute("userRole") as String?
        val email = request.getAttribute("userEmail") as String?

        if(role != "admin" && role != "teacher" && role != "student")
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()

        if(role == "student")
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()

        if(role == "teacher")
        {
            val teacher = teacherService.getTeacherByEmail(email!!)
            val teachers = listOf(teacher)
            val wrappedTeachers = teachers.map { teacherDTOAssembler.toModel(it) }
            return ResponseEntity.status(HttpStatus.OK).body(wrappedTeachers)
        }

        val teachers = teacherService.getAllTeachers()

        if(teachers.isEmpty())
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build()
        else
        {
            for(teacher in teachers)
            {
                val teacherSubjects = subjectsService.findSubjectsByTeacherId(teacher.id)
                teacher.subjectsOwned = teacherSubjects
            }
            val wrappedTeachers = teachers.map { teacherDTOAssembler.toModel(it) }

            return ResponseEntity.status(HttpStatus.OK).body(wrappedTeachers)
        }
    }

    @GetMapping("", params = ["acad_rank"])
    fun getTeachersByRank(request: HttpServletRequest?,
        @RequestParam(name = "acad_rank") rank: String
    ): ResponseEntity<List<TeacherDTOWrapper>> {

        val role = request!!.getAttribute("userRole") as String?

        if(role != "admin" && role != "teacher" && role != "student")
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()

        if(role == "student" || role == "teacher")
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()


        val teachers = teacherService.getTeachersByRank(rank)

        if(teachers.isEmpty())
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build()
        else
        {
            for(teacher in teachers)
            {
                val teacherSubjects = subjectsService.findSubjectsByTeacherId(teacher.id)
                teacher.subjectsOwned = teacherSubjects
            }
            val wrappedTeachers = teachers.map { teacherDTOAssembler.toModel(it) }

            return ResponseEntity.status(HttpStatus.OK).body(wrappedTeachers)
        }

    }

    @GetMapping("", params = ["name"])
    fun getTeachersByName(request: HttpServletRequest?,
        @RequestParam(name = "name") name: String
    ): ResponseEntity<List<TeacherDTOWrapper>> {

        val role = request!!.getAttribute("userRole") as String?

        if(role != "admin" && role != "teacher" && role != "student")
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()

        if(role == "student" || role == "teacher")
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()

        val teachers = teacherService.getTeachersByName(name)

        if(teachers.isEmpty())
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build()
        else
        {
            for(teacher in teachers)
            {
                val teacherSubjects = subjectsService.findSubjectsByTeacherId(teacher.id)
                teacher.subjectsOwned = teacherSubjects
            }
            val wrappedTeachers = teachers.map { teacherDTOAssembler.toModel(it) }

            return ResponseEntity.status(HttpStatus.OK).body(wrappedTeachers)
        }
    }

    @GetMapping("/{id}")
    public fun getTeacherById(request: HttpServletRequest?, @PathVariable id: String) : ResponseEntity<TeacherDTOWrapper> {

        val role = request!!.getAttribute("userRole") as String?
        val email = request.getAttribute("userEmail") as String?

        if(role != "admin" && role != "teacher" && role != "student")
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()

        if(role == "student")
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()

        if(role == "teacher")
        {
            val teacher = teacherService.getTeacherById(id)
            if(teacher!!.email != email)
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build()
        }

        val teacher : TeacherDTO? = teacherService.getTeacherById(id)

        if(teacher == null )
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build()
        else
        {
            val teacherSubjects = subjectsService.findSubjectsByTeacherId(teacher.id)
            teacher.subjectsOwned = teacherSubjects

            val wrappedTeacher = teacherDTOAssembler.toModel(teacher)

            return ResponseEntity.status(HttpStatus.OK).body(wrappedTeacher)
        }

    }

    @PostMapping(value = [""], consumes = ["application/json"])
    public fun addTeacher(request: HttpServletRequest?, @RequestBody teacher: TeacherAddDTO?): ResponseEntity<TeacherDTOWrapper>
    {
        val role = request!!.getAttribute("userRole") as String?

        if (role != "admin") {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()
        }

        val result = teacherService.addTeacher(teacher!!)

        val wrapped = teacherDTOAssembler.toModel(result)
        return ResponseEntity.status(HttpStatus.CREATED).body(wrapped)

    }

    @DeleteMapping("/{id}")
    public fun deleteTeacher(request: HttpServletRequest?, @PathVariable id: String) : ResponseEntity<Any>
    {
        val role = request!!.getAttribute("userRole") as String?

        if (role != "admin") {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()
        }

        teacherService.deleteTeacher(id)

        return ResponseEntity.status(HttpStatus.NO_CONTENT).build()

    }

    @PutMapping("/{id}", consumes = ["application/json"])
    public fun updateTeacher(request: HttpServletRequest?, @PathVariable id: String, @RequestBody teacher: TeacherAddDTO?) : ResponseEntity<Any>
    {
        val role = request!!.getAttribute("userRole") as String?
        val email = request.getAttribute("userEmail") as String?

        if(role != "admin" && role != "teacher" && role != "student")
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()

        if (role == "student") {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()
        }
        else if(role == "teacher")
        {
            if (teacher != null && teacher.email != email) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build()
            }
        }

        val result = teacherService.updateTeacher(id, teacher!!)

        val wrappedResult = teacherDTOAssembler.toModel(result)

        return ResponseEntity.status(HttpStatus.NO_CONTENT).build()
    }


    @GetMapping("/{id}/subjects")
    public fun getTeacherSubjects(request: HttpServletRequest?, @PathVariable id: String) : ResponseEntity<List<SubjectDTOWrapper>> {

        val role = request!!.getAttribute("userRole") as String?

        if(role != "admin" && role != "teacher" && role != "student")
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()

        if(role == "student")
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()

        val subjects: List<SubjectDTO> = subjectsService.getTeacherSubjects(id)

        return if (subjects.isEmpty())
            ResponseEntity.status(HttpStatus.NO_CONTENT).build()
        else
        {
            val wrappedSubjects = subjects.map { subjectDTOAssembler.toModel(it) }
            return ResponseEntity.status(HttpStatus.OK).body(wrappedSubjects)
        }

    }


}
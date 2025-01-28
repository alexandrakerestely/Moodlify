package com.POSproject.posproject.controllers

import com.POSproject.posproject.assemblers.StudentDTOAssembler
import com.POSproject.posproject.assemblers.SubjectDTOAssembler
import com.POSproject.posproject.dto.*
import com.POSproject.posproject.service.StudentService
import com.POSproject.posproject.service.SubjectService
import com.POSproject.posproject.service.TeacherService
import jakarta.servlet.http.HttpServletRequest
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.hateoas.CollectionModel
import org.springframework.hateoas.EntityModel
import org.springframework.hateoas.Link
import org.springframework.hateoas.server.mvc.WebMvcLinkBuilder
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/academia/subjects")
class SubjectController {

    @Autowired
    private lateinit var studentService: StudentService

    @Autowired
    private lateinit var teacherService: TeacherService

    @Autowired
    private lateinit var subjectService: SubjectService

    @Autowired
    private lateinit var subjectDTOAssembler: SubjectDTOAssembler

    @Autowired
    private lateinit var studentDTOAssembler: StudentDTOAssembler


    @GetMapping("")
    public fun getSubjects(request: HttpServletRequest?): ResponseEntity<CollectionModel<SubjectDTOWrapper>>
    {
        val role = request!!.getAttribute("userRole") as String?
        val email = request.getAttribute("userEmail") as String?

        if(role != "admin" && role != "teacher" && role != "student")
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()

        if(role == "admin")
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()

        val subjects = subjectService.getAllSubjects()

        if(subjects.isEmpty())
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build()


        val selectedSubjects = if (role == "student") {
            val student = studentService.getStudentByEmail(email!!)
            subjects.filter { student.joinedSubjects.contains(it.cod) }
        } else {
            subjects
        }

        val wrappedSubjects = selectedSubjects.map { subjectDTOAssembler.toModel(it) }


        val collectionModel = CollectionModel.of(wrappedSubjects)

        collectionModel.add(
            WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(this::class.java).getSubjectsPaginated(null, 0, 5)
            ).withSelfRel()
        )

        collectionModel.add(
            WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(this::class.java).getSubjectsPaginated(null, 0, 5)
            ).withRel("paginated_version")
        )

        return ResponseEntity.status(HttpStatus.OK).body(collectionModel)

    }


    @GetMapping("", params = ["page", "items_per_page"])
    fun getSubjectsPaginated(
        request: HttpServletRequest?,
        @RequestParam(value = "page") page: Int,
        @RequestParam(value = "items_per_page") itemsPerPage: Int
    ): ResponseEntity<CollectionModel<SubjectDTOWrapper>> {
        val role = request!!.getAttribute("userRole") as String?
        val email = request.getAttribute("userEmail") as String?

        if (role != "admin" && role != "teacher" && role != "student") {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()
        }

        if (role == "admin") {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()
        }

        if(itemsPerPage > subjectService.getAllSubjects().size)
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).build()

        val subjectPage = subjectService.getPaginatedSubjects(page, itemsPerPage)


        val filteredSubjects = if (role == "student") {
            val student = studentService.getStudentByEmail(email!!)
            subjectPage.content.filter { student.joinedSubjects.contains(it.cod) }
        } else {
            subjectPage.content
        }

        val wrappedSubjects = filteredSubjects.map { subjectDTOAssembler.toModel(it) }


        val collectionModel = CollectionModel.of(wrappedSubjects)


        collectionModel.add(
            WebMvcLinkBuilder.linkTo(
                WebMvcLinkBuilder.methodOn(this::class.java).getSubjectsPaginated(request, page, itemsPerPage)
            ).withSelfRel()
        )

        if (page < subjectPage.totalPages - 1) {
            collectionModel.add(
                WebMvcLinkBuilder.linkTo(
                    WebMvcLinkBuilder.methodOn(this::class.java).getSubjectsPaginated(request, page + 1, itemsPerPage)
                ).withRel("next")
            )
        }

        if (page > 0) {
            collectionModel.add(
                WebMvcLinkBuilder.linkTo(
                    WebMvcLinkBuilder.methodOn(this::class.java).getSubjectsPaginated(request, page - 1, itemsPerPage)
                ).withRel("prev")
            )
        }

        return ResponseEntity.ok(collectionModel)
    }


    @GetMapping("", params = [ "type", "category" ])
    fun getSubjectsByTypeAndCategory(
        request: HttpServletRequest?,
        @RequestParam(name = "type") type: String,
        @RequestParam(name = "category") category: String
    ): ResponseEntity<List<SubjectDTOWrapper>> {

        val role = request!!.getAttribute("userRole") as String?
        val email = request.getAttribute("userEmail") as String?

        if(role != "admin" && role != "teacher" && role != "student")
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()

        if(role == "admin")
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()

        val subjects =  subjectService.getSubjectsByTypeAndCategory(type, category)

        if(subjects.isEmpty())
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build()
        else
        {
            if(role == "student")
            {
                val selectedSubjects : MutableList<SubjectDTO> = mutableListOf()
                val student = studentService.getStudentByEmail(email!!)

                for (subject in subjects)
                {
                    if(student.joinedSubjects.contains(subject.cod))
                        selectedSubjects.add(subject)
                }

                val wrappedSubjects = selectedSubjects.map { subjectDTOAssembler.toModel(it) }
                return ResponseEntity.status(HttpStatus.OK).body(wrappedSubjects)
            }

            val wrappedSubjects = subjects.map { subjectDTOAssembler.toModel(it) }
            return ResponseEntity.status(HttpStatus.OK).body(wrappedSubjects)
        }
    }

    @GetMapping("/{id}")
    public fun getSubjectById(request: HttpServletRequest?, @PathVariable id: String) : ResponseEntity<SubjectDTOWrapper>
    {
        val role = request!!.getAttribute("userRole") as String?
        val email = request.getAttribute("userEmail") as String?

        if(role != "admin" && role != "teacher" && role != "student")
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()

        if(role == "admin")
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()

        val subject : SubjectDTO? = subjectService.getSubjectByCode(id)

        if(role == "student")
        {
            val student = studentService.getStudentByEmail(email!!)
            if(!student.joinedSubjects.contains(subject!!.cod))
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build()
        }


        if(subject == null )
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build()
        else
        {
            val wrappedSubject = subjectDTOAssembler.toModel(subject)

            return ResponseEntity.status(HttpStatus.OK).body(wrappedSubject)
        }
    }

    @PutMapping(value = ["/{id}"], consumes = ["application/json"])
    public fun upcertSubject(request: HttpServletRequest?, @PathVariable id: String, @RequestBody subject: SubjectDTO): ResponseEntity<Any>
    {
        val role = request!!.getAttribute("userRole") as String?
        val email = request.getAttribute("userEmail") as String?

        if(role != "admin" && role != "teacher" && role != "student")
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()

        if(role == "admin" || role == "student")
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()

        if(role == "teacher")
        {
            val teacher = teacherService.getTeacherById(subject.teacherId.toString())

            if(email != teacher!!.email)
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build()
        }

        val result = subjectService.addSubject(subject)

        if(result != null)
        {
            val wrappedResult = subjectDTOAssembler.toModel(result)
            return ResponseEntity.status(HttpStatus.CREATED).body(wrappedResult)

        }
        return ResponseEntity.status(HttpStatus.NO_CONTENT).build()

    }

    @DeleteMapping("/{id}")
    public fun deleteSubject(request: HttpServletRequest?, @PathVariable id: String) : ResponseEntity<Any>
    {
        val role = request!!.getAttribute("userRole") as String?
        val email = request.getAttribute("userEmail") as String?

        if(role != "admin" && role != "teacher" && role != "student")
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()

        if(role == "admin" || role == "student")
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()

        if(role == "teacher")
        {
            val exists = subjectService.getSubjectByCode(id)
            if(exists == null)
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build()
            
            val teacher = teacherService.getTeacherByEmail(email!!)
            if(!teacher.subjectsOwned.contains(id))
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build()
        }

        val result : Int  = subjectService.deleteSubject(id)

        return when(result)
        {
            -1 -> ResponseEntity.status(HttpStatus.NOT_FOUND).build()
            1 -> ResponseEntity.status(HttpStatus.NO_CONTENT).build()
            else -> ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred while processing the delete request.")

        }
    }

    @GetMapping("/{id}/students")
    public fun getSubjectStudents(request: HttpServletRequest?, @PathVariable id: String) : ResponseEntity<List<StudentDTOWrapper>>
    {
        val role = request!!.getAttribute("userRole") as String?

        if(role != "admin" && role != "teacher" && role != "student")
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()

        if(role == "student")
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build()

        if(subjectService.getSubjectByCode(id) == null)
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build()

        val students : List<StudentDTO> = studentService.getStudents()
        val subjectStudents : MutableList<StudentDTO> = mutableListOf<StudentDTO>()

        for(student in students)
        {
            for(subject in student.joinedSubjects)
            {
                if(subject == id)
                    subjectStudents.add(student)
            }
        }

        if(subjectStudents.isEmpty())
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build()

        val wrappedStudents = subjectStudents.map { studentDTOAssembler.toModel(it)}

        return ResponseEntity.status(HttpStatus.OK).body(wrappedStudents)

    }


}
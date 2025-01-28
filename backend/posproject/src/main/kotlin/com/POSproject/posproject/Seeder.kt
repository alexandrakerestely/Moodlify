package com.POSproject.posproject

import com.POSproject.posproject.dto.StudentAddDTO
import com.POSproject.posproject.dto.SubjectDTO
import com.POSproject.posproject.dto.TeacherAddDTO
import com.POSproject.posproject.enums.DidacticGrade
import com.POSproject.posproject.enums.ProfessorType
import com.POSproject.posproject.enums.StudyCycle
import com.POSproject.posproject.enums.SubjectType
import com.POSproject.posproject.enums.TestType
import com.POSproject.posproject.enums.SubjectCategory
import com.POSproject.posproject.service.StudentService
import com.POSproject.posproject.service.SubjectService
import com.POSproject.posproject.service.TeacherService
import org.springframework.boot.CommandLineRunner
import org.springframework.stereotype.Component


@Component
class DatabaseSeeder(
    private val teacherService: TeacherService,
    private val subjectService: SubjectService,
    private val studentService: StudentService
) : CommandLineRunner {

    @Throws(Exception::class)
    override fun run(vararg args: String) {

        if (teacherService.getAllTeachers().isEmpty()) {
            println("Seeding teachers...")

            val teachers = listOf(
                TeacherAddDTO(
                    surname = "Popescu",
                    name = "Ion",
                    email = "ion.popescu@example.com",
                    affiliation = "University of Bucharest",
                    didacticGrade = DidacticGrade.CONF,
                    professorType = ProfessorType.TITULAR
                ),
                TeacherAddDTO(
                    surname = "Ionescu",
                    name = "Maria",
                    email = "maria.ionescu@example.com",
                    affiliation = "Cluj Technical Institute",
                    didacticGrade = DidacticGrade.CONF,
                    professorType = ProfessorType.ASOCIAT
                ),
                TeacherAddDTO(
                    surname = "Georgescu",
                    name = "Ana",
                    email = "ana.georgescu@example.com",
                    affiliation = "Polytechnic University of Timisoara",
                    didacticGrade = DidacticGrade.SEF_LUCR,
                    professorType = ProfessorType.TITULAR
                )
            )

            teachers.forEach(teacherService::addTeacher)
            println("Teachers seeded.")
        } else {
            println("Teachers already exist in the database.")
        }

        if (subjectService.getAllSubjects().isEmpty()) {
            println("Seeding subjects...")

            val teachers = teacherService.getAllTeachers()

            val (teacher1, teacher2, teacher3) = teachers

            val subjects = listOf(
                SubjectDTO(
                    cod = "MAT101",
                    name = "Mathematics",
                    studyYear = 1,
                    subjectType = SubjectType.OBLIGATORIE,
                    testType = TestType.EXAMEN,
                    subjectCategory = SubjectCategory.DOMENIU,
                    creditsNumber = 5,
                    teacherId = teacher1.id!!.toInt()
                ),
                SubjectDTO(
                    cod = "PHY102",
                    name = "Physics",
                    studyYear = 1,
                    subjectType = SubjectType.OPTIONALA,
                    testType = TestType.EXAMEN,
                    subjectCategory = SubjectCategory.ADIACENTA,
                    creditsNumber = 4,
                    teacherId = teacher1.id!!.toInt()
                ),
                SubjectDTO(
                    cod = "ALG201",
                    name = "Algorithms",
                    studyYear = 2,
                    subjectType = SubjectType.OBLIGATORIE,
                    testType = TestType.EXAMEN,
                    subjectCategory = SubjectCategory.SPECIALITATE,
                    creditsNumber = 6,
                    teacherId = teacher2.id!!.toInt()
                ),
                SubjectDTO(
                    cod = "DBS202",
                    name = "Databases",
                    studyYear = 2,
                    subjectType = SubjectType.OPTIONALA,
                    testType = TestType.EXAMEN,
                    subjectCategory = SubjectCategory.DOMENIU,
                    creditsNumber = 5,
                    teacherId = teacher2.id!!.toInt()
                ),
                SubjectDTO(
                    cod = "LIT301",
                    name = "Literature",
                    studyYear = 3,
                    subjectType = SubjectType.OBLIGATORIE,
                    testType = TestType.EXAMEN,
                    subjectCategory = SubjectCategory.SPECIALITATE,
                    creditsNumber = 3,
                    teacherId = teacher3.id!!.toInt()
                ),
                SubjectDTO(
                    cod = "HIS302",
                    name = "History",
                    studyYear = 3,
                    subjectType = SubjectType.OPTIONALA,
                    testType = TestType.EXAMEN,
                    subjectCategory = SubjectCategory.DOMENIU,
                    creditsNumber = 4,
                    teacherId = teacher3.id!!.toInt()
                ),
                SubjectDTO(
                    cod = "MLG401",
                    name = "Machine Learning",
                    studyYear = 4,
                    subjectType = SubjectType.OPTIONALA,
                    testType = TestType.COLOCVIU,
                    subjectCategory = SubjectCategory.DOMENIU,
                    creditsNumber = 6,
                    teacherId = teacher1.id!!.toInt()
                ),
                SubjectDTO(
                    cod = "AIG402",
                    name = "Artificial Intelligence",
                    studyYear = 4,
                    subjectType = SubjectType.OBLIGATORIE,
                    testType = TestType.COLOCVIU,
                    subjectCategory = SubjectCategory.ADIACENTA,
                    creditsNumber = 6,
                    teacherId = teacher2.id!!.toInt()
                )
            )

            for(subject in subjects)
                subjectService.addSubject(subject)
            println("Subjects seeded.")
        } else {
            println("Subjects already exist in the database.")
        }

        if (studentService.getStudents().isEmpty()) {
            println("Seeding students...")

            val students = listOf(
                StudentAddDTO(
                    surname = "Popescu",
                    name = "Ion",
                    email = "ion.popescu@example.com",
                    group = "GR1001",
                    studyYear = 1,
                    studyCycle = StudyCycle.LICENTA,
                    joinedSubjects = listOf("MAT101", "PHY102")
                ),
                StudentAddDTO(
                    surname = "Ionescu",
                    name = "Maria",
                    email = "maria.ionescu@example.com",
                    group = "GR1002",
                    studyYear = 2,
                    studyCycle = StudyCycle.LICENTA,
                    joinedSubjects = listOf("DBS202", "ALG201")
                ),
                StudentAddDTO(
                    surname = "Georgescu",
                    name = "Andrei",
                    email = "andrei.georgescu@example.com",
                    group = "GR2001",
                    studyYear = 1,
                    studyCycle = StudyCycle.MASTER,
                    joinedSubjects = listOf("MLG401", "AIG402")
                ),
                StudentAddDTO(
                    surname = "Dumitrescu",
                    name = "Elena",
                    email = "elena.dumitrescu@example.com",
                    group = "GR2002",
                    studyYear = 2,
                    studyCycle = StudyCycle.MASTER,
                    joinedSubjects = listOf("LIT301", "HIS302")
                )
            )

            students.forEach(studentService::addStudent)
            println("Students seeded.")
        } else {
            println("Students already exist in the database.")
        }
    }

}



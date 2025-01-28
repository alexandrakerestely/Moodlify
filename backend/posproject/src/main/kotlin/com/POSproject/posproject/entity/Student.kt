package com.POSproject.posproject.entity

import com.POSproject.posproject.dto.StudentDTO
import com.POSproject.posproject.enums.StudyCycle
import com.POSproject.posproject.entity.Subject
import jakarta.persistence.*

@Entity
@Table(name="students")
public class Student (

    @Basic
    @Column(name="nume")
    var surname : String,

    @Basic
    @Column(name="prenume")
    var name : String,

    @Basic
    @Column(name="email")
    var email : String,

    @Basic
    @Column(name="grupa")
    var group : String,

    @Basic
    @Column(name="an_studiu")
    var studyYear : Int,

    @Enumerated(EnumType.STRING)
    @Column(name="ciclu_studii")
    var studyCycle : StudyCycle,

    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Id
    @Column(name="id")
    var id : Int? = null
)
{
    @ManyToMany(cascade = [CascadeType.MERGE, CascadeType.REMOVE])
    @JoinTable(
        name = "students_subjects",
        joinColumns = [JoinColumn(name = "id_student")],
        inverseJoinColumns = [ JoinColumn(name = "id_disciplina") ]
    )
    public var subjects : MutableList<Subject> = mutableListOf()

}

fun Student.toDTO() = StudentDTO(
    surname = surname,
    name = name,
    email = email,
    group = group,
    studyYear = studyYear,
    studyCycle = studyCycle,
    id = id!!,
    joinedSubjects = subjects.map {it.cod}
)
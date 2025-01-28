package com.POSproject.posproject.entity

import com.POSproject.posproject.dto.TeacherAddDTO
import com.POSproject.posproject.dto.TeacherDTO
import com.POSproject.posproject.enums.DidacticGrade
import com.POSproject.posproject.enums.ProfessorType
import jakarta.persistence.*

@Entity
@Table(name="teachers")
public class Teacher (

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
    @Column(name="afiliere")
    var affiliation : String,

    @Enumerated(EnumType.STRING)
    @Column(name="grad_didactic")
    var didacticGrade : DidacticGrade,

    @Enumerated(EnumType.STRING)
    @Column(name="tip_asociere")
    var professorType : ProfessorType,

    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Id
    @Column(name="id")
    var id : Int? = null

)
{
    @OneToMany(mappedBy = "teacher", cascade = [(CascadeType.ALL)], orphanRemoval = true)
    public var subjects : MutableList<Subject> = mutableListOf()

}

fun Teacher.toDTO() = TeacherDTO(
            surname = surname,
            name = name,
            email = email,
            affiliation = affiliation,
            didacticGrade = didacticGrade,
            professorType = professorType,
            id = id!!,
            subjectsOwned = subjects.map {it.cod}
)

fun Teacher.toAddDTO() = TeacherAddDTO(
    surname = surname,
    name = name,
    email = email,
    affiliation = affiliation,
    didacticGrade = didacticGrade,
    professorType = professorType,

)


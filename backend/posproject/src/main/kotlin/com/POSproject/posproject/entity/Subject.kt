package com.POSproject.posproject.entity

import com.POSproject.posproject.dto.SubjectDTO
import com.POSproject.posproject.enums.SubjectCategory
import com.POSproject.posproject.enums.SubjectType
import com.POSproject.posproject.enums.TestType
import jakarta.persistence.*

@Entity
@Table(name="subjects")
public class Subject(

    @Basic
    @Column(name="nume_disciplina")
    var name: String,

    @Basic
    @Column(name="an_studiu")
    var studyYear: Int,

    @Enumerated(EnumType.STRING)
    @Column(name="tip_disciplina")
    var subjectType: SubjectType,

    @Enumerated(EnumType.STRING)
    @Column(name="tip_examinare")
    var testType: TestType,

    @Enumerated(EnumType.STRING)
    @Column(name="categorie_disciplina")
    var subjectCategory: SubjectCategory,

    @Basic
    @Column(name="nr_credite")
    var creditsNumber: Int,

    @Id
    @Column(name="cod", nullable=false, unique=true)
    var cod: String

)
{
    @ManyToOne
    @JoinColumn(name= "id_titular", nullable=false)
    var teacher: Teacher? = null

    @ManyToMany(mappedBy = "subjects", cascade = [CascadeType.MERGE, CascadeType.REMOVE])
    var students : MutableSet<Student> = mutableSetOf()


}

fun Subject.toDTO() = SubjectDTO(
    cod = cod,
    name = name,
    studyYear = studyYear,
    subjectType = subjectType,
    testType = testType,
    subjectCategory = subjectCategory,
    creditsNumber = creditsNumber,
    teacherId = teacher!!.id!!
)
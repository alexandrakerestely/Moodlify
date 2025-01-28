package com.POSproject.posproject.exceptions

import org.springframework.dao.DataIntegrityViolationException
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.web.ErrorResponse
import org.springframework.web.bind.annotation.ControllerAdvice
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.ResponseStatus
import java.time.LocalDateTime


@ControllerAdvice
class GlobalExceptionHandler {

    @ResponseStatus(HttpStatus.CONFLICT) // 409
    @ExceptionHandler(TeacherConflictException::class)
        fun handleTeacherConflict(ex: TeacherConflictException): ResponseEntity<Map<String, Any?>> {
        val response: MutableMap<String, Any?> = HashMap()
        response["timestamp"] = LocalDateTime.now()
        response["status"] = HttpStatus.CONFLICT.value()
        response["error"] = HttpStatus.CONFLICT.reasonPhrase
        response["message"] = ex.message
        return ResponseEntity(response, HttpStatus.CONFLICT)
    }

    @ResponseStatus(HttpStatus.CONFLICT) // 409
    @ExceptionHandler(SubjectConflictException::class)
    fun handleSubjectConflict(ex: SubjectConflictException): ResponseEntity<Map<String, Any?>> {
        val response: MutableMap<String, Any?> = HashMap()
        response["timestamp"] = LocalDateTime.now()
        response["status"] = HttpStatus.CONFLICT.value()
        response["error"] = HttpStatus.CONFLICT.reasonPhrase
        response["message"] = ex.message
        return ResponseEntity(response, HttpStatus.CONFLICT)
    }

    @ResponseStatus(HttpStatus.CONFLICT) // 409
    @ExceptionHandler(StudentConflictException::class)
    fun handleStudentConflict(ex: StudentConflictException): ResponseEntity<Map<String, Any?>> {
        val response: MutableMap<String, Any?> = HashMap()
        response["timestamp"] = LocalDateTime.now()
        response["status"] = HttpStatus.CONFLICT.value()
        response["error"] = HttpStatus.CONFLICT.reasonPhrase
        response["message"] = ex.message
        return ResponseEntity(response, HttpStatus.CONFLICT)
    }

    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY) //422
    @ExceptionHandler(TeacherUnprocessableContentException::class)
    fun handleUnprocessableTeacher(ex: TeacherUnprocessableContentException): ResponseEntity<Map<String, Any?>> {
        val response: MutableMap<String, Any?> = HashMap()
        response["timestamp"] = LocalDateTime.now()
        response["status"] = HttpStatus.UNPROCESSABLE_ENTITY.value()
        response["error"] = HttpStatus.UNPROCESSABLE_ENTITY.reasonPhrase
        response["message"] = ex.message
        return ResponseEntity(response, HttpStatus.UNPROCESSABLE_ENTITY)
    }

    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY) //422
    @ExceptionHandler(SubjectUnprocessableContentException::class)
    fun handleUnprocessableSubject(ex: SubjectUnprocessableContentException): ResponseEntity<Map<String, Any?>> {
        val response: MutableMap<String, Any?> = HashMap()
        response["timestamp"] = LocalDateTime.now()
        response["status"] = HttpStatus.UNPROCESSABLE_ENTITY.value()
        response["error"] = HttpStatus.UNPROCESSABLE_ENTITY.reasonPhrase
        response["message"] = ex.message
        return ResponseEntity(response, HttpStatus.UNPROCESSABLE_ENTITY)
    }

    @ResponseStatus(HttpStatus.UNPROCESSABLE_ENTITY) //422
    @ExceptionHandler(StudentUnprocessableContentException::class)
    fun handleUnprocessableStudent(ex: StudentUnprocessableContentException): ResponseEntity<Map<String, Any?>> {
        val response: MutableMap<String, Any?> = HashMap()
        response["timestamp"] = LocalDateTime.now()
        response["status"] = HttpStatus.UNPROCESSABLE_ENTITY.value()
        response["error"] = HttpStatus.UNPROCESSABLE_ENTITY.reasonPhrase
        response["message"] = ex.message
        return ResponseEntity(response, HttpStatus.UNPROCESSABLE_ENTITY)
    }

    @ResponseStatus(HttpStatus.NOT_FOUND) //404
    @ExceptionHandler(TeacherNotFoundException::class)
    fun handleNotFoundTeacher(ex: TeacherNotFoundException): ResponseEntity<Map<String, Any?>> {
        val response: MutableMap<String, Any?> = HashMap()
        response["timestamp"] = LocalDateTime.now()
        response["status"] = HttpStatus.NOT_FOUND.value()
        response["error"] = HttpStatus.NOT_FOUND.reasonPhrase
        response["message"] = ex.message
        return ResponseEntity(response, HttpStatus.NOT_FOUND)
    }

    @ResponseStatus(HttpStatus.NOT_FOUND) //404
    @ExceptionHandler(StudentNotFoundException::class)
    fun handleNotFoundStudent(ex: StudentNotFoundException): ResponseEntity<Map<String, Any?>> {
        val response: MutableMap<String, Any?> = HashMap()
        response["timestamp"] = LocalDateTime.now()
        response["status"] = HttpStatus.NOT_FOUND.value()
        response["error"] = HttpStatus.NOT_FOUND.reasonPhrase
        response["message"] = ex.message
        return ResponseEntity(response, HttpStatus.NOT_FOUND)
    }
    @ResponseStatus(HttpStatus.NOT_FOUND) //404
    @ExceptionHandler(SubjectNotFoundException::class)
    fun handleNotFoundSubject(ex: SubjectNotFoundException): ResponseEntity<Map<String, Any?>> {
        val response: MutableMap<String, Any?> = HashMap()
        response["timestamp"] = LocalDateTime.now()
        response["status"] = HttpStatus.NOT_FOUND.value()
        response["error"] = HttpStatus.NOT_FOUND.reasonPhrase
        response["message"] = ex.message
        return ResponseEntity(response, HttpStatus.NOT_FOUND)
    }


}
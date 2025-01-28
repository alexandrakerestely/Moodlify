package com.POSproject.posproject

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.data.jpa.repository.config.EnableJpaRepositories

@SpringBootApplication
@EnableJpaRepositories
class PosprojectApplication

fun main(args: Array<String>) {
	runApplication<PosprojectApplication>(*args)
}

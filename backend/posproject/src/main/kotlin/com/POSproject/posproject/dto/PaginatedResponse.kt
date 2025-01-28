package com.POSproject.posproject.dto

data class PaginatedResponse<T>(
    val result: List<T>
)
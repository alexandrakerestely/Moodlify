package com.POSproject.posproject.grpc

import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter

@Component
class JwtAuthFilter(private val authServiceClient: AuthServiceClient) : OncePerRequestFilter() {

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val authHeader = request.getHeader(HttpHeaders.AUTHORIZATION)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.sendError(HttpStatus.UNAUTHORIZED.value(), "Missing or invalid Authorization header")
            return
        }

        val token = authHeader.substring(7)

        val validationResponse = authServiceClient.checkToken(token)

        if (validationResponse == null || !validationResponse.valid) {
            response.sendError(HttpStatus.UNAUTHORIZED.value(), "Invalid token")
            return
        }

        val role = validationResponse.role
        val email = validationResponse.email

        if (role == null || email == null) {
            response.sendError(HttpStatus.UNAUTHORIZED.value(), "Token is missing required fields")
            return
        }

        request.setAttribute("userRole", role)
        request.setAttribute("userEmail", email)

        filterChain.doFilter(request, response)
    }
}

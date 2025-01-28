package com.POSproject.posproject.grpc

import com.POSproject.grpc.AuthServiceGrpc
import com.POSproject.grpc.CheckTokenResponse
import com.POSproject.grpc.CheckTokenRequest
import io.grpc.ManagedChannel
import io.grpc.ManagedChannelBuilder
import io.grpc.StatusRuntimeException
import org.springframework.stereotype.Service

@Service
class AuthServiceClient {
    private val channel: ManagedChannel = ManagedChannelBuilder
        .forAddress("idm-service", 50051)
        .usePlaintext()
        .build()

    private val stub: AuthServiceGrpc.AuthServiceBlockingStub =
        AuthServiceGrpc.newBlockingStub(channel)


    fun checkToken(token: String): CheckTokenResponse? {
        val request = CheckTokenRequest.newBuilder()
            .setToken(token)
            .build()

        return try {
            val response = stub.checkToken(request)
            response
        } catch (e: StatusRuntimeException) {
            println("gRPC call failed: ${e.status}, ${e.message}")
            null
        }

    }
}

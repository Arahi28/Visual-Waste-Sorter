package com.lvn.visualwastesorter.data.api

import com.lvn.visualwastesorter.data.model.PostResponse
import retrofit2.Call
import retrofit2.http.GET

interface ApiService {

    @GET("posts")
    fun getPosts(): Call<ArrayList<PostResponse>>
}
package com.lvn.visualwastesorter.data.model

import com.google.gson.annotations.SerializedName

data class PostResponse (
    val id: Int,
    val title: String?,
    @SerializedName("body")
    val text: String?
)
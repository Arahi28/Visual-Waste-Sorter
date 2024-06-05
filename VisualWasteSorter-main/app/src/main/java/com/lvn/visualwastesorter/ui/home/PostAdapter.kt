package com.lvn.visualwastesorter.ui.home

import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import android.widget.TextView
import androidx.recyclerview.widget.RecyclerView
import com.lvn.visualwastesorter.R
import com.lvn.visualwastesorter.data.model.PostResponse

class PostAdapter(private val list: ArrayList<PostResponse>) :
    RecyclerView.Adapter<PostAdapter.PostViewHolder>() {
    inner class PostViewHolder(itemView: View) : RecyclerView.ViewHolder(itemView) {
        fun bind(postResponse: PostResponse) {
            with(itemView) {
                val tvTitle = findViewById<TextView>(R.id.tvTitle)
                val tvDescription = findViewById<TextView>(R.id.tvDescription)
                tvTitle.text = postResponse.title
                tvDescription.text = postResponse.text
            }
        }

    }

    override fun onBindViewHolder(holder: PostViewHolder, position: Int) {
        holder.bind(list[position])
    }

    override fun onCreateViewHolder(parent: ViewGroup, viewType: Int): PostViewHolder {
        val view = LayoutInflater.from(parent.context).inflate(R.layout.item_waste, parent, false)
        return PostViewHolder(view)
    }

    override fun getItemCount(): Int = list.size
}
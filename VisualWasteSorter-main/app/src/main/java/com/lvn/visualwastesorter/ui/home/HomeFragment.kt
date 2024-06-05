package com.lvn.visualwastesorter.ui.home

import android.os.Bundle
import android.view.LayoutInflater
import android.view.View
import android.view.ViewGroup
import androidx.fragment.app.Fragment
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import com.lvn.visualwastesorter.data.network.RetrofitClient
import com.lvn.visualwastesorter.databinding.FragmentHomeBinding
import com.lvn.visualwastesorter.data.model.PostResponse
import retrofit2.Call
import retrofit2.Callback
import retrofit2.Response

class HomeFragment : Fragment() {

    private lateinit var binding: FragmentHomeBinding
    private val list = ArrayList<PostResponse>()
    private lateinit var rvHome: RecyclerView
    private lateinit var adapter: PostAdapter

    override fun onCreateView(
        inflater: LayoutInflater, container: ViewGroup?,
        savedInstanceState: Bundle?
    ): View {
        binding = FragmentHomeBinding.inflate(inflater, container, false)
        return binding.root
    }

    override fun onViewCreated(view: View, savedInstanceState: Bundle?) {
        super.onViewCreated(view, savedInstanceState)

        rvHome = binding.rvHome

        rvHome.apply {
            setHasFixedSize(true)
            layoutManager = LinearLayoutManager(context)
        }

        adapter = PostAdapter(list)
        rvHome.adapter = adapter

        loadPosts()
    }

    private fun loadPosts() {
        RetrofitClient.instance.getPosts().enqueue(object : Callback<ArrayList<PostResponse>> {
            override fun onResponse(
                call: Call<ArrayList<PostResponse>>,
                response: Response<ArrayList<PostResponse>>
            ) {
                response.body()?.let { newPosts ->
                    val previousSize = list.size
                    list.addAll(newPosts)
                    adapter.notifyItemRangeInserted(previousSize, newPosts.size)
                }
            }

            override fun onFailure(call: Call<ArrayList<PostResponse>>, t: Throwable) {
            }
        })
    }
}

package com.lvn.visualwastesorter.ui

import android.os.Bundle
import androidx.appcompat.app.AppCompatActivity
import androidx.fragment.app.Fragment
import com.lvn.visualwastesorter.R
import com.lvn.visualwastesorter.databinding.ActivityMainBinding
import com.lvn.visualwastesorter.ui.history.HistoryFragment
import com.lvn.visualwastesorter.ui.home.HomeFragment
import com.lvn.visualwastesorter.ui.scan.ScanFragment

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        setupBottomNavigation()
        setDefaultFragment()
    }

    private fun setupBottomNavigation() {
        binding.bottomNavigation.setOnItemSelectedListener { item ->
            when (item.itemId) {
                R.id.menu_home -> replaceFragment(HomeFragment())
                R.id.menu_scan -> replaceFragment(ScanFragment())
                R.id.menu_history -> replaceFragment(HistoryFragment())
            }
            true
        }
    }

    private fun setDefaultFragment() {
        binding.bottomNavigation.selectedItemId = R.id.menu_home
    }

    private fun replaceFragment(fragment: Fragment) {
        supportFragmentManager.beginTransaction()
            .replace(R.id.fragment_container, fragment)
            .commit()
    }
}

import React from 'react'
import Navbar from '../components/Navbar'
import Welcome from '../components/Welcome'
import Categories from '../components/Categories'
import Listings from '../components/Listings'

const HomePage = () => {
  return (
    <div>
      <Navbar/>
      <Welcome/>
      <Categories/>
      <Listings/>
    </div>
  )
}

export default HomePage
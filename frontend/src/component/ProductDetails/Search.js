import React, { Fragment, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MetaData } from '../layout'
import './Search.css'

const Search = () => {

  const [keyword, setKeyword] = useState('')
  const navigate = useNavigate()
  
  const searchHandler = e => {
    e.preventDefault()
    if (keyword.trim()) {
      navigate(`/products/${keyword}`)
    } else {
      navigate('/products')
    }
  }

  return (
    <Fragment>
      <MetaData title='Search a product - ECOMMERCE' />

      <form className='search-box' onSubmit={searchHandler}>
        <input 
          type='text'
          placeholder='Search a product...'
          onChange={ e => setKeyword(e.target.value) }
        />
        <input type='submit' value='Search' /> 
      </form>
    </Fragment>
  )
}

export default Search

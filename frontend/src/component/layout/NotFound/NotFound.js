import React from 'react'
import { Error } from '@material-ui/icons'
import { Typography } from '@material-ui/core'
import { Link } from 'react-router-dom'
import './NotFound.css'

const NotFound = () => {
  return (
    <div className='page-not-found'>
      <Error />

      <Typography>Page Not Found</Typography>
      <Link to ='/'>Home</Link>
    </div>
  )
}

export default NotFound

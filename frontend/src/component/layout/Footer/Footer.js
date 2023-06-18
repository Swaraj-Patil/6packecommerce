import React from 'react'
import './Footer.css'
import { appStore, playStore } from '../../../constants/assets'

const Footer = () => {
  return (
    <footer id='footer'>
      <div className="left-footer">
        <h4>DOWNLOAD OUR APP</h4>
        <p>Download our App from Apple Store for iOS and Play Store for Android devices.</p>
        { appStore }
        { playStore }
      </div>
      <div className="mid-footer">
        <h1>ECOMMERCE.</h1>
        <p>Quality is our first priority.</p>
        <p>Copyright 2023 &copy; All right Reserved. Swaraj Patil</p>
      </div>
      <div className="right-footer">
        <h4>Follow Us</h4>
        <a href="https://instagram.com/03swaraj">Instagram</a>
        <a href="https://github.com/Swaraj-Patil">GitHub</a>
        <a href="https://linkedin.com/in/swaraj1703">LinkedIn</a>
      </div>
    </footer>
  )
}

export default Footer

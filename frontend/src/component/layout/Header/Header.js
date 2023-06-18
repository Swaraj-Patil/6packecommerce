import React from 'react'
import { ReactNavbar } from 'overlay-navbar'
import { logo } from '../../../constants/assets'
import { AiOutlineSearch, AiOutlineShoppingCart } from 'react-icons/ai'
import { CiUser } from 'react-icons/ci'

const options = {
  burgerColorHover: '#EB4034',
  logo,
  logoWidth: '20vmax',
  navColor1: 'rgba(255, 255, 255, .9)',
  logoHoverSize: '10px',
  logoHoverColor: '#EB4034',
  link1Text: 'Home',
  link2Text: 'Products',
  link3Text: 'Contact',
  link4Text: 'About',
  link1Url: '/',
  link2Url: '/products',
  link3Url: '/contact',
  link4Url: '/about',
  link1Size: '1.3vmax',
  link1Color: 'rgba(35, 35, 35, .8)',
  nav1justifyContent: 'flex-end',
  nav2justifyContent: 'flex-end',
  nav3justifyContent: 'flex-start',
  nav4justifyContent: 'flex-start',
  link1ColorHover: '#EB4034',
  link1Margin: '1vmax',
  searchIcon: true,
  cartIcon: true,
  profileIcon:  true,
  SearchIconElement: AiOutlineSearch,
  CartIconElement: AiOutlineShoppingCart,
  ProfileIconElement: CiUser,
  profileIconColor: 'rgba(35, 35, 35, .8)',
  searchIconColor: 'rgba(35, 35, 35, .8)',
  cartIconColor: 'rgba(35, 35, 35, .8)',
  profileIconColorHover: '#EB4034',
  searchIconColorHover: '#EB4034',
  cartIconColorHover: '#EB4034',
  cartIconMargin: '1vmax',
  profileIconUrl: '/login'
}

const Header = () => {
  return (
    <ReactNavbar { ...options } />
  )
}

export default Header

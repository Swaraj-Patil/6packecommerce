import React, { useEffect, useState } from 'react';
import './App.css';
import {
  Header, 
  Footer, 
  UserOptions, 
  ElementsLayout, 
  NotFound 
} from './component/layout'
import {
  Home,
  ProductDetails,
  Products,
  Search,
  LoginSignUp,
  Profile,
  UpdateProfile,
  UpdatePassword,
  ForgotPassword,
  ResetPassword,
  Cart,
  Shipping,
  ConfirmOrder,
  Payment,
  OrderSuccess,
  MyOrders,
  OrderDetails,
  Dashboard,
  ProductList,
  CreateProduct,
  UpdateProduct,
  OrdersList,
  ProcessOrder,
  UsersList,
  UpdateUser,
  ProductReviews
} from './component'
import { Routes, Route } from 'react-router-dom'
import WebFont from 'webfontloader'
import store from './redux/store'
import { loadUser } from './redux/actions/userAction';
import { useSelector } from 'react-redux'
import ProtectedRoute from './component/Route/ProtectedRoute';
import axios from 'axios'
import { loadStripe } from '@stripe/stripe-js'

function App() {

  const { isAuthenticated, user } = useSelector(state => state.user)

  const [stripeApiKey, setStripeApiKey] = useState('')

  async function getStripeApiKey() {
    const { data } = await axios.get('/api/v1/stripeapikey')
    setStripeApiKey(data.stripeApiKey)
  }

  useEffect(() => {
    WebFont.load({
      google: {
        families: ['Roboto', 'Droid Sans', 'Chilanka']
      }
    })

    store.dispatch(loadUser())

    getStripeApiKey()

  }, [])

  window.addEventListener('contextmenu', e => e.preventDefault())

  return (
    <>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}

      <Routes>
        <Route exact path='/' element={<Home />} />
        <Route exact path='/product/:id' element={<ProductDetails />} />
        <Route exact path='/products' element={<Products />} />
        <Route path='/products/:keyword' element={<Products />} />
        <Route exact path='/Search' element={<Search />} />

        <Route exact path='/login' element={<LoginSignUp />} />
        <Route element={<ProtectedRoute isAuthenticated={isAuthenticated} />}>
          <Route exact path='/account' element={<Profile />} />
          <Route exact path='/me/update' element={<UpdateProfile />} />
          <Route exact path='/password/update' element={<UpdatePassword />} />

          <Route exact path='/shipping' element={<Shipping />} />
          <Route exact path='/order/confirm' element={<ConfirmOrder />} />
          {stripeApiKey && (
            <Route element={<ElementsLayout stripe={loadStripe(stripeApiKey)} />} >
              <Route exact path='/process/payment' element={<Payment />} />
            </Route>
          )}
          <Route exact path='/success' element={<OrderSuccess />} />

          <Route exact path='/orders' element={<MyOrders />} />
          <Route exact path='/order/:id' element={<OrderDetails />} />

          <Route exact path='/admin/dashboard' element={<Dashboard />} />
          <Route exact path='/admin/products' element={<ProductList />} />
          <Route exact path='/admin/product' element={<CreateProduct />} />
          <Route exact path='/admin/product/:id' element={<UpdateProduct />} />
          <Route exact path='/admin/orders' element={<OrdersList />} />
          <Route exact path='/admin/order/:id' element={<ProcessOrder />} />
          <Route exact path='/admin/users' element={<UsersList />} />
          <Route exact path='/admin/user/:id' element={<UpdateUser />} />
          <Route exact path='/admin/reviews' element={<ProductReviews />} />
        </Route>
        <Route exact path='/password/forgot' element={<ForgotPassword />} />
        <Route exact path='/password/reset/:token' element={<ResetPassword />} />

        <Route exact path='/Cart' element={<Cart />} />

        <Route path='*' element={ <NotFound /> } />

      </Routes>

      <Footer />
    </>
  );
}

export default App;

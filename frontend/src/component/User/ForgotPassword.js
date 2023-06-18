import React, { Fragment, useState, useEffect } from 'react'
import './ForgotPassword.css'
import { Loader, MetaData } from '../layout'
import { MailOutline } from '@material-ui/icons'
import { useSelector, useDispatch } from 'react-redux'
import { clearErrors, forgotPassword } from '../../redux/actions/userAction'
import { useAlert } from 'react-alert'
// import { useNavigate } from 'react-router-dom'

const ForgotPassword = () => {

  // const navigate = useNavigate()
  const alert = useAlert()
  const dispatch = useDispatch()
  const { error, message, loading } = useSelector(state => state.forgotPassword)

  const [email, setEmail] = useState('')

  const forgotPasswordSubmit = e => {
    e.preventDefault()

    const myForm = new FormData()

    myForm.set('email', email)
    dispatch(forgotPassword(myForm))
  }

  useEffect(() => {

    if (error) {
      alert.error(error)
      dispatch(clearErrors())
    }

    if (message) {
      alert.success(message)
    }

  }, [error, dispatch, alert, message])

  return (
    <Fragment>
      {loading ? <Loader /> :
        (
          <Fragment>
            <MetaData title='Forgot Password' />
            <div className='forgot-password-container'>
              <div className='forgot-password-box'>
                <h2>Forgot Password</h2>

                <form
                  className='forgotPasswordForm'
                  onSubmit={forgotPasswordSubmit}
                >
            
                  <div className='forgot-password-email'>
                    <MailOutline />
                    <input
                      type='email'
                      placeholder='Email'
                      required
                      name='email'
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>

                  <input
                    type='submit'
                    value='Send'
                    className='forgot-password-button'
                  />

                </form>
              </div>
            </div>
          </Fragment>
        )
      }
    </Fragment>
  )
}

export default ForgotPassword

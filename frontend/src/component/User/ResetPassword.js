import React, { Fragment, useState, useEffect } from 'react'
import './ResetPassword.css'
import { Loader, MetaData } from '../layout'
import { LockOpen, Lock } from '@material-ui/icons'
import { useSelector, useDispatch } from 'react-redux'
import { clearErrors, resetPassword } from '../../redux/actions/userAction'
import { useAlert } from 'react-alert'
import { useNavigate, useParams } from 'react-router-dom'

const ResetPassword = () => {

    const navigate = useNavigate()
    const alert = useAlert()
    const dispatch = useDispatch()
    const { error, success, loading } = useSelector(state => state.forgotPassword)
    const { token } = useParams()

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const resetPasswordSubmit = e => {
        e.preventDefault()

        const myForm = new FormData()

        myForm.set('password', password)
        myForm.set('confirmPassword', confirmPassword)
        dispatch(resetPassword(token, myForm))
    }

    useEffect(() => {

        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }

        if (success) {
            alert.success('Password Changed successfully.')
            navigate('/login')
        }

    }, [error, alert, dispatch, success, navigate])

    return (
        <Fragment>
            { loading ? <Loader /> :
                (
                    <Fragment>
                        <MetaData title='Reset Password' />
                        <div className='reset-password-container'>
                            <div className='reset-password-box'>
                                <h2>Reset Password</h2>

                                <form
                                    className='resetPasswordForm'
                                    onSubmit={resetPasswordSubmit}
                                >

                                    <div>
                                        <LockOpen />
                                        <input
                                            type='password'
                                            placeholder='New Password'
                                            required
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <Lock />
                                        <input
                                            type='password'
                                            placeholder='Confirm Password'
                                            required
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                        />
                                    </div>

                                    <input
                                        type='submit'
                                        value='Reset'
                                        className='reset-password-button'
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

export default ResetPassword

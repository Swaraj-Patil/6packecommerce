import React, { Fragment, useState, useEffect } from 'react'
import './UpdatePassword.css'
import { Loader, MetaData } from '../layout'
import { LockOpen, Lock, VpnKey } from '@material-ui/icons'
import { useSelector, useDispatch } from 'react-redux'
import { clearErrors, updatePassword } from '../../redux/actions/userAction'
import { useAlert } from 'react-alert'
import { useNavigate } from 'react-router-dom'
import { UPDATE_PASSWORD_RESET } from '../../redux/constants/userConstant'

const UpdatePassword = () => {

    const navigate = useNavigate()
    const alert = useAlert()
    const dispatch = useDispatch()
    const { error, isUpdated, loading } = useSelector(state => state.profile)

    const [oldPassword, setOldPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const updatePasswordSubmit = e => {
        e.preventDefault()

        const myForm = new FormData()

        myForm.set('oldPassword', oldPassword)
        myForm.set('newPassword', newPassword)
        myForm.set('confirmPassword', confirmPassword)
        dispatch(updatePassword(myForm))
    }

    useEffect(() => {

        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }

        if (isUpdated) {
            alert.success('Profile Updated successfully.')
            navigate('/account')
        }

        dispatch({ type: UPDATE_PASSWORD_RESET })

    }, [error, alert, dispatch, isUpdated, navigate])

    return (
        <Fragment>
            { loading ? <Loader /> :
                (
                    <Fragment>
                        <MetaData title='Change Password' />
                        <div className='update-password-container'>
                            <div className='update-password-box'>
                                <h2>Update Password</h2>

                                <form
                                    className='updatePasswordForm'
                                    onSubmit={updatePasswordSubmit}
                                    // encType='multiple/form-data'
                                >
                                    <div className='update-password-name'>
                                        <VpnKey />
                                        <input
                                            type='password'
                                            placeholder='Old Password'
                                            required
                                            // name='old'
                                            value={oldPassword}
                                            onChange={e => setOldPassword(e.target.value)}
                                        />
                                    </div>

                                    <div className='update-password-name'>
                                        <LockOpen />
                                        <input
                                            type='password'
                                            placeholder='New Password'
                                            required
                                            // name='new'
                                            value={newPassword}
                                            onChange={e => setNewPassword(e.target.value)}
                                        />
                                    </div>

                                    <div className='update-password-name'>
                                        <Lock />
                                        <input
                                            type='password'
                                            placeholder='Confirm Password'
                                            required
                                            // name='confirm'
                                            value={confirmPassword}
                                            onChange={e => setConfirmPassword(e.target.value)}
                                        />
                                    </div>

                                    <input
                                        type='submit'
                                        value='Change'
                                        className='update-password-button'
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

export default UpdatePassword

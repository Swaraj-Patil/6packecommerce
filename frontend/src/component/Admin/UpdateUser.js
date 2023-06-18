import React, { useState, useEffect, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import { useAlert } from 'react-alert'
import { updateUser, clearErrors, getUserDetails } from '../../redux/actions/userAction'
import { MetaData, Loader } from '../layout'
import { Button } from '@material-ui/core'
import { MailOutline, Person, VerifiedUser } from '@material-ui/icons'
import Sidebar from './Sidebar'
import { UPDATE_USER_RESET } from '../../redux/constants/userConstant'

const UpdateUser = () => {

    const alert = useAlert()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { user: authUser } = useSelector(state => state.user)
    const { user, error: userError, loading: userLoading } = useSelector(state => state.userDetails)
    const { loading: updateLoading, error: updateError, isUpdated } = useSelector(state => state.profile)
    const { id } = useParams()

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [role, setRole] = useState('')

    const updateUserSubmitHandler = e => {
        e.preventDefault()

        const myForm = new FormData()

        myForm.set('name', name)
        myForm.set('email', email)
        myForm.set('role', role)

        dispatch(updateUser(id, myForm))
    }

    useEffect(() => {

        if (authUser.role !== 'admin') {
            navigate('/login')
            alert.error('You are not authorized to access this resource.')
        }

        if (user && user._id !== id) {
            dispatch(getUserDetails(id))
        } else {
            setName(user.name)
            setEmail(user.email)
            setRole(user.role)
        }

        if (userError) {
            alert.error(userError)
            dispatch(clearErrors())
        }

        if (updateError) {
            alert.error(updateError)
            dispatch(clearErrors())
        }

        if (isUpdated) {
            alert.success('User updated successfully.')
            navigate('/admin/users')
            dispatch({ type: UPDATE_USER_RESET })
        }

    }, [authUser, user, navigate, alert, dispatch, userError, updateError, isUpdated, id])

    return (
        <Fragment>
            <MetaData title='Update User - ADMIN' />

            <div className='dashboard'>
                <Sidebar />

                <div className='create-product-container'>
                    {userLoading ? <Loader /> : (
                        <form
                            className='createProductForm'
                            onSubmit={updateUserSubmitHandler}
                        >
                            <h1>Update User</h1>

                            <div>
                                <Person />
                                <input
                                    type='text'
                                    placeholder='Name'
                                    required
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </div>

                            <div>
                                <MailOutline />
                                <input
                                    type='email'
                                    placeholder='Email'
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                />
                            </div>

                            <div>
                                <VerifiedUser />
                                <select value={role} onChange={e => setRole(e.target.value)}>
                                    <option value=''>Choose Role</option>
                                    <option value='admin'>Admin</option>
                                    <option value='user'>User</option>
                                </select>
                            </div>

                            <Button
                                id='createProductButton'
                                type='submit'
                                disabled={updateLoading || role === ''}
                            >
                                Update
                            </Button>
                        </form>
                    )}
                </div>
            </div>
        </Fragment>
    )
}

export default UpdateUser

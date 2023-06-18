import React, { Fragment, useState, useEffect } from 'react'
import './UpdateProfile.css'
import { Loader, MetaData } from '../layout'
import { MailOutline, Face } from '@material-ui/icons'
import { useSelector, useDispatch } from 'react-redux'
import { clearErrors, loadUser, updateProfile } from '../../redux/actions/userAction'
import { useAlert } from 'react-alert'
import { useNavigate } from 'react-router-dom'
import { UPDATE_PROFILE_RESET } from '../../redux/constants/userConstant'

const UpdateProfile = () => {

    const navigate = useNavigate()
    const alert = useAlert()
    const dispatch = useDispatch()
    const { user } = useSelector(state => state.user)
    const { error, isUpdated, loading } = useSelector(state => state.profile)

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [avatar, setAvatar] = useState()
    const [avatarPreview, setAvatarPreview] = useState('/Profile.png')

    const updateProfileSubmit = e => {
        e.preventDefault()

        const myForm = new FormData()

        myForm.set('name', name)
        myForm.set('email', email)
        myForm.set('avatar', avatar)
        dispatch(updateProfile(myForm))
    }

    const updateProfileDataChange = e => {
        const reader = new FileReader()

        reader.onload = () => {
            if (reader.readyState === 2) {
                setAvatarPreview(reader.result)
                setAvatar(reader.result)
            }
        }

        reader.readAsDataURL(e.target.files[0])
    }

    useEffect(() => {

        if (user) {
            setName(user.name)
            setEmail(user.email)
            setAvatarPreview(user.avatar.url)
        }

        if (error) {
            alert.error(error)
            dispatch(clearErrors())
        }

        if (isUpdated) {
            alert.success('Profile Updated successfully.')
            dispatch(loadUser())
            navigate('/account')
        }

        dispatch({ type: UPDATE_PROFILE_RESET })

    }, [error, alert, dispatch, isUpdated, navigate, user])

    return (
        <Fragment>
            { loading ? <Loader /> :
                (
                    <Fragment>
                        <MetaData title='Update Profile' />
                        <div className='update-profile-container'>
                            <div className='update-profile-box'>
                                <h2>Update Profile</h2>

                                <form
                                    className='updateProfileForm'
                                    onSubmit={updateProfileSubmit}
                                    encType='multiple/form-data'
                                >
                                    <div className='update-profile-name'>
                                        <Face />
                                        <input
                                            type='text'
                                            placeholder='Name'
                                            required
                                            name='name'
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                        />
                                    </div>

                                    <div className='update-profile-email'>
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

                                    <div id='updateProfileImage'>
                                        <img src={avatarPreview} alt='Avatar Preview' />
                                        <input
                                            type='file'
                                            name='avatar'
                                            accept='image/*'
                                            onChange={updateProfileDataChange}
                                        />
                                    </div>

                                    <input
                                        type='submit'
                                        value='Update'
                                        className='update-profile-button'
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

export default UpdateProfile

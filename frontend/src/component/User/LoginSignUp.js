import React, { Fragment, useState, useRef, useEffect } from 'react'
import './LoginSignUp.css'
import { Loader } from '../layout'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import MailOutlineIcon from '@material-ui/icons/MailOutline'
import LockOpenIcon from '@material-ui/icons/LockOpen'
import FaceIcon from '@material-ui/icons/Face'
import { useSelector, useDispatch } from 'react-redux'
import { clearErrors, login, register } from '../../redux/actions/userAction'
import { useAlert } from 'react-alert'

const LoginSignUp = () => {

    const alert = useAlert()
    const navigate = useNavigate()
    const location = useLocation()
    const dispatch = useDispatch()
    const { loading, isAuthenticated, error } = useSelector(state => state.user)

    const [loginEmail, setLoginEmail] = useState('')
    const [loginPassword, setLoginPassword] = useState('')
    const [user, setUser] = useState({
        name: '',
        email: '',
        password: '',
    })
    const [avatar, setAvatar] = useState()
    const [avatarPreview, setAvatarPreview] = useState('/Profile.png')

    const { name, email, password } = user

    const switcherTab = useRef(null)
    const loginTab = useRef(null)
    const registerTab = useRef(null)

    const redirect = location.search ? `/${location.search.split('=')[1]}` : '/account'

    useEffect(() => {

        if (error) {
            alert.error(error)
            dispatch(clearErrors)
        }

        if (isAuthenticated) {
            navigate(redirect)
        }

    }, [dispatch, error, alert, isAuthenticated, navigate, redirect])

    const switchTabs = (e, tab) => {
        if (tab === 'login') {
            switcherTab.current.classList.add('shift-to-neutral')
            switcherTab.current.classList.remove('shift-to-right')

            registerTab.current.classList.remove('shift-to-neutral-form')
            loginTab.current.classList.remove('shift-to-left')
        }

        if (tab === 'register') {
            switcherTab.current.classList.add('shift-to-right')
            switcherTab.current.classList.remove('shift-to-neutral')

            registerTab.current.classList.add('shift-to-neutral-form')
            loginTab.current.classList.add('shift-to-left')
        }
    }

    const loginSubmit = e => {
        e.preventDefault()

        dispatch(login(loginEmail, loginPassword))
    }

    const registerSubmit = e => {
        e.preventDefault()

        const myForm = new FormData()

        myForm.set('name', name)
        myForm.set('email', email)
        myForm.set('password', password)
        myForm.set('avatar', avatar)

        dispatch(register(myForm))
    }

    const registerDataChange = e => {
        if (e.target.name === 'avatar') {
            const reader = new FileReader()

            reader.onload = () => {
                if (reader.readyState === 2) {
                    setAvatarPreview(reader.result)
                    setAvatar(reader.result)
                }
            }

            reader.readAsDataURL(e.target.files[0])
        } else {
            setUser({
                ...user,
                [e.target.name]: e.target.value
            })
        }
    }

    return (
        <Fragment>
            {loading ? <Loader /> : (
                <Fragment>
                    <div className='login-signup-container'>
                        <div className='login-signup-box'>
                            <div>
                                <div className='login-signup-toggle'>
                                    <p onClick={e => switchTabs(e, 'login')}>LOGIN</p>
                                    <p onClick={e => switchTabs(e, 'register')}>REGISTER</p>
                                </div>

                                <button ref={switcherTab}></button>
                            </div>

                            <form className='loginForm' ref={loginTab} onSubmit={loginSubmit}>
                                <div className='login-email'>
                                    <MailOutlineIcon />
                                    <input
                                        type='email'
                                        placeholder='Email'
                                        required
                                        value={loginEmail}
                                        onChange={e => setLoginEmail(e.target.value)}
                                    />
                                </div>

                                <div className='login-password'>
                                    <LockOpenIcon />
                                    <input
                                        type='password'
                                        placeholder='Password'
                                        required
                                        value={loginPassword}
                                        onChange={e => setLoginPassword(e.target.value)}
                                    />
                                </div>

                                <Link to='/password/forgot'>Forget Password ?</Link>

                                <input type='submit' value='Login' className='login-button' />
                            </form>


                            <form
                                className='signupForm'
                                ref={registerTab}
                                onSubmit={registerSubmit}
                                encType='multiple/form-data'
                            >
                                <div className='signup-name'>
                                    <FaceIcon />
                                    <input
                                        type='text'
                                        placeholder='Name'
                                        required
                                        name='name'
                                        value={name}
                                        onChange={registerDataChange}
                                    />
                                </div>

                                <div className='signup-email'>
                                    <MailOutlineIcon />
                                    <input
                                        type='email'
                                        placeholder='Email'
                                        required
                                        name='email'
                                        value={email}
                                        onChange={registerDataChange}
                                    />
                                </div>

                                <div className='signup-password'>
                                    <LockOpenIcon />
                                    <input
                                        type='password'
                                        placeholder='Password'
                                        required
                                        name='password'
                                        value={password}
                                        onChange={registerDataChange}
                                    />
                                </div>

                                <div id='registerImage'>
                                    <img src={avatarPreview} alt='Avatar Preview' />
                                    <input
                                        type='file'
                                        name='avatar'
                                        accept='image/*'
                                        onChange={registerDataChange}
                                    />
                                </div>

                                <input
                                    type='submit'
                                    value='Register'
                                    className='signup-button'
                                // disabled={loading ? true : false}
                                />

                            </form>
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    )
}

export default LoginSignUp

import React, { useEffect, Fragment } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate, Link } from 'react-router-dom'
import { useAlert } from 'react-alert'
import Sidebar from './Sidebar'
import { getAllUsers, clearErrors, deleteUser } from '../../redux/actions/userAction'
import { DELETE_USER_RESET } from '../../redux/constants/userConstant'
import { DataGrid } from '@material-ui/data-grid'
import { Loader, MetaData } from '../layout'
import { Edit, Delete } from '@material-ui/icons'
import { Button } from '@material-ui/core'

const UsersList = () => {

    const alert = useAlert()
    const navigate = useNavigate()
    const dispatch = useDispatch()

    const { user } = useSelector(state => state.user)
    const { users, error: usersError, loading } = useSelector(state => state.allUsers)
    const { isDeleted, error: deleteError, message } = useSelector(state => state.profile)

    const columns = [
        {
            field: 'id',
            headerName: 'User ID',
            minWidth: 180,
            flex: 0.8
        },
        {
            field: 'email',
            headerName: 'Email',
            minWidth: 200,
            flex: 1
        },
        {
            field: 'name',
            headerName: 'Name',
            minWidth: 150,
            flex: 0.5
        },
        {
            field: 'role',
            headerName: 'Role',
            minWidth: 150,
            flex: 0.3,
            cellClassName: params => {
                return params.getValue(params.id, 'role')  === 'admin'
                    ? 'greenColor'
                    : 'redColor'
            }
        },
        {
            field: 'actions',
            headerName: 'Actions',
            type: 'number',
            minWidth: 150,
            flex: 0.3,
            sortable: false,
            renderCell: params => (
                <Fragment>
                    <Link to={`/admin/user/${params.getValue(params.id, 'id')}`}>
                        <Edit />
                    </Link>

                    <Button onClick={() => deleteUserHandler(params.getValue(params.id, 'id'))}>
                        <Delete />
                    </Button>
                </Fragment>
            )
        },
    ]

    const rows = []

    users && users.forEach(user => {
        rows.push({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        })
    })

    const deleteUserHandler = id => {
        dispatch(deleteUser(id))
    }

    useEffect(() => {
        if (user.role !== 'admin') {
            navigate('/login')
            alert.error('You are not autorized to access this resource.')
        }

        if (usersError) {
            alert.error(usersError)
            dispatch(clearErrors())
        }

        if (deleteError) {
            alert.error(deleteError)
            dispatch(clearErrors())
        }

        if (isDeleted) {
            alert.success(message)
            navigate('/admin/users')
            dispatch({ type: DELETE_USER_RESET })
        }

        dispatch(getAllUsers())

    }, [user, navigate, alert, usersError, deleteError, isDeleted, dispatch, message])

    return (
        <Fragment>
            {loading ? <Loader /> : (
                <Fragment>
                    <MetaData title='All Users - ADMIN' />
                    
                    <div className='dashboard'>
                        <Sidebar />

                        <div className='product-list-container'>
                            <h1 className='product-list-heading'>ALL USERS</h1>

                            <DataGrid
                                rows={rows}
                                columns={columns}
                                pageSize={10}
                                disableSelectionOnClick
                                className='product-list-table'
                                autoHeight
                            />
                        </div>
                    </div>
                </Fragment>
            )}
        </Fragment>
    )
}

export default UsersList


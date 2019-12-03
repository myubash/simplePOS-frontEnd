import axios from 'axios'
import Swal from 'sweetalert2'
import url from '../support/url'


export let loginData = (_username, _password) => {
    return (dispatch) => {

        axios.post(
            url + '/login', {
                userName: _username,
                password: _password
            }

        ).then(res => {
            if (res.data.error) {
                Swal.fire(
                    'Login gagal',
                    'Username atau password salah',
                    'error'
                )
            } else {
                let {
                    userName,
                    userType,
                    avatar
                } = res.data.userDetail
                localStorage.setItem('userData', JSON.stringify({
                    userName: userName,
                    userType: userType,
                    avatar
                }))
                Swal.fire(
                    'Welcome back, ' + userName,
                    '',
                    'success'
                )
                dispatch({
                    type: 'loginSuccess',
                    payload: {
                        userName: userName,
                        userType: userType,
                        avatar
                    }
                })
            }
        })
    }
}

export let logoutData = () => {
    localStorage.removeItem('userData')
    return {
        type: "logoutSuccess",
        payload: {
            avatar: '',
            userName: '',
            userType: ''
        }
    }
}

export const keepLogin = (userData) => {
    return {
        type: "loginSuccess",
        payload: {
            avatar: userData.avatar,
            userName: userData.userName,
            userType: userData.userType
        }
    }
}

export const changeUserAvatar = (userName, userType, avatar) => {
    localStorage.removeItem('userData')
    localStorage.setItem('userData', JSON.stringify({
        userName: userName,
        userType: userType,
        avatar
    }))
    return {
        type: 'loginSuccess',
        payload: {
            userName,
            userType,
            avatar
        }
    }
}

export const addTableNum = (tableNum) => {
    localStorage.setItem('tableNum', JSON.stringify({
        tableNum: tableNum
    }))
    return {
        type: "addTableNum",
        payload: {
            tableNum: tableNum
        }
    }
}

export const delTableNum = () => {
    localStorage.removeItem('tableNum')
    return {
        type: "delTableNum",
        payload: {
            tableNum: 0
        }
    }
}

export const keepTableNum = (tableNum) => {
    return {
        type: "addTableNum",
        payload: {
            tableNum: tableNum.tableNum
        }
    }
}
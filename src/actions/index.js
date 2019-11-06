import axios from 'axios'
import Swal from 'sweetalert2'
export let loginData = (_username, _password) => {
    return (dispatch) => {
        axios.get(
            'http://localhost:2000/users', {
                params: {
                    username: _username,
                    password: _password
                }
            }
        ).then(res => {
            if (res.data.length === 0) {
                Swal.fire(
                    'Login gagal',
                    'Username atau password salah',
                    'error'
                )
            } else {
                let {
                    id,
                    userName,
                    userType
                } = res.data[0]
                localStorage.setItem('userData', JSON.stringify({
                    userId: id,
                    userName: userName,
                    userType: userType
                }))
                Swal.fire(
                    'Welcome back, ' + userName,
                    '',
                    'success'
                )
                dispatch({
                    type: 'loginSuccess',
                    payload: {
                        userId: id,
                        userName: userName,
                        userType: userType
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
            userId: 0,
            userName: '',
            userType: ''
        }
    }
}

export const keepLogin = (userData) => {
    return {
        type: "loginSuccess",
        payload: {
            userId: userData.userId,
            userName: userData.userName,
            userType: userData.userType
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
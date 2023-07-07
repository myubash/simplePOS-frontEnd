import Swal from 'sweetalert2'
import {xhr} from '../support/xhr'


export let loginData = (_username, _password) => {
    return async (dispatch) => {
      try {
        const res = await xhr.post ('/login', {
          username: _username,
          password: _password
        })
        let {
          username,
          role,
        } = res.user
        localStorage.setItem('userData', JSON.stringify({
            userName: username,
            userType: role,
        }))
        localStorage.setItem('token', res.token)
        Swal.fire(
            'Welcome back, ' + username,
            '',
            'success'
        )
        dispatch({
            type: 'loginSuccess',
            payload: {
                userName: username,
                userType: role,
            }
        })
      } catch (error) {
        // Swal.fire(
        //   'Login gagal',
        //   'Username atau password salah',
        //   'error'
        // )
      }
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
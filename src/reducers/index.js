import {
    combineReducers
} from 'redux'

let initState = {
    userName: '',
    userType: '',
    avatar: ''
}

let initStateTableNum = {
    tableNum: ''
}

let userAuth = (state = initState, action) => {
    switch (action.type) {
        case "loginSuccess":
            return {
                ...state, avatar: action.payload.avatar, userName: action.payload.userName, userType: action.payload.userType
            }
            case "logoutSuccess":
                return {
                    ...state, avatar: action.payload.avatar, userName: action.payload.userName, userType: action.payload.userType
                }
                default:
                    return state;
    }
}

let tableNum = (state = initStateTableNum, action) => {
    switch (action.type) {
        case "addTableNum":
            return {
                ...state, tableNum: action.payload.tableNum
            }
            case "delTableNum":
                return {
                    ...state, tableNum: action.payload.tableNum
                }
                default:
                    return state;
    }
}

let reducers = combineReducers({
    auth: userAuth,
    tableNum: tableNum
})

export default reducers
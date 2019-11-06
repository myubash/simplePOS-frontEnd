import {
    combineReducers
} from 'redux'

let initState = {
    userId: 0,
    userName: '',
    userType: '',
}

let initStateTableNum = {
    tableNum: ''
}

let userAuth = (state = initState, action) => {
    switch (action.type) {
        case "loginSuccess":
            return {
                ...state, userId: action.payload.userId, userName: action.payload.userName, userType: action.payload.userType
            }
            case "logoutSuccess":
                return {
                    ...state, userId: action.payload.userId, userName: action.payload.userName, userType: action.payload.userType
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
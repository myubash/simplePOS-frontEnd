import React, { Component } from 'react'
import { BrowserRouter, Route } from "react-router-dom";
import Header from './Header'
import Home from './Home'
import Login from './Login'
import HomeCashier from './HomeCashier'
import HomeWaiter from './HomeWaiter'
import HomeKitchen from './HomeKitchen'
import HomeAdmin from './HomeAdmin'
import Order from './Order'
import Table from './Table'
import Checkout from './Checkout'
import OrderListKitchen from './OrderListKitchen'
import RegisterAdmin from './RegisterAdminV2'
import NewMenu from './NewMenu'
import Reservation from './Reservation'
import UpdateProfile from './UpdateProfile'
import TransactionHistory from './TransactionHistory'
import EmployeeList from './EmployeeListV2'
import NewMenuSuggestion from './NewMenuSuggestion'
import ReservationList from './ReservationList'
import MenuList from './MenuListV2'
import CheckoutConfirmation from './CheckoutConfirmation'
import { connect } from 'react-redux'
import { keepLogin, keepTableNum } from '../actions/index'
import '../style/sidebar.css'


export class App extends Component {
    state = {
        check: false
    }

    componentDidMount() {
        let userData = JSON.parse(localStorage.getItem('userData'))
        let tableNum = JSON.parse(localStorage.getItem('tableNum'))
        if (userData) {
            this.props.keepLogin(userData)
        }
        if (tableNum) {
            this.props.keepTableNum(tableNum)
        }
        this.setState({ check: true })
    }

    render() {
        if (this.state.check === true) {
            return (
                <div >
                    <BrowserRouter>
                        <div>
                            <Header />
                        </div>
                        <div>
                            <Route path='/' exact component={Login} />
                            <Route path='/login' component={Login} />
                            <Route path='/cashier' component={HomeCashier} />
                            <Route path='/kitchen' component={HomeKitchen} />
                            <Route path='/waiter' component={HomeWaiter} />
                            <Route path='/admin' component={HomeAdmin} />
                            <Route path='/order' component={Order} />
                            <Route path='/checkout' component={Checkout} />
                            <Route path='/orderlistkitchen' component={OrderListKitchen} />
                            <Route path='/register' component={RegisterAdmin} />
                            <Route path='/table' component={Table} />
                            <Route path='/newmenu' component={NewMenu} />
                            <Route path='/reservation' component={Reservation} />
                            <Route path='/updateprofile' component={UpdateProfile} />
                            <Route path='/transactionhistory' component={TransactionHistory} />
                            <Route path='/employeelist' component={EmployeeList} />
                            <Route path='/newmenusuggestion' component={NewMenuSuggestion} />
                            <Route path='/reservationlist' component={ReservationList} />
                            <Route path='/menulist' component={MenuList} />
                            <Route path='/checkoutconfirmation' component={CheckoutConfirmation} />


                        </div>
                    </BrowserRouter>

                </div>
            )
        } else {
            return <h1>LOADING...</h1>
        }
    }
}

export default connect(null, { keepLogin, keepTableNum })(App)

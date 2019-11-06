import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

export class Home extends Component {
    render() {
        if (this.props.userType === "kitchen") {
            return (
                <Redirect to='/kitchen' />
            )
        } else if (this.props.userType === "cashier") {
            return (
                <Redirect to='/cashier' />
            )
        } else if (this.props.userType === "admin") {
            return (
                <Redirect to='/admin' />
            )
        } else {
            return (
                <div>
                    ini Home
                </div>
            )
        }

    }
}

const mapStateToProps = state => {
    return {
        userName: state.auth.userName,
        userType: state.auth.usertype
    }
}

export default connect(mapStateToProps, null)(Home)

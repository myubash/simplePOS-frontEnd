import React, { Component } from 'react'
import { loginData } from '../actions/index'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

export class Login extends Component {
    state = {
        cek: false
    }

    dor = (e) => {
        e.preventDefault()
        this.setState({ cek: !this.state.cek })
    }

    onSubmit = (e) => {
        e.preventDefault()
        let _username = this.username.value
        let _password = this.password.value
        this.props.loginData(_username, _password)
    }

    render() {
        if (this.props.userType === "waiter") {
            return (
                <Redirect to="/waiter" />
            )
        } else if (this.props.userType === "kitchen") {
            return (
                <Redirect to="/kitchen" />
            )
        } else if (this.props.userType === "cashier") {
            return (
                <Redirect to="/cashier" />
            )
        } else if (this.props.userType === "admin") {
            return (
                <Redirect to="/admin" />
            )
        } else {
            return (
              <div className='row col-4 mx-auto'>
                <div className='card col-12 mx-auto mt-5'>
                  <div className='card-body'>
                    <div className='card-title border-bottom border-dark'>
                      <h1>
                        Login
                      </h1>
                    </div>
                    <form onSubmit={this.onSubmit} className='form-group mb-0'>
                      <div className='card-title'>
                        <h3>Username : </h3>
                        <input style={{textAlign:'center'}} className='form-control' type="text" ref={input => { this.username = input }} />
                      </div>
                      <div className='card-title'>
                        <h3>Password : </h3>
                        <input style={{textAlign:'center'}} className='form-control' type={this.state.cek ? "text" : "password"} ref={input => { this.password = input }} />
                      </div>
                      <button className='m-0 p-0' style={{ opacity: 0 }} onClick={this.onSubmit}>
                      </button>
                    </form>
                    <button className={this.state.cek ? 'btn btn-block btn-dark mt-0' : 'btn btn-block btn-danger mt-0'} onClick={this.dor}>{this.state.cek ? "Hide Password" : "Show Password"}</button>
                    <button type='submit' onClick={this.onSubmit} className='btn btn-block btn-info'>SUBMIT</button>
                  </div>
                </div>
                <div className='card col-12 mx-auto mt-5 px-0'>
                  <div className='card-header'>
                    Tester Account
                  </div>
                  <div className='card-body'>
                    <table className='w-100'>
                      <tr className='border-bottom'>
                        <th>Role</th>
                        <th>Username</th>
                        <th>Password</th>
                      </tr>
                      <tr className='border-bottom'>
                        <td>Admin</td>
                        <td>admin</td>
                        <td>Admin123#</td>
                      </tr>
                      <tr className='border-bottom'>
                        <td>Cashier</td>
                        <td>cashier</td>
                        <td>cashier</td>
                      </tr>
                      <tr className='border-bottom'>
                        <td>Waiter</td>
                        <td>waiter</td>
                        <td>waiter</td>
                      </tr>
                      <tr className='border-bottom'>
                        <td>Kitchen</td>
                        <td>kitchen</td>
                        <td>kitchen</td>
                      </tr>
                    </table>
                  </div>
                </div>
              </div>
            )
        }

    }
}

const mapStateToProps = state => {
    return {
        userName: state.auth.userName,
        userType: state.auth.userType
    }
}

export default connect(mapStateToProps, { loginData })(Login)

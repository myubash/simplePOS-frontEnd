import React, { Component } from 'react'
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap';

export class RegisterAdmin extends Component {
    state = {
        cek: false,
        userType: ''
    }



    cekPassword = (e) => {
        e.preventDefault()
        this.setState({ cek: !this.state.cek })
        console.log(this.state.userType)

    }

    onSubmit = async (e) => {
        e.preventDefault()
        let username = this.username.value
        let password = this.password.value
        let name = this.name.value
        let email = this.email.value
        let birthPlace = this.birthPlace.value
        let birthDate = this.birthDate.value
        let address = this.address.value
        if (!username || !password || !name || !email || !birthPlace || !birthDate || !address) {
            return alert('Please fill in the form')
        }
        if (!email.includes('@')) {
            return alert('Email is incorrect')
        }
        if (!this.state.userType) {
            return alert('Choose user type')
        }
        let _userType = this.state.userType.toLowerCase()
        try {
            let regisUser = await axios.post(
                'http://localhost:2000/users',
                {
                    userName: username,
                    password: password,
                    email: email,
                    userType: _userType
                }
            )
            let regisEmployee = await axios.post(
                'http://localhost:2000/employee',
                {
                    name: name,
                    email: email,
                    birthPlace: birthPlace,
                    birthDate: birthDate,
                    address: address
                }
            )
            console.log(regisUser)
            console.log(regisEmployee)
            alert('Success')
        } catch (error) {
            console.log(error)
        }

    }

    render() {
        if (this.props.userName && this.props.userType === "admin") {
            return (
                <div>
                    <div className='card col-6 mx-auto mt-5'>
                        <div className='card-body' >
                            <div className='card-title border-bottom border-dark'>
                                <h1>
                                    Register User
                                </h1>
                            </div>
                            <form className='form-group mb-0'>
                                <div className='card-title'>
                                    <h3>Username : </h3>
                                    <input className='form-control' type="text" ref={input => { this.username = input }} />
                                </div>
                                <div className='card-title'>
                                    <h3>Password : </h3>
                                    <input className='form-control' type={this.state.cek ? 'text' : 'password'} ref={input => { this.password = input }} />
                                    <button className={this.state.cek ? 'btn btn-block btn-dark mt-2 mb-0' : 'btn btn-block btn-danger mt-2 mb-0'} onClick={this.cekPassword}>{this.state.cek ? "Hide Password" : "Show Password"}</button>
                                </div>
                                <div className='card-title'>
                                    <h3>Name : </h3>
                                    <input className='form-control' type='text' ref={input => { this.name = input }} />
                                </div>
                                <div className='card-title'>
                                    <h3>E-mail : </h3>
                                    <input className='form-control' type='email' ref={input => { this.email = input }} />
                                </div>
                                <div className='card-title'>
                                    <h3>Birth place : </h3>
                                    <input className='form-control' type='text' ref={input => { this.birthPlace = input }} />
                                </div>
                                <div className='card-title'>
                                    <h3>Date of birth : </h3>
                                    <input className='form-control' type='text' ref={input => { this.birthDate = input }} />
                                </div>
                                <div className='card-title'>
                                    <h3>Address : </h3>
                                    <input className='form-control' type='text' ref={input => { this.address = input }} />
                                </div>
                                <div className='card-title'>
                                    <h3>User type : </h3>
                                    <UncontrolledButtonDropdown direction='down' className='btn-block'>
                                        <DropdownToggle caret >
                                            {
                                                this.state.userType
                                                    ?
                                                    this.state.userType
                                                    :
                                                    'Select one...'
                                            }
                                        </DropdownToggle>
                                        <DropdownMenu className='mr-2 w-100'>
                                            <DropdownItem onFocus={() => this.setState({ userType: 'Cashier' })}>Cashier</DropdownItem>
                                            <DropdownItem onFocus={() => this.setState({ userType: 'Kitchen' })}>Kitchen</DropdownItem>
                                            <DropdownItem onFocus={() => this.setState({ userType: 'Waiter' })}>Waiter</DropdownItem>
                                            <DropdownItem divider />
                                            <DropdownItem disabled>Customer</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                </div>
                                <button className='m-0 p-0' style={{ opacity: 0 }} onClick={this.onSubmit}>
                                </button>
                            </form>
                            <button type='submit' className='btn btn-block btn-info' onClick={this.onSubmit}>SUBMIT</button>
                        </div>
                    </div>
                    <div style={{ height: 300 }} className='container'>
                    </div>
                </div>

            )
        } else if (this.props.userType === "waiter") {
            return (
                <Redirect to='/waiter' />
            )
        } else if (this.props.userType === "cashier") {
            return (
                <Redirect to='/cashier' />
            )
        } else if (this.props.userType === "kitchen") {
            return (
                <Redirect to='/kitchen' />
            )
        } else {
            return (
                <Redirect to='/' />
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

export default connect(mapStateToProps, null)(RegisterAdmin)

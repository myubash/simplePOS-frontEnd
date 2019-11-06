import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'
import Swal from 'sweetalert2'

export class UpdateProfile extends Component {
    state = {
        name: '',
        email: '',
        birthPlace: '',
        birthDate: '',
        address: '',
        password: '',
        employeeId: 0,
        userId: 0
    }

    async componentDidMount() {
        try {
            let user = await axios.get(
                'http://localhost:2000/users',
                {
                    params: {
                        userName: this.props.userName
                    }
                }
            )
            if (!user) return alert('User not found')
            let employee = await axios.get(
                'http://localhost:2000/employee',
                {
                    params: {
                        userId: user.data[0].id
                    }
                }
            )
            let userData = user.data[0]
            let employeeData = employee.data[0]
            this.setState({
                name: employeeData.name,
                email: employeeData.email,
                birthPlace: employeeData.birthPlace,
                birthDate: employeeData.birthDate,
                address: employeeData.address,
                password: userData.password,
                employeeId: employeeData.id,
                userId: userData.id
            })
        } catch (error) {
            console.log(error)
        }
    }

    dor = async () => {
        let _name = this.name.value
        let _email = this.email.value
        let _address = this.address.value
        let _birthDate = this.birthDate.value
        let _birthPlace = this.birthPlace.value
        let _passwordOld = this.passwordOld.value
        let _passwordNew = this.passwordNew.value
        let _passwordConfirm = this.passwordConfirm.value
        if (!_name || !_email) return alert('Name and email field cannot be empty')
        if (!_email.includes('@')) {
            return alert('Email is incorrect')
        }
        if (_passwordOld) {
            if (_passwordOld !== this.state.password) return alert('Old password incorrect')
            if (!_passwordNew || !_passwordConfirm) return alert('Password field cannot be empty')
            if (_passwordNew !== _passwordConfirm) return alert('Confirm password incorrect')
        }
        if (_passwordNew || _passwordConfirm) {
            if (!_passwordOld) return alert('Please fill in the old password')
        }
        try {

            let employee = await axios.patch(
                `http://localhost:2000/employee/${this.state.employeeId}`,
                {
                    name: _name,
                    email: _email,
                    address: _address,
                    birthDate: _birthDate,
                    birthPlace: _birthPlace
                }
            )
            if (!employee) return alert('input data employee error')
            if (_passwordOld) {
                let user = await axios.patch(
                    `http://localhost:2000/users/${this.state.userId}`,
                    {
                        password: _passwordNew
                    }
                )
                console.log(user)

            }
            Swal.fire({
                type: 'success',
                title: 'Update success'
            })

        } catch (error) {
            console.log(error)
        }


    }

    renderProfile = () => {
        return (<form className='form-group mb-0'>
            <div className='card-title'>
                <h3>Name : </h3>
                <input className='form-control' type='text' defaultValue={this.state.name} ref={input => { this.name = input }} />
            </div>
            <div className='card-title'>
                <h3>E-mail : </h3>
                <input className='form-control' type='email' defaultValue={this.state.email} ref={input => { this.email = input }} />
            </div>
            <div className='card-title'>
                <h3>Birth place : </h3>
                <input className='form-control' type='text' defaultValue={this.state.birthPlace} ref={input => { this.birthPlace = input }} />
            </div>
            <div className='card-title'>
                <h3>Date of birth : </h3>
                <input className='form-control' type='text' defaultValue={this.state.birthDate} ref={input => { this.birthDate = input }} />
            </div>
            <div className='card-title'>
                <h3>Address : </h3>
                <input className='form-control' type='text' defaultValue={this.state.address} ref={input => { this.address = input }} />
            </div>
            <div className='card-title'>
                <h3 className='border-bottom border-dark'>Password : </h3>
                <h6>Old password</h6>
                <input className='form-control' type='password' ref={input => { this.passwordOld = input }} />
                <h6>New password</h6>
                <input className='form-control' type='password' ref={input => { this.passwordNew = input }} />
                <h6>Confirm password</h6>
                <input className='form-control' type='password' ref={input => { this.passwordConfirm = input }} />
            </div>
            <button className='m-0 p-0' style={{ opacity: 0 }} onClick={this.onSubmit}>
            </button>
        </form>)
    }


    render() {
        if (this.props.userName && this.props.userType !== "admin") {
            return (
                <div>
                    <div className='card col-6 mx-auto mt-5'>
                        <div className='card-body' >
                            <div className='card-title border-bottom border-dark'>
                                <h1>
                                    Update Profile
                                </h1>
                            </div>
                            {this.renderProfile()}
                            <button type='submit' className='btn btn-block btn-info' onClick={this.dor}>SUBMIT</button>
                        </div>
                    </div>
                    <div style={{ height: 300 }} className='container'>
                    </div>
                </div>
            )
        } else if (this.props.userType === "admin") {
            return (
                <Redirect to='/admin' />
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

export default connect(mapStateToProps, null)(UpdateProfile)

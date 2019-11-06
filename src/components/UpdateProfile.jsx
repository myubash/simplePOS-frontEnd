import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'

export class UpdateProfile extends Component {
    state = {
        arrUser: []
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
            // console.log(user.data)
            // console.log(employee.data)
            let array = { ...user.data, ...employee.data }
            console.log(array)
            // this.setState({ arrUser: [...this.state.arrUser, ] })
            // this.setState({ arrUser: [...this.state.arrUser, ...employee.data] })
        } catch (error) {
            console.log(error)
        }
    }

    dor = () => {
        console.log(this.state.arrUser)
    }

    renderProfile = () => {
        return (<form className='form-group mb-0'>
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
                <h3 className='border-bottom border-dark'>Password : </h3>
                <h6>Old password</h6>
                <input className='form-control' type='password' ref={input => { this.password = input }} />
                <h6>New password</h6>
                <input className='form-control' type='password' ref={input => { this.password = input }} />
                <h6>Confirm password</h6>
                <input className='form-control' type='password' ref={input => { this.password = input }} />
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
                                    Register User
                                </h1>
                            </div>
                            {this.renderProfile()}
                            <button type='submit' className='btn btn-block btn-info' onClick={this.onSubmit}>SUBMIT</button>
                        </div>
                    </div>
                    <div style={{ height: 300 }} className='container'>
                    </div>
                    <button onClick={this.dor}>dor</button>
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

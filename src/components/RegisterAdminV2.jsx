import React, { useState } from "react";
import Swal from "sweetalert2";
import { Redirect } from "react-router-dom";
import { connect } from "react-redux";
import {
  UncontrolledButtonDropdown,
  DropdownMenu,
  DropdownItem,
  DropdownToggle
} from "reactstrap";
import Spinner from './common/Spinner'
import {xhr} from '../support/xhr'

const RegisterAdmin = (props) => {
  const initFormUser = {
    username: '',
    password: '',
    role: ''
  }
  const initFormEmployee = {
    fullName: '',
    email: '',
    title: '',
  }
  const [formUser, setFormUser] = useState(initFormUser)
  const [formEmployee, setFormEmployee] = useState(initFormEmployee)
  const [viewPassword, setViewPassowrd] = useState(false)
  const [withEmployee, setWithEmployee] = useState(false)
  const [isSubmitting, setSubmitting] = useState(false)
  
  const onSubmit = async () => {
    try {
      const { username, password, role } = formUser
      // validate field user
      if (!username) return Swal.fire('error', 'Please fill username', 'error')
      if (!password) return Swal.fire('error', 'Please fill password', 'error')
      if (!role) return Swal.fire('error', 'Please fill role', 'error')

      const form = {
        ...formUser
      }
      setSubmitting(true)
      if (withEmployee) {
        // validate fullName & title
        const { fullName, title } = formEmployee
        if (!fullName) return Swal.fire('error', 'Please fill full name', 'error')
        if (!title) return Swal.fire('error', 'Please fill title', 'error')

        const resEmployee = await xhr.post('/employee/create', formEmployee)
        form.employee = resEmployee.data._id
      }


      const resUser = await xhr.post('/register', form)
      Swal.fire('success', resUser.message, 'success')
      setFormUser(initFormUser)
      setFormEmployee(initFormEmployee)
      setSubmitting(false)
    } catch (error) {
      setSubmitting(false)
      console.log(error)
    }
  }

  const handleChangeUser = (name, value) => {
    setFormUser({
      ...formUser,
      [name]: value
    })
  }

  const handleChangeEmployee = (name, value) => {
    setFormEmployee({
      ...formEmployee,
      [name]: value
    })
  }

  if (props.userName && props.userType === "admin") {
    return (
      <div>
        <div className="card col-6 mx-auto mt-5">
          <div className="card-body">
            <div className="card-title border-bottom border-dark">
              <h1>Register User</h1>
            </div>
            <form className="form-group mb-0">
              <div className="card-title">
                <h3>Username : </h3>
                <input
                  className="form-control"
                  type="text"
                  onChange={(e) => handleChangeUser('username', e.target.value)}
                />
              </div>
              <div className="card-title">
                <h3>Password : </h3>
                <input
                  className="form-control"
                  type={viewPassword? "text" : "password"}
                  onChange={(e) => handleChangeUser('password', e.target.value)}
                />
                <button
                  className={
                    viewPassword
                      ? "btn btn-block btn-dark mt-2 mb-0"
                      : "btn btn-block btn-danger mt-2 mb-0"
                  }
                  onClick={(e) => {
                    e.preventDefault()
                    setViewPassowrd(!viewPassword)
                  }}
                >
                  {viewPassword ? "Hide Password" : "Show Password"}
                </button>
              </div>
              <div className="card-title">
                <h3>User type : </h3>
                <UncontrolledButtonDropdown
                  direction="down"
                  className="btn-block"
                >
                  <DropdownToggle caret>
                    {
                      formUser.role || 'Select one...'
                    }
                  </DropdownToggle>
                  <DropdownMenu className="mr-2 w-100">
                    <DropdownItem
                      onFocus={() => handleChangeUser('role', 'cashier')}
                    >
                      Cashier
                    </DropdownItem>
                    <DropdownItem
                      onFocus={() => handleChangeUser('role', 'kitchen')}
                    >
                      Kitchen
                    </DropdownItem>
                    <DropdownItem
                      onFocus={() => handleChangeUser('role', 'waiter')}
                    >
                      Waiter
                    </DropdownItem>
                    <DropdownItem divider />
                    <DropdownItem disabled>Customer</DropdownItem>
                  </DropdownMenu>
                </UncontrolledButtonDropdown>
              </div>
              <div className='border-top border-bottom text-center px-2 mx-2'>
                <input type="checkbox" id="withEmployee" name="withEmployee" onChange={() => setWithEmployee(!withEmployee)}/>
                <label for="withEmployee"> With Employee?</label><br/>
              </div>
              {
                withEmployee &&
                <div>
                  <div className="card-title">
                    <h3>Full name : </h3>
                    <input
                      className="form-control"
                      type="text"
                      onChange={(e) => handleChangeEmployee('fullName', e.target.value)}
                    />
                  </div>
                  <div className="card-title">
                    <h3>Email : </h3>
                    <input
                      className="form-control"
                      type="text"
                      onChange={(e) => handleChangeEmployee('email', e.target.value)}
                    />
                  </div>
                  <div className="card-title">
                    <h3>Full name : </h3>
                    <input
                      className="form-control"
                      type="text"
                      onChange={(e) => handleChangeEmployee('title', e.target.value)}
                    />
                  </div>
                </div>
              }
            </form>
            <button
              type="submit"
              className="btn btn-block btn-info"
              onClick={onSubmit}
            >
              {
                isSubmitting
                  ? <Spinner className='spinner-border-sm'/>
                  : 'Submit'
              }
            </button>
          </div>
        </div>
        <div style={{ height: 300 }} className="container"></div>
      </div>
    );
  } else if (props.userType === "waiter") {
    return <Redirect to="/waiter" />;
  } else if (props.userType === "cashier") {
    return <Redirect to="/cashier" />;
  } else if (props.userType === "kitchen") {
    return <Redirect to="/kitchen" />;
  } else {
    return <Redirect to="/" />;
  }
}

const mapStateToProps = state => {
  return {
    userName: state.auth.userName,
    userType: state.auth.userType
  };
};

export default connect(mapStateToProps, null)(RegisterAdmin);

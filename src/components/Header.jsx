import React, { Component } from 'react'
import { Nav, Navbar, NavItem, NavbarToggler, Collapse, UncontrolledDropdown, DropdownItem, DropdownToggle, DropdownMenu } from 'reactstrap'
import { Link, NavLink } from 'react-router-dom'
import { connect } from 'react-redux'
import { logoutData, delTableNum } from '../actions/index'


export class Header extends Component {
    state = {
        nav: false
    }

    logoutData = () => {
        this.props.logoutData()
        this.props.delTableNum()
        alert('LOGOUT BERHASIL')
        // console.log(this.props.tableNum)
        // console.log(this.props.tableNum.includes('takeaway'))
    }

    delTable = () => {
        this.props.delTableNum()
    }

    renderNav = () => {
        if (this.props.userType === "cashier") {
            return (
                <Nav className='ml-auto' navbar>
                    {
                        this.props.tableNum
                            ?
                            <NavItem>
                                {
                                    this.props.tableNum.includes('takeaway')
                                        ?
                                        <div className='nav-link'>
                                            {this.props.tableNum}
                                        </div>
                                        :
                                        <div className='nav-link'>
                                            Table no-{this.props.tableNum}
                                        </div>
                                }

                            </NavItem>
                            :
                            ''
                    }
                    <UncontrolledDropdown>
                        <DropdownToggle caret nav innavbar={true.toString()}>
                            Welcome, {this.props.userName}
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem>
                                <NavItem>
                                    <NavLink className='nav-link' to='/updateprofile'>Update Profile</NavLink>
                                </NavItem>
                            </DropdownItem>
                            <DropdownItem>
                                <button className='btn btn-block btn-danger' onClick={this.logoutData}>LOGOUT</button>
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </Nav>
            )
        } else if (this.props.userType === "waiter") {
            return (
                <Nav className='ml-auto' navbar>
                    {
                        this.props.tableNum
                            ?
                            <NavItem>
                                {
                                    this.props.tableNum.includes('takeaway')
                                        ?
                                        <NavLink className='nav-link' to='/order'>
                                            {this.props.tableNum}
                                        </NavLink>
                                        :
                                        <NavLink className='nav-link' to='/order'>
                                            Table no-{this.props.tableNum}
                                        </NavLink>
                                }
                            </NavItem>
                            :
                            ''
                    }
                    <UncontrolledDropdown>
                        <DropdownToggle caret nav innavbar={true.toString()}>
                            Welcome, {this.props.userName}
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem>
                                <NavItem>
                                    <NavLink className='nav-link' to='/updateprofile'>Update Profile</NavLink>
                                </NavItem>
                            </DropdownItem>
                            <DropdownItem>
                                <button className='btn btn-block btn-danger' onClick={this.logoutData}>LOGOUT</button>
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </Nav>
            )
        } else if (this.props.userType === "kitchen") {
            return (
                <Nav className='ml-auto' navbar>
                    <UncontrolledDropdown>
                        <DropdownToggle caret nav innavbar={true.toString()}>
                            Welcome, {this.props.userName}
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem>
                                <NavItem>
                                    <NavLink className='nav-link' to='/updateprofile'>Update Profile</NavLink>
                                </NavItem>
                            </DropdownItem>
                            <DropdownItem>
                                <button className='btn btn-block btn-danger' onClick={this.logoutData}>LOGOUT</button>
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </Nav>
            )
        } else if (this.props.userType === "admin") {
            return (
                <Nav className='ml-auto' navbar>
                    <UncontrolledDropdown>
                        <DropdownToggle caret nav >
                            Welcome, {this.props.userName}
                        </DropdownToggle>
                        <DropdownMenu>
                            <DropdownItem>
                                <button className='btn btn-block btn-danger' onClick={this.logoutData}>LOGOUT</button>
                            </DropdownItem>
                        </DropdownMenu>
                    </UncontrolledDropdown>
                </Nav>
            )
        } else {
            return (
                <Nav className='ml-auto' navbar>
                    <NavItem>
                        <NavLink className='nav-link' to='/login'>
                            <button className='btn btn-secondary'>LOGIN</button>
                        </NavLink>
                    </NavItem>
                </Nav>
            )
        }

    }

    toggleNavbar = () => {
        this.setState({ nav: !this.state.nav })
    }

    render() {
        return (
            <div>
                <Navbar color='light' light expand='md'>
                    <div className='container'>
                        {
                            this.props.userType === 'cashier'
                                ?
                                <Link to='/cashier' className='navbar-brand' onClick={this.delTable} >DOR</Link>
                                :
                                this.props.userType === 'waiter'
                                    ?
                                    <Link to='/waiter' className='navbar-brand' onClick={this.delTable}>DOR</Link>
                                    :
                                    this.props.userType === 'kitchen'
                                        ?
                                        <Link to='/kitchen' className='navbar-brand' >DOR</Link>
                                        :
                                        this.props.userType === 'admin'
                                            ?
                                            <Link to='/admin' className='navbar-brand' >DOR</Link>
                                            :
                                            <Link to='/' className='navbar-brand' >DOR</Link>
                        }
                        <NavbarToggler onClick={this.toggleNavbar} />
                        <Collapse isOpen={this.state.nav} navbar>
                            {this.renderNav()}
                        </Collapse>
                    </div>
                </Navbar>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        userName: state.auth.userName,
        userType: state.auth.userType,
        tableNum: state.tableNum.tableNum
    }
}

export default connect(mapStateToProps, { logoutData, delTableNum })(Header)

import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {
    Card, CardBody, Row, Col,
} from 'reactstrap';

export class HomeKitchen extends Component {
    render() {
        if (this.props.userName && this.props.userType === "kitchen") {
            return (
                <div>
                    <Row className="justify-content-around mt-5  container-fluid">
                        <Col xs='5' className='mt-5 pt-5'>
                            <Card className='text-center'>
                                <Link to='/orderlistkitchen' className='nav-link homeMenu'>
                                    <CardBody>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24"><path d="M22 2v20h-20v-20h20zm2-2h-24v24h24v-24zm-4 7h-8v1h8v-1zm0 5h-8v1h8v-1zm0 5h-8v1h8v-1zm-10.516-11.304l-.71-.696-2.553 2.607-1.539-1.452-.698.71 2.25 2.135 3.25-3.304zm0 5l-.71-.696-2.552 2.607-1.539-1.452-.698.709 2.249 2.136 3.25-3.304zm0 5l-.71-.696-2.552 2.607-1.539-1.452-.698.709 2.249 2.136 3.25-3.304z" /></svg>
                                        <h1 className="my-3">ORDER LIST</h1>
                                    </CardBody>
                                </Link>
                            </Card>
                        </Col>
                        <Col xs='5' className='mt-5 pt-5'>
                            <Card className='text-center' >
                                <Link to='/newmenu' className='nav-link homeMenu'>
                                    <CardBody>
                                        <img style={{ height: '100px', width: '100px' }} src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik05LjQ2IDExLjAzOWwtLjQ4LTQuMDM5aC0uOTh2LTEuMzgyYy44NyAwIDItLjY5NyAyLTEuNjE4aDYuMTg1bDIuMTEzLTQgMS4zNTkuNjM0LTEuODE3IDMuMzY2aDQuMTk5YzAgLjkyMiAxLjA5MiAxLjYxOCAxLjk2MSAxLjYxOHYxLjM4MmgtMWwtMiAxN3MtMTUuODM5LjAwNy0xNy4wOTQtLjAwNWMtMi4xNjgtLjA2OC0zLjAxNy0xLjY1Ni0zLjA0MS0zLjc0My0uNTY5LS40NzItLjkwOS0xLjQ4NS0uODYxLTIuNDA5LjA0NC0uODcyLjQ2Ny0xLjY3NCAxLjEzOS0yLjIwMy42NjktMy4yMDYgMy41OTEtNC41OTQgNy4yOC00LjY0LjM1MiAwIC42OTguMDEzIDEuMDM3LjAzOXptLTYuNDY2IDkuOTU3aC0uMDAyYy4wMzEuNzkxLjI2Ny45NzkuOTU0Ljk5OSAxLjI0MS4wMTMgOC41MTQgMCA5LjA5OC0uMDA5LjY3OS0uMDIyLjkyLS4yNjkuOTYtLjk0MyAwIDAtNC4zODQuMDM2LTExLjAxLS4wNDd6bTguNTEzLTkuNjA4YzIuMjEyLjYxNiAzLjg1NSAxLjk4NiA0LjM0NCA0LjI0Ny42NzYuNTI5IDEuMTAxIDEuMzMzIDEuMTQ1IDIuMjA4LjA0OC45MzEtLjQzNyAxLjg2Ni0uOTk2IDIuNDE4LjAxOC42NDMtLjA2MSAxLjIzLS4yMzUgMS43MzloMy41bDEuNzM1LTE1aC0xMGwuNTA3IDQuMzg4em0yLjQ5MyA1LjYxMmwtMy44MzEuMDA1Yy0uOTYyLjAwNy0xLjQzMyAxLjM0Mi0zLjA2OCAxLjMyNi0xLjczMi0uMDE4LTEuODU1LTEuMzEzLTIuNzIzLTEuMzA5bC0xLjQ1NC0uMDIyYy0uNTQuMDQ2LS44OTkuNDcyLS45MjMuOTQzLS4wMjYuNTIzLjM1NCAxLjAzMyAxLjAwNSAxLjA1M2gxMS4wMDhjLjY0NS0uMDM0IDEuMDEtLjUzOS45ODUtMS4wNTMtLjAyNy0uNDktLjQzOC0uOTItLjk5OS0uOTQzem0tLjUyLTIuMDA2Yy0uOTcxLTEuNTc5LTMuMTg2LTEuOTk0LTUuMDQyLTEuOTk0LTEuODU5LjAyNS0zLjk4MS40MTctNC45NDIgMS45OTdsMS4wOTguMDIxYzEuNDQzLjAwOSAxLjU0OSAxLjQ4NyAyLjUxNyAxLjQ4Mi44MzktLjAwNCAxLjQwNC0xLjQ5MiAyLjgzNC0xLjQ5NC4xNDEtLjAwMSAyLjY3NS0uMDEyIDMuNTM1LS4wMTJ6Ii8+PC9zdmc+" alt='' />
                                        <svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 24 24"><path d="M5 3l3.057-3 11.943 12-11.943 12-3.057-3 9-9z" /></svg>
                                        <img style={{ height: '100px', width: '100px' }} src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0yMiAyNGgtMTdjLTEuNjU3IDAtMy0xLjM0My0zLTN2LTE4YzAtMS42NTcgMS4zNDMtMyAzLTNoMTd2MjR6bS0yLTRoLTE0LjUwNWMtMS4zNzUgMC0xLjM3NSAyIDAgMmgxNC41MDV2LTJ6bS0zLTE1aC0xMHYzaDEwdi0zeiIvPjwvc3ZnPg==" alt='' />
                                        <h1 className="my-3">SUGGEST NEW MENU</h1>
                                    </CardBody>
                                </Link>
                            </Card>
                        </Col>
                    </Row>
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

export default connect(mapStateToProps, null)(HomeKitchen)

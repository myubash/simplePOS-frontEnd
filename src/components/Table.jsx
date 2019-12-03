import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {
    Row, Col,
} from 'reactstrap';
import { addTableNum } from '../actions/index'
import { FaPlus } from 'react-icons/fa'


export class Table extends Component {

    state = {
        num: 0
    }

    tableNum = (num) => {
        this.props.addTableNum(num)
    }


    render() {
        if (this.props.userName && (this.props.userType === "waiter" || this.props.userType === "cashier")) {
            return (
                <div className='app'>
                    <div style={{ height: '93vh', width: '5%' }} className=' mr-3 d-flex justify-content-end '>
                    </div>
                    <div className='container-fluid'>
                        <Row className='mt-3 px-0'>
                            {/* <Col xs='3' className='border border-dark'>
                                <h1 className='mt-2 text-center border-bottom border-primary pb-2'>Takeaway</h1>
                                <Col xs='12' className='mt-2 takeaway'>
                                    <Link to='/order'>
                                        <button style={{ height: 100, width: '95%' }} onClick={() => this.tableNum('takeaway-1')} className='m-2'></button>
                                    </Link>
                                </Col>
                            </Col> */}
                            <Col className='border border-dark px-0'>
                                <h1 className='mt-2 text-center border-bottom border-secondary pb-2'>Table Area</h1>
                                <Row className='container-fluid justify-content-start mt-2 pl-2 ml-2 w-100'>
                                    <Col xs='2' className='my-2 mx-auto'>
                                        <Link to='/order'>
                                            <button style={{ height: 100, width: 140 }} onClick={() => this.tableNum('1')}>1</button>
                                        </Link>
                                    </Col>
                                    <Col xs='2' className='my-2 mx-auto'>
                                        <Link to='/order'>
                                            <button style={{ height: 100, width: 140 }} onClick={() => this.tableNum('2')}>2</button>
                                        </Link>
                                    </Col>
                                    <Col xs='2' className='my-2 mx-auto'>
                                        <Link to='/order'>
                                            <button style={{ height: 100, width: 140 }} onClick={() => this.tableNum('3')}>3</button>
                                        </Link>
                                    </Col>
                                    <Col xs='2' className='my-2 mx-auto'>
                                        <Link to='/order'>
                                            <button style={{ height: 100, width: 140 }} onClick={() => this.tableNum('4')}>4</button>
                                        </Link>
                                    </Col>
                                    <Col xs='2' className='my-2 mx-auto'>
                                        <Link to='/order'>
                                            <button style={{ height: 100, width: 140 }} onClick={() => this.tableNum('5')}>5</button>
                                        </Link>
                                    </Col>
                                    <Col xs='2' className='my-2 mx-auto'>
                                        <Link to='/order'>
                                            <button style={{ height: 100, width: 140 }} onClick={() => this.tableNum('6')}>6</button>
                                        </Link>
                                    </Col>
                                    <Col xs='2' className='my-2 mx-auto'>
                                        <Link to='/order'>
                                            <button style={{ height: 100, width: 140 }} onClick={() => this.tableNum('7')}>7</button>
                                        </Link>
                                    </Col>
                                    <Col xs='2' className='my-2 mx-auto'>
                                        <Link to='/order'>
                                            <button style={{ height: 100, width: 140 }} onClick={() => this.tableNum('8')}>8</button>
                                        </Link>
                                    </Col>
                                    <Col xs='2' className='my-2 mx-auto'>
                                        <Link to='/order'>
                                            <button style={{ height: 100, width: 140 }} onClick={() => this.tableNum('9')}>9</button>
                                        </Link>
                                    </Col>
                                    <Col xs='2' className='my-2 mx-auto'>
                                        <Link to='/order'>
                                            <button style={{ height: 100, width: 140 }} onClick={() => this.tableNum('10')}>10</button>
                                        </Link>
                                    </Col>
                                    <Col xs='2' className='my-2 mx-auto'>
                                        <Link to='/order'>
                                            <button style={{ height: 100, width: 140 }} onClick={() => this.tableNum('11')}>11</button>
                                        </Link>
                                    </Col>
                                    <Col xs='2' className='my-2 mx-auto'>
                                        <Link to='/order'>
                                            <button style={{ height: 100, width: 140 }} onClick={() => this.tableNum('12')}>12</button>
                                        </Link>
                                    </Col>
                                </Row>
                                {/* <h1 className='mt-2 text-center border-bottom border-primary pb-2'>Takeaway</h1>
                                <div className='text-center m-2'>
                                    <Link to='/order'>
                                        <button style={{ height: 100, width: '50%' }} onClick={() => this.tableNum('takeaway-1')} ><FaPlus size={32} /></button>
                                    </Link>
                                </div> */}
                            </Col>
                        </Row>
                    </div>

                    <Link to={this.props.userType === 'cashier' ? '/cashier' : 'waiter'} style={{ height: '93vh' }} className=' ml-3 d-flex justify-content-end '>
                        <button className='btn btn-primary' onClick={this.resetTable}>Back</button>
                    </Link>
                </div>
            )
        } else if (this.props.userType === "waiter") {
            return (
                <Redirect to='/waiter' />
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

export default connect(mapStateToProps, { addTableNum })(Table)

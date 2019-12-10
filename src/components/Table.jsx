import React, { Component } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {
    Row, Col,Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button
} from 'reactstrap';
import { addTableNum } from '../actions/index'
import { FaPlus } from 'react-icons/fa'


export class Table extends Component {

    state = {
        num: 0,
        modal: false
    }

    tableNum = (num) => {
        this.props.addTableNum(num)
    }

    onTakeaway = () => {
        this.props.addTableNum(`takeaway-${this.name.value}`)
        this.props.history.push({pathname:'/order',state:{name: this.name.value}})
    }

    toggle = () => {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
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
                                        <button style={{ height: 100, width: '95%' }} onClick={() => this.tableNum('takeaway')} className='m-2'></button>
                                    </Link>
                                </Col>
                            </Col> */}
                            <Col className='border border-dark px-0'>
                                <h1 className='mt-2 text-center border-bottom border-secondary pb-2'>Table Area</h1>
                                <Row className='container-fluid justify-content-start mt-2 pl-2 ml-2 w-100'>
                                    <Col xs='2' className='my-2 mx-auto'>
                                        <Link to='/order'>
                                            <button className='tableBtn' style={{ height: 100, width: 140 }} onClick={() => this.tableNum('1')}>1</button>
                                        </Link>
                                    </Col>
                                    <Col xs='2' className='my-2 mx-auto'>
                                        <Link to='/order'>
                                            <button className='tableBtn' style={{ height: 100, width: 140 }} onClick={() => this.tableNum('2')}>2</button>
                                        </Link>
                                    </Col>
                                    <Col xs='2' className='my-2 mx-auto'>
                                        <Link to='/order'>
                                            <button className='tableBtn' style={{ height: 100, width: 140 }} onClick={() => this.tableNum('3')}>3</button>
                                        </Link>
                                    </Col>
                                    <Col xs='2' className='my-2 mx-auto'>
                                        <Link to='/order'>
                                            <button className='tableBtn' style={{ height: 100, width: 140 }} onClick={() => this.tableNum('4')}>4</button>
                                        </Link>
                                    </Col>
                                    <Col xs='2' className='my-2 mx-auto'>
                                        <Link to='/order'>
                                            <button className='tableBtn' style={{ height: 100, width: 140 }} onClick={() => this.tableNum('5')}>5</button>
                                        </Link>
                                    </Col>
                                    <Col xs='2' className='my-2 mx-auto'>
                                        <Link to='/order'>
                                            <button className='tableBtn' style={{ height: 100, width: 140 }} onClick={() => this.tableNum('6')}>6</button>
                                        </Link>
                                    </Col>
                                    <Col xs='2' className='my-2 mx-auto'>
                                        <Link to='/order'>
                                            <button className='tableBtn' style={{ height: 100, width: 140 }} onClick={() => this.tableNum('7')}>7</button>
                                        </Link>
                                    </Col>
                                    <Col xs='2' className='my-2 mx-auto'>
                                        <Link to='/order'>
                                            <button className='tableBtn' style={{ height: 100, width: 140 }} onClick={() => this.tableNum('8')}>8</button>
                                        </Link>
                                    </Col>
                                    <Col xs='2' className='my-2 mx-auto'>
                                        <Link to='/order'>
                                            <button className='tableBtn' style={{ height: 100, width: 140 }} onClick={() => this.tableNum('9')}>9</button>
                                        </Link>
                                    </Col>
                                    <Col xs='2' className='my-2 mx-auto'>
                                        <Link to='/order'>
                                            <button className='tableBtn' style={{ height: 100, width: 140 }} onClick={() => this.tableNum('10')}>10</button>
                                        </Link>
                                    </Col>
                                    <Col xs='2' className='my-2 mx-auto'>
                                        <Link to='/order'>
                                            <button className='tableBtn' style={{ height: 100, width: 140 }} onClick={() => this.tableNum('11')}>11</button>
                                        </Link>
                                    </Col>
                                    <Col xs='2' className='my-2 mx-auto'>
                                        <Link to='/order'>
                                            <button className='tableBtn' style={{ height: 100, width: 140 }} onClick={() => this.tableNum('12')}>12</button>
                                        </Link>
                                    </Col>
                                </Row>
                                {/* <h1 className='mt-2 text-center border-bottom border-primary pb-2'>Takeaway</h1> */}
                                <div className='text-center m-2'>
                                    {/* <Link to='/order'> */}
                                        <button className='tableBtn' style={{ height: 100, width: '50%' }} onClick={this.toggle} >{/*<FaPlus size={32} />*/}<h4>Take-away</h4></button>
                                    {/* </Link> */}
                                    <Modal
                                        isOpen={this.state.modal}
                                        toggle={this.toggle}
                                        className={this.props.className}
                                    >
                                        <ModalHeader
                                        toggle={this.toggle}
                                        className="px-auto "
                                        >
                                        Input name
                                        </ModalHeader>
                                        <ModalBody>
                                            <input ref={input => {this.name = input}} maxLength={12} style={{textAlign:'center'}} className='form-control' type="text"/>
                                            <h6 className='form-control border-0 text-dark p-0'>Max 12 characters</h6>
                                        </ModalBody>
                                        <ModalFooter>
                                        {/* <Link to="/table"> */}
                                            <Button color="primary" onClick={this.onTakeaway}>
                                            Confirm
                                            </Button>
                                        {/* </Link> */}
                                        <Button color="danger" onClick={this.toggle}>
                                            Cancel
                                        </Button>
                                        </ModalFooter>
                                    </Modal>
                                </div>
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

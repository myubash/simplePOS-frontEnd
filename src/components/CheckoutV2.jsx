/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {
    Card, CardBody, Row, Col
} from 'reactstrap';
import { addTableNum } from '../actions/index'
import NumberFormat from 'react-number-format'
import { xhr } from '../support/xhr'

const Checkout = (props) => {

  // state = {
  //     arrOrder: [],
  //     sum: 0,
  //     arrItem: [],
  //     toggleModal: false,
  //     totalSum: 0,
  //     time: 1000,
  //     seconds: 5
  // }

  const [arrOrder, setArrOrder] = useState([])
  const [seconds, setSeconds] = useState(5)
  const time = 100000

  useEffect(() => {
    getData()
    const interval = setInterval(() => getData(), time);
    const myInterval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1)
        }
        if (seconds === 0) {
          clearInterval(myInterval)
        } 
    }, 1000)

    return () => {
      clearInterval(interval)
      clearInterval(myInterval)
    }
  }, [])


  const getData = async () => {
    try {
      const res = await xhr.get('/order-cashier')
      setArrOrder(res.data)
    } catch (error) {
        console.log(error)
    }
  }

  const renderListOrder = (customer) => {
    return arrOrder.map(order => {
      return order.list.map(item => {
        return (
          <div className='d-flex py-2'>
            <div>
              <span className='mr-2'>{item.menu?.name || '-'}</span> X <span className='ml-2'>{item.quantity} pcs</span>
            </div>
            <div className='ml-auto'>
              <NumberFormat value={parseInt(item.menu?.price || 0) * parseInt(item.quantity)} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
            </div>
          </div>
        )
      })
    })
  }

  const getTotalSum = (order_id) => {
    let sum = 0
    const order = arrOrder.find((o) => o._id === order_id)
    order.list.forEach(row => {
      sum += (parseInt(row.menu?.price) * parseInt(row.quantity))
    })
    return sum
  }

  const renderOrder = () => {
    let result = arrOrder.map(order => {
      let sum = getTotalSum(order._id)
      return (
        <Col xs='12' className='p-0 m-3'  key={order._id}>
          <Link className='nav-link' to={{pathname:'/checkoutconfirmation', id: order._id}}>
            <Card className='text-light checkoutBtn'>
              <Row>
                <Col xs='4' className='ml-3 mt-3 mb-0'>
                  <h3 >Customer {order.table}</h3>
                </Col>
              </Row>
              <CardBody className='m-0'>
                {renderListOrder(order.table)}
                <div className='d-flex border-top border-light my-2'>
                  <div>
                    <h3>Total price :</h3>
                  </div>
                  <div className='ml-auto'>
                    <h3>
                      <NumberFormat value={sum} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
                    </h3>
                  </div>
                </div>
              </CardBody>
            </Card>
          </Link>
        </Col>
      )
    })
    return result
  }

  const onRetry = () => {
    setSeconds(5)
    getData()
  }

  if (props.userName && props.userType === "cashier") {
    if (arrOrder.length > 0) {
      return (
        <div className='container mt-4 checkoutOption'>
          <Row className='justify-content-center'>
            {renderOrder()}
          </Row>
        </div>
      )
    }
    if(!arrOrder.length){
      return (
        <div className='container text-center mt-4'>
          { 
            seconds === 0
              ? <h1>
                  No order yet...
                  <h6 className='m-4'>
                  <p className='textBack' onClick={onRetry}>Retry get data</p>
                  <p className='textBack' onClick={() => {props.history.push('/cashier')}}>Back to home</p>
                  </h6>
              </h1>
              : <h1>Loading... Timeout: {seconds < 10 && seconds > 1 ? `0${seconds} seconds` : seconds === 1 ? `${seconds} second` : `${seconds} seconds`}</h1>
          }
        </div>
      )
    }
  } else if (props.userType === "kitchen") {
    return (
      <Redirect to='/kitchen' />
    )
  } else if (props.userType === "waiter") {
    return (
      <Redirect to='/waiter' />
    )
  } else if (props.userType === "admin") {
    return (
      <Redirect to='/admin' />
    )
  } else {
    return (
      <Redirect to='/' />
    )
  }
}

const mapStateToProps = state => {
    return {
        userName: state.auth.userName,
        userType: state.auth.userType
    }
}

export default connect(mapStateToProps, { addTableNum })(Checkout)
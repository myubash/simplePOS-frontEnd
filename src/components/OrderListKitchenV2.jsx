/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { Redirect, } from 'react-router-dom'
import { connect } from 'react-redux'
import { Row, Col, Card, CardBody, CardFooter } from 'reactstrap'
import { xhr } from '../support/xhr'
import Swal from 'sweetalert2'

const OrderListKitchen = (props) => {

  const [arrOrder, setArrOrder] = useState([])
  const [seconds, setSeconds] = useState(5)

  useEffect(() => {
    // const interval = setInterval(() => getData(), time)
    getData()
    const myInterval = setInterval(() => {
      if (seconds > 5) {
        setSeconds(seconds - 1)
      }
      if (seconds === 0) clearInterval(myInterval)
    }, 1000)

    return () => {
      // clearInterval(interval)
      clearInterval(myInterval)
    }
  }, [])

  const getData = async () => {
    try {

      const res = await xhr.get('/order-kitchen')
      var list = res.data
      var dataCustList = []
      list.forEach((val) => {
          var dataCust = {...val}
          dataCust['table'] = val.table
          dataCust['list'] = val.list
          dataCust['name'] = val.orderNumber
          dataCustList.push(dataCust)
      })
      console.log(dataCustList)
      setArrOrder(dataCustList)
    } catch (error) {
        console.log(error)
    }
  }

  const onCancel = async (order) => {
    try {
      await xhr.put(`/order/${order._id}/cancel`)
      
      Swal.fire({
          type: 'success',
          title: `Order table ${order.table} canceled`
      })
      getData()
    } catch (error) {
      console.log(error)
    }
  }

  const onProcess = async (order) => {
    try {
      await xhr.put(`/order/${order._id}/process`)
      Swal.fire({
          type: 'success',
          title: `Order table ${order.table} on process`,
          timer: 700
      })
      getData()
    } catch (error) {
      console.log(error)
    }
  }

  const onDone = async (order) => {
    try {
      await xhr.put(`/order/${order._id}/done`)
      Swal.fire({
          type: 'success',
          title: `Order table ${order.table} done`,
          timer: 700
      })
      getData()
    } catch (error) {
      console.log(error)
    }
  }

  const renderOrder = () => {
    return arrOrder.map(order => {
      return (
        <Col xs='4' className=' my-2'>
          <Card >
              <div className='ml-2 mt-2'>
                <h4 >Customer {order.table}</h4>
                <h6>Status: {order.status}</h6>
              </div>
              <CardBody className=' px-3 py-1'>
                {renderListOrder(order.table)}
              </CardBody>
              <CardFooter className='d-flex'>
                <button className='btn btn-danger' onClick={() => onCancel(order)}>Decline order</button>
                {
                  order.statusCode === 'create'
                    ? <button className='btn ml-auto btn-warning' onClick={() => onProcess(order)}>Process order</button>
                    : <button className='btn ml-auto btn-success ml-auto px-5' onClick={() => onDone(order)}> Done</button>
                }
              </CardFooter>
          </Card>
        </Col>
      )
    })
  }

  const renderListOrder = (table) => {
    const comp = []
    arrOrder.forEach(order => {
      if (order.table === table) {
        order.list.forEach(item => {
          comp.push((
            <div className='d-flex py-2'>
              <div>
                <span className='mr-2'>{item.menu.name}</span>
              </div>
              <div className='ml-auto'>
                <span className='ml-2'>{item.quantity} pcs</span>
              </div>
            </div>
          ))
        })
      }
    })
    return comp
  }

  const onRetry = () => {
    setSeconds(5)
    getData()
  }

  if (props.userName && props.userType === "kitchen") {
    if(arrOrder.length){
      return (
          <div className='container'>
              <Row className='align-content-between mt-4 '>
                  {renderOrder()}
              </Row>
          </div>
      )
    }
    if(!arrOrder.length){
      return (
          <div className='container text-center mt-4'>
              { seconds === 0
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
  } else if (props.userType === "cashier") {
      return (
          <Redirect to='/cashier' />
      )
  } else if (props.userType === "admin") {
      return (
          <Redirect to='/admin' />
      )
  } else if (props.userType === "waiter") {
      return (
          <Redirect to='/waiter' />
      )
  } else {
      return (
          <Redirect to='/' />
      )
  }
}

// export class OrderListKitchen extends Component {

//     state = {
//         arrOrder: [],
//         time: 1000,
//         seconds: 5
//     }

//     async componentDidMount() {
//         this.interval = setInterval(()=>this.getData(), this.state.time);
//         this.myInterval = setInterval(() => {
//             const { seconds } = this.state
//             if (seconds > 0) {
//                 this.setState(({ seconds }) => ({
//                     seconds: seconds - 1
//                 }))
//             }
//             if (seconds === 0) {
//                     clearInterval(this.myInterval)

//             } 
//         }, 1000)

//     }

//     getData = async () => {
//         try {
//             let res = await axios.get(
//                 url + '/order/kitchen',
//             )
//             if(res.data.error) return alert(res.data.error)
//             // console.log(res.data.list)
//             var list = res.data.list
//             let data = []
//             let dor = res.data.list.forEach(val => {
//                 data.push(val.customerTable)
//             })
//             let jedor = [...new Set(data)]
//             var dataCustList = []
//             jedor.forEach((val) => {
//                 var dataCust = {}
//                 dataCust['customerTable'] = val
//                 dataCust['list'] = []
//                 dataCust['name'] = null
//                 var temp = []

//                 list.forEach((dataList) => {
//                     if(val == dataList.customerTable){
//                         temp.push(dataList)
//                         // if(dataList.customerTable.split('-').length === 2){
//                         //     dataCust.name = dataList.customerTable.split('-')[1]
//                         // }
//                     }
                    
//                 })
//                 dataCust['list'] = temp
//                 dataCustList.push(dataCust)
//             })
//             console.log(dataCustList)
//             this.setState({ arrOrder: dataCustList })
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     componentWillUnmount() {
//         clearInterval(this.interval);
//     }


//     onDelete = async (customerTable) => {
//         try {
//             let res = await axios.delete(
//                 url + '/order/kitchen/' + customerTable
//             )
//             if(res.data.error) return alert(res.data.error)
//             Swal.fire({
//                 type: 'success',
//                 title: 'Delete customer ' + customerTable + ' success'
//             })
//             this.getData()
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     onDone = async (customerTable) => {
//         try {
//             let res = await axios.patch(
//                 url + '/order/kitchen/' + customerTable
//             )
//             if(res.data.error) return alert(res.data.error)
//             Swal.fire({
//                 type: 'success',
//                 title: 'Order customer' + customerTable + ' done',
//                 timer: 700
//             })
//             this.getData()
//         } catch (error) {
//             console.log(error)
//         }
//     }

//     renderOrder = () => {
//         return this.state.arrOrder.map(val => {
//             return (
//                 <Col xs='4' className=' my-2'>
//                     <Card >
//                         <div className='ml-2 mt-2'>
//                             <h4 >Customer {val.customerTable}</h4>
//                         </div>
//                         <CardBody className=' px-3 py-1'>
//                             {this.renderListOrder(val.customerTable)}
//                         </CardBody>
//                         <CardFooter className='d-flex'>
//                             <button className='btn btn-danger' onClick={() => this.onDelete(val.customerTable)}>Decline order</button>
//                             <button className='btn btn-success ml-auto px-5' onClick={() => this.onDone(val.customerTable)}> DONE</button>
//                         </CardFooter>
//                     </Card>
//                 </Col>
//             )
//         })
//     }

//     renderListOrder = (customer) => {
//         return this.state.arrOrder.map(order => {
//             if (order.customerTable === customer) {
//                 return order.list.map(item => {
//                     // sum = sum + (parseInt(item.productPrice) * parseInt(item.qty))
//                     return (<div className='d-flex py-2' onClick={()=>this.onDeleteItem(item.id,item.productName)}>
//                         <div>
//                             <span className='mr-2'>{item.productName}</span>
//                         </div>
//                         <div className='ml-auto'>
//                             <span className='ml-2'>{item.qty} pcs</span>
//                         </div>
//                     </div>
//                     )
//                 })
//             }
//         })
//     }

//     onDeleteItem = async (id,name) => {
//         let result = await Swal.fire({
//             title:`delete ${name} ?`,
//             showCancelButton:true
//         })
//         if(!result.value){
//             return Swal.fire({
//                 title: `Delete ${name} canceled`
//             })
//         }

//         let resp = await axios.delete(
//             url+'/deleteitem/'+id
//         )
//         if(resp.data.error) return alert(resp.data.error)
        
//     }

//     onRetry = () => {
//         this.setState({seconds:5})
//         this.componentDidMount()
//     }

//     render() {
//         if (this.props.userName && this.props.userType === "kitchen") {
//             if(this.state.arrOrder.length){
//                 return (
//                     <div className='container'>
//                         <Row className='align-content-between mt-4 '>
//                             {this.renderOrder()}
//                         </Row>
//                     </div>
//                 )
//             }
//             if(!this.state.arrOrder.length){
//                 const { seconds } = this.state
//                 return (
//                     <div className='container text-center mt-4'>
//                         { seconds === 0
//                             ? <h1>
//                                 No order yet...
//                                 <h6 className='m-4'>
//                                 <p className='textBack' onClick={this.onRetry}>Retry get data</p>
//                                 <p className='textBack' onClick={() => {this.props.history.push('/cashier');clearInterval(this.interval)}}>Back to home</p>
//                                 </h6>
//                             </h1>
//                             : <h1>Loading... Timeout: {seconds < 10 && seconds > 1 ? `0${seconds} seconds` : seconds === 1 ? `${seconds} second` : `${seconds} seconds`}</h1>
//                         }
//                     </div>
//                 )
//             }
            
//         } else if (this.props.userType === "cashier") {
//             return (
//                 <Redirect to='/cashier' />
//             )
//         } else if (this.props.userType === "admin") {
//             return (
//                 <Redirect to='/admin' />
//             )
//         } else if (this.props.userType === "waiter") {
//             return (
//                 <Redirect to='/waiter' />
//             )
//         } else {
//             return (
//                 <Redirect to='/' />
//             )
//         }
//     }
// }


const mapStateToProps = state => {
    return {
        userName: state.auth.userName,
        userType: state.auth.userType
    }
}

export default connect(mapStateToProps, null)(OrderListKitchen)

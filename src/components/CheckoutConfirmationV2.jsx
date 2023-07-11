/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { Redirect, Link } from 'react-router-dom'
import { connect } from 'react-redux'
import {
  Row, Col,
} from 'reactstrap';
import Swal from 'sweetalert2';
import { pdf } from "@react-pdf/renderer";
import { PdfDocument } from "./Invoice";
import NumberFormat from 'react-number-format'
import { xhr } from '../support/xhr'

const CheckoutConfirmation = (props) => {
  var today = new Date();
  var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
  var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  var dateTime = date+' '+time;

  const [dataOrder, setDataOrder] = useState(null)
  const [sum, setSum] = useState(0)
  const [paid, setPaid] = useState(false)
  const [cash, setCash] = useState(0)
  const [total, setTotal] = useState(0)
  const [change, setChange] = useState(0)

  useEffect(() => {
    (async () => {
      const id = props.location.id
      const res = await xhr.get(`/order/${id}`)
      const {data} = res
      setDataOrder(data)
      let sum = 0
      data.list.forEach(row => {
        sum += (parseInt(row.menu.price) * parseInt(row.quantity))
      })
      setSum(sum + (sum * 0.1)) // ppn 10%
      setTotal(parseInt(sum)+(sum*0.1))
    })()
  } , [])

  const renderListOrder = () => {
    return dataOrder.list.map(item => {
      return (
        <div className='d-flex py-2 text-center'>
          <div>
            <h5>
              <span className='mr-2'>{item.quantity}</span> <span className='ml-2'>{item.menu.name}</span>
            </h5>
          </div>
          <div className='ml-auto'>
            <h5>
              <NumberFormat value={parseInt(item.menu.price) * parseInt(item.quantity)} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
            </h5>
          </div>
        </div>
      )
    })
  }

  const getTotalSum = (data) => {
      let sum = 0
      data.list.forEach(row => {
        sum += (parseInt(row.menu.price) * parseInt(row.quantity))
      })
      return sum
  }

  const onSubmit = async () => {

    const formdata = {
      order: dataOrder._id,
      totalPrice: sum,
      note: ''
    }
    try {
      const res = await xhr.post('/invoice/create', formdata)
      Swal.fire({
          type: 'success',
          title: res.message,
          timer: 700
      })
      props.history.push('/checkout')
    } catch (error) {
      console.log(error)
    }
  }

  const onPrint = async () => {
      const blob = await pdf((
          <PdfDocument
            dateTime={dateTime} data={dataOrder} cashier={props.userName} customer={dataOrder.table} cash={cash} change={change}
            fileName= {Date.now() + "-invoice.pdf"}
          />
      )).toBlob();
      const fileURL = URL.createObjectURL(blob);
      window.open(fileURL)
  }

  const renderOrder = () => {
    if (!dataOrder) return null
    let sum = getTotalSum(dataOrder)
    return (
      <Col xs='10' className='p-0'  key={dataOrder._id}>
        <Col xs='6' className='text-center mx-auto'>
          {renderListOrder()}
        </Col>
        <div className=' border-top border-dark my-2 pt-2'>
          <Col xs='12' className='d-flex'>
          <div>
            <h4>Sub total :</h4>
          </div>
          <div className='ml-auto'>
            <h4>
              <NumberFormat value={sum} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
            </h4>
          </div>
          </Col>
          <Col xs='12' className='d-flex'>
          <div>
            <h4>PPN 10% :</h4>
          </div>
          <div className='ml-auto'>
            <h4>
              <NumberFormat value={parseInt(sum*0.1)} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
            </h4>
          </div>
          </Col>
          <Col xs='12' className='d-flex'>
          <div>
            <h4>Grand total :</h4>
          </div>
          <div className='ml-auto'>
            <h4>
              <NumberFormat value={parseInt(sum + (sum*0.1))} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
            </h4>
          </div>
          </Col>
        </div>
      </Col>
    )
  }

  const inputCash = e => {
    setCash(e.target.value)
  };

  const onPaid = () => {
    let change = parseInt(cash - total)
    if(change < 0) return alert('Insufficient cash')
    setChange(change)
    setPaid(true)
  }


  if(!props.location.id)return (
      <Redirect to='/checkout' />
  )
  if (props.userName && props.userType === "cashier") {
    if (!dataOrder) return (
      <div className='container mt-4 checkoutOption text-center'>
        <h1>Loading...</h1>
      </div>
    )
    let customerTable = ' ' + dataOrder.table
    return (
      <div className='container mt-4'>
        <Row className='justify-content-center'>
          <Col xs='6'>
            <h4>
              Checkout time :
              <p>{dateTime}</p>
            </h4>
          </Col>
          <Col xs='6'>
            <h4 className='float-right'>
              Cashier :
              <br/>
              <p className='float-right'>{'  '+props.userName}</p>
            </h4>
          </Col>
          <Col xs='12'>
            <h4 className='float-right'>
              Customer :
              <p className='float-right'>{customerTable}</p>
            </h4>
          </Col>
          
          {renderOrder()}

          {
            paid
            ? <>
                <Col xs='8' className='border-top border-dark p-0 pt-3 mt-3'>
                  <Col xs='12' className='d-flex'>
                    <div>
                      <h4>Cash :</h4>
                    </div>
                    <div className='ml-auto'>
                      <h4>
                        <NumberFormat value={cash} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
                      </h4>
                    </div>
                  </Col>
                  <Col xs='12' className='d-flex'>
                    <div>
                      <h4>Change :</h4>
                    </div>
                    <div className='ml-auto'>
                      <h4>
                      <NumberFormat value={parseInt(change)} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
                      </h4>
                    </div>
                  </Col>
                </Col>
                <Col xs='12' className='text-center mt-3'>
                  <button onClick={()=>{
                    onPrint();
                    // onSubmit()
                  }} className='m-2 btn btn-success'>Confirm</button>
                  <button onClick={() => setPaid(false)} className='m-2 btn btn-danger'>Change payment</button>
                  <Link to='/checkout'>
                    <button className='btn btn-danger'>Back</button>
                  </Link>
                </Col>
              </>
            : <Col xs='12' className='text-center'>
                  <h4>Input cash</h4>
                  <Col xs='4' className='input-group mb-3 mx-auto'>
                    <div class="input-group-prepend">
                      <span class="input-group-text">Rp</span>
                    </div>
                    <input style={{textAlign:'right'}} onChange={e => inputCash(e)} value={cash} type="number" class="form-control" aria-label="Amount (to the nearest dollar)"/>
                  </Col>
                  <Col xs='12' className='text-center mt-3'>
                    <button onClick={onPaid} className='m-2 btn btn-success'>Accept</button>
                    <Link to='/checkout'>
                      <button className='m-2 btn btn-danger'>Cancel</button>
                    </Link>
                  </Col>
              </Col>
          }
        </Row>
      </div>
    )
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

// export class Checkout extends Component {
//     state = {
//         arrOrder: [],
//         sum: 0,
//         arrItem: [],
//         toggleModal: false,
//         totalSum: 0,
//         paid: false,
//         cash: 0,
//         total: 0,
//         change: 0,
//         canCheckout: false
//     }

//     async componentDidMount() {
//         if(!this.props.location.customerTable)return (
//             null
//         )
//         try {
//             let res = await axios.get(
//                 url + '/order/cashier/' + this.props.location.customerTable,
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
//                 var temp = []
//                 list.forEach((dataList) => {
//                     if(val == dataList.customerTable){
//                         temp.push(dataList)
//                     }
//                 })
//                 dataCust['list'] = temp
//                 dataCustList.push(dataCust)
//             })
//             console.log(dataCustList)
//             let sum = 0
//             dataCustList.map(val => {
//                 val.list.map(item => {
//                     sum += parseInt(item.productPrice) * parseInt(item.qty)
//                 })
//             })
//             this.setState({ arrOrder: dataCustList,total: parseInt(sum)+(sum*0.1) })

//         } catch (error) {
//             console.log(error)
//         }
//     }

//     renderListOrder = (customer) => {
//         return this.state.arrOrder.map(order => {
//             if (order.customerTable === customer) {
//                 return order.list.map(item => {
//                     return (<div className='d-flex py-2 text-center'>
//                         <div>
//                             <h5>
//                             <span className='mr-2'>{item.qty}</span> <span className='ml-2'>{item.productName}</span>
//                             </h5>
//                         </div>
//                         <div className='ml-auto'>
//                             <h5>
//                                 <NumberFormat value={parseInt(item.productPrice) * parseInt(item.qty)} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
//                             </h5>
//                         </div>
//                     </div>
//                     )
//                 })
//             }
//         })
//     }



//     dor = () => {
//         console.log(this.state.orderId)
//     }

//     totalSum = (table) => {
//         let sum = 0
//         this.state.arrOrder.map(item => {
//             if (item.customerTable === table) {
//                 item.list.map(val => {
//                     sum += parseInt(val.productPrice) * parseInt(val.qty)
//                 })
//             }
//         })
//         return sum
//     }

//     onSubmit = async () => {

//         var today = new Date();
//         var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
//         var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
//         var dateTime = date+' '+time;

//         let array = []
//         array.push(this.state.arrOrder[0].list)
//         array[0].forEach(function(v) {
//             delete v.productName;
//         });
//         array[0].forEach(function(v) {
//             delete v.productPrice;
//         });
//         var result = array[0].map(val =>  {
//             val.checkout_time = dateTime;
//             return val;
//         })
//         let data = result.reduce(
//             (acc, obj) => [...acc, Object.values(obj).map(y => (y))],
//             []
//         );
//         try {
//             let address = url + '/order/cashier/' + data[0][2]
//             let resp = await axios.post(
//                 address,
//                 { 
//                     list: data
//                 }
//             )
//             if(resp.data.error) return alert(resp.data.error)
//             Swal.fire({
//                 type: 'success',
//                 title: 'Checkout success',
//                 timer: 700
//             })
//             this.setState({ orderId: 0, toggleModal: !this.state.toggleModal })
//             console.log(resp)
//             this.props.history.push('/checkout')
//         } catch (error) {
//             console.log(error)
//         }
//     }

    
//     onPrint = async () => {
//         var today = new Date();
//         var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
//         var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
//         var dateTime = date+' '+time;
//         const blob = await pdf((
//             <PdfDocument
//             dateTime={dateTime} data={this.state.arrOrder[0]} cashier={this.props.userName} customer={this.props.location.customerTable} cash={this.state.cash} change={this.state.change}
//             fileName= {Date.now() + "-invoice.pdf"}
//             />
//         )).toBlob();
//         const fileURL = URL.createObjectURL(blob);
//         window.open(fileURL)
//     }

//     renderOrder = () => {

//         let result = this.state.arrOrder.map(order => {
//             let sum = this.totalSum(order.customerTable)
//             return (
//                     <Col xs='10' className='p-0'  key={order.id}>
//                         <Col xs='6' className='text-center mx-auto'>
//                                 {this.renderListOrder(order.customerTable)}
//                         </Col>
//                                 <div className=' border-top border-dark my-2 pt-2'>
//                                     <Col xs='12' className='d-flex'>
//                                     <div>
//                                         <h4>Sub total :</h4>
//                                     </div>
//                                     <div className='ml-auto'>
//                                         <h4>
//                                             <NumberFormat value={sum} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
//                                         </h4>
//                                     </div>
//                                     </Col>
//                                     <Col xs='12' className='d-flex'>
//                                     <div>
//                                         <h4>PPN 10% :</h4>
//                                     </div>
//                                     <div className='ml-auto'>
//                                         <h4>
//                                             <NumberFormat value={sum*0.1} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
//                                         </h4>
//                                     </div>
//                                     </Col>
//                                     <Col xs='12' className='d-flex'>
//                                     <div>
//                                         <h4>Grand total :</h4>
//                                     </div>
//                                     <div className='ml-auto'>
//                                         <h4>
//                                             <NumberFormat value={sum + (sum*0.1)} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
//                                         </h4>
//                                     </div>
//                                     </Col>
//                                 </div>
//                     </Col>

//             )
//         })
//         return result
//     }

//     inputCash = e => {
//         let cash = parseInt(e.target.value);
//         if (isNaN(cash)) {
//             return this.setState({ cash: 0 });
//         }
//         this.setState({ cash: cash });
//     };

//     onPaid = () => {
//         let change = this.state.cash - this.state.total
//         if(change < 0) return alert('Insufficient cash')
//         this.setState({change: change,paid: true})
//     }

//     render() {
//         var today = new Date();
//         var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
//         var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
//         var dateTime = date+' '+time;
//         if(!this.props.location.customerTable)return (
//             <Redirect to='/checkout' />
//         )
//         if (this.props.userName && this.props.userType === "cashier") {
//             if (this.state.arrOrder.length > 0) {
//                 let customerTable = ' '+this.props.location.customerTable
//                 return (
//                     <div className='container mt-4'>
//                         <Row className='justify-content-center'>
//                             <Col xs='6'>
//                                 <h4>
//                                 Checkout time :
//                                 <p>{dateTime}</p>
//                                 </h4>
//                             </Col>
//                             <Col xs='6'>
//                                 <h4 className='float-right'>
//                                 Cashier :
//                                 <br/>
//                                 <p className='float-right'>{'  '+this.props.userName}</p>
//                                 </h4>
//                             </Col>
//                             <Col xs='12'>
//                                 <h4 className='float-right'>
//                                 Customer :
//                                 <p className='float-right'>{customerTable}</p>
//                                 </h4>
//                             </Col>
                            
//                             {this.renderOrder()}
//                             {
//                                 this.state.paid
//                                 ?
//                                 <Col xs='8' className='border-top border-dark p-0 pt-3 mt-3'>
//                                     <Col xs='12' className='d-flex'>
//                                             <div>
//                                                 <h4>Cash :</h4>
//                                             </div>
//                                             <div className='ml-auto'>
//                                                 <h4>
//                                                 <NumberFormat value={this.state.cash} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
//                                                 </h4>
//                                             </div>
//                                     </Col>
//                                     <Col xs='12' className='d-flex'>
//                                             <div>
//                                                 <h4>Change :</h4>
//                                             </div>
//                                             <div className='ml-auto'>
//                                                 <h4>
//                                                 <NumberFormat value={this.state.change} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} />
//                                                 </h4>
//                                             </div>
//                                     </Col>
//                                 </Col>
//                                 :
//                                 null
//                             }
//                             {
//                                 this.state.paid
//                                 ?
//                                 null
//                                 :
//                                 <Col xs='12' className='text-center'>
//                                     <h4>Input cash</h4>
//                                     <Col xs='4' className='input-group mb-3 mx-auto'>
//                                     <div class="input-group-prepend">
//                                         <span class="input-group-text">Rp</span>
//                                     </div>
//                                     <input style={{textAlign:'right'}} onChange={e => this.inputCash(e)} value={this.state.cash} type="text" class="form-control" aria-label="Amount (to the nearest dollar)"/>
//                                     </Col>
//                                     <Col xs='12' className='text-center mt-3'>
//                                     <button onClick={this.onPaid} className='m-2 btn btn-success'>Accept</button>
//                                     <Link to='/checkout'>
//                                         <button className='m-2 btn btn-danger'>Cancel</button>
//                                     </Link>
//                                     </Col>
//                                 </Col>
//                             }
//                             {
//                                 this.state.paid
//                                 ?
//                                 <Col xs='12' className='text-center mt-3'>
//                                         <button onClick={()=>{this.onPrint();this.onSubmit()}} className='m-2 btn btn-success'>Confirm</button>
//                                         <button onClick={() => this.setState({paid: false})} className='m-2 btn btn-danger'>Change payment</button>
//                                         <Link to='/checkout'>
//                                         <button className='btn btn-danger'>Back</button>
//                                         </Link>
//                                 </Col>
//                                 :
//                                 null
//                             }
                            
//                         </Row>
//                     </div>
//                 )
//             }
//             else {
//                 return (
//                 <div className='container mt-4 checkoutOption text-center'>
//                     <h1>Loading...</h1>
//                 </div>
//                 )
//             }
//         } else if (this.props.userType === "kitchen") {
//             return (
//                 <Redirect to='/kitchen' />
//             )
//         } else if (this.props.userType === "waiter") {
//             return (
//                 <Redirect to='/waiter' />
//             )
//         } else if (this.props.userType === "admin") {
//             return (
//                 <Redirect to='/admin' />
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

export default connect(mapStateToProps)(CheckoutConfirmation)
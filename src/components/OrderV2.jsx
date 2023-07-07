/* eslint-disable array-callback-return */
import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Card,
  CardImg,
  CardTitle,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from "reactstrap";
import darwin from "../assets/darwin.png";
import { Redirect, Link } from "react-router-dom";
import { connect } from "react-redux";

import { delTableNum } from "../actions/index";
import Swal from "sweetalert2";
import { Transition } from "react-transition-group";
import NumberFormat from 'react-number-format'

import { xhr } from '../support/xhr'

let urlLokal = `http://localhost:2000/api/`


// TRANSITION DURATION
const duration = 500;

// TRANSITION
const sidebarStyle = {
  transition: `width ${duration}ms`
};

// WIDTH SETTING
const sidebarTransitionStyles = {
  entering: { width: 0 },
  entered: { width: "300px" },
  exiting: { width: "300px" },
  exited: { width: 0 }
};

// OPACITY TRANSITION DURATION (same as width duration)
const linkStyle = {
  transition: `opacity ${duration}ms`
};

// LINK OPACITY SETTING
const linkTransitionStyles = {
  entering: { opacity: 0 },
  entered: { opacity: 1 },
  exiting: { opacity: 1 },
  exited: { opacity: 0 }
};

const Order = (props) => {

  const [arrMenu, setArrMenu] = useState([])
  const [productDetail, setProductDetail] = useState([])
  const [arrOrder, setArrOrder] = useState([])
  const [qty, setQty] = useState(0)
  const [modal, setModal] = useState(false)
  const [isOpen, setOpen] = useState(false)

  // SIDEBAR FRAME
  const renderLinks = () => {
    return (
      <Transition in={isOpen} timeout={duration}>
        {state => (
          <div
            className="mt-2"
            style={{
              ...linkStyle,
              ...linkTransitionStyles[state]
            }}
          >
            <div>{renderOrders()}</div>
          </div>
        )}
      </Transition>
    );
  };

  // RENDER ORDERS
  const renderOrders = () => {
    // let { id, customerId, orderDetail, status } = arrOrder
    return arrOrder.map(order => {
      return (
        <Row className="container mx-auto">
          <Col xs="11" className="border-bottom border-top border-dark p-0">
            <div className="d-flex py-4">
              <div className="pt-1 ml-2">{order.name}</div>
              <div className="ml-auto pt-1">Qty : {order.qty}</div>
              <div className="ml-auto">
                <button
                  className="btn btn-danger"
                  onClick={() => onDelete(order.productId)}
                >
                  X
                </button>
              </div>
            </div>
          </Col>
        </Row>
      );
    });
  };

  // RENDER CONFIRMATION
  const renderConfirmation = () => {
    return arrOrder.map(order => {
      return (
        <Row className="container mx-auto">
          <Col xs="11" className="border-bottom border-top border-dark p-0">
            <div className="d-flex py-4">
              <div className="pt-1 ml-2">{order.name}</div>
              <div className="ml-auto pt-1">Qty : {order.qty}</div>
            </div>
          </Col>
        </Row>
      );
    });
  };

  // DELETE ORDER CONTENT
  const onDelete = id => {
    let array = [...arrOrder];
    let index = array
      .map(function(e) {
        return e.productId;
      })
      .indexOf(id);
    if (index === -1) return alert("No index");
    array.splice(index, 1);
    setArrOrder(array)
  };

  // SUBMIT ORDER
  const onSubmit = async () => {
    toggle();

    arrOrder.forEach(function(v) {
      delete v.name;
    });
    arrOrder.forEach(function(v) {
      delete v.type;
    });
    arrOrder.forEach(function(v) {
      delete v.price;
    });
    let data = arrOrder.reduce(
      (acc, obj) => [...acc, Object.values(obj).map(y => y)],
      []
    );
    
    const formdata = {
      table: props.tableNum,
      note: '',
      list: data.map(row => ({
        menu: row[0],
        note: '',
        quantity: row[2]
      }))

    }

    try {
      await xhr.post('/order/create', formdata)
      Swal.fire('Ordered', '', 'success')
    } catch (error) {
      console.log(error)
    }
  };

  // TOGGLE DETAIL
  const toggle = () => {
    setModal(!modal)
  };

  // TOGGLE SIDEBAR
  const toggleSidebar = () => {
    setOpen(!isOpen)
  };

  // GET MENU INFO
  useEffect(() => {
    (async () => {
      try {
        const res = await xhr.get('/menu')
        setArrMenu(res.data)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])

  // RENDER CATEGORY MAIN COURSE
  const renderMainCourse = () => {
    let result = arrMenu.map(product => {
      if (product.type.name === "Main Course") {
        return (
          <Col xs="3">
            <Button
              onClick={() =>
                addDetail(
                  product.name,
                  product.description,
                  product.price,
                  product._id,
                  product.type,
                  product.photos

                )
              }
              className="menuItem my-1 btn btn-dark"
            >
              {/* <CardTitle> */}
                <h4>{product.name.toUpperCase()}</h4>
                <p>Price: <NumberFormat value={product.price} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></p>
              {/* </CardTitle> */}
            </Button>
          </Col>
        );
      }
    });
    return result;
  };

  // RENDER CATEGORY SIDE DISH
  const renderSideDish = () => {
    let result = arrMenu.map(product => {
      if (product.type.name === "Side Dish") {
        return (
          <Col xs="3">
            <Button
              onClick={() =>
                addDetail(
                  product.name,
                  product.description,
                  product.price,
                  product._id,
                  product.type,
                  product.photos
                )
              }
              className="menuItem my-1 btn btn-dark"
            >
              {/* <CardTitle> */}
                <h4>{product.name.toUpperCase()}</h4>
                <p>Price: <NumberFormat value={product.price} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></p>
              {/* </CardTitle> */}
            </Button>
          </Col>
        );
      }
    });
    return result;
  };

  // RENDER CATEGORY BEVERAGE
  const renderBeverage = () => {
    let result = arrMenu.map(product => {
      if (product.type.name === "Beverage") {
        return (
          <Col xs="3">
            <Button
              onClick={() =>
                addDetail(
                  product.name,
                  product.description,
                  product.price,
                  product._id,
                  product.type,
                  product.photos
                )
              }
              className="menuItem my-1 btn btn-dark"
            >
              {/* <CardTitle> */}
                <h4>{product.name.toUpperCase()}</h4>
                <p>Price: <NumberFormat value={product.price} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></p>
              {/* </CardTitle> */}
            </Button>
          </Col>
        );
      }
    });
    return result;
  };

  // RENDER CATEGORY MENUSET
  const renderMenuSet = () => {
    let result = arrMenu.map(product => {
      if (product.type.name === "Menu Set") {
        return (
          <Col xs="3">
            <Button
              onClick={() =>
                addDetail(
                  product.name,
                  product.description,
                  product.price,
                  product._id,
                  product.type,
                  product.photos
                )
              }
              className="menuItem my-1 btn btn-dark"
            >
              {/* <CardTitle> */}
                <h4>{product.name.toUpperCase()}</h4>
                <p>Price: <NumberFormat value={product.price} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></p>
              {/* </CardTitle> */}
            </Button>
          </Col>
        );
      }
    });
    return result;
  };

  // ADD DETAIL INFO
  const addDetail = (name, description, price, id, type,photos) => {
    setProductDetail([{ name, description, price, id, type, photos }])
    setQty(0)
  };

  // DELETE DETAIL INFO
  const delDetail = () => {
    setProductDetail([])
  };

  // DECREASE INPUT QTY
  const decQty = () => {
    if (qty > 0) {
      setQty(qty - 1)
    }
  };

  // INCREASE INPUT QTY
  const incQty = () => {
    if (qty >= 0) {
      setQty(qty + 1)
    }
  };

  // DECREASE INPUT QTY BY 5
  const decQty5 = () => {
    if (qty >= 5) {
      setQty(qty - 5)
    }
    if (qty < 5) {
      setQty(0)
    }
  };

  // INCREASE INPUT QTY BY 5
  const incQty5 = () => {
    if (qty >= 0) {
      setQty(qty + 5)
    }
  };

  // RESET INPUT QTY
  const resetQty = () => {
    setQty(0)
  };

  // INPUT ORDER TO SIDEBAR
  const addOrder = async (name, price, id, type) => {
    if (qty === 0) {
      return alert("Please insert quantity");
    }
    if (qty > 100) {
      return alert("Qty over limit")
    }
    let dor = arrOrder.filter(val => {
      console.log(val.id, id, 'ini')
      return val.id === id;
    });
    if (dor.length > 0) {
      let sum = parseInt(dor[0].qty) + parseInt(qty);
      if(sum > 100) {
        return alert('Qty cannot be more than 100 pcs')
      }
      let array = [...arrOrder];
      let index = array
        .map(function(e) {
          return e.productId;
        })
        .indexOf(id);
      if (index === -1) return alert("No index");
      array.splice(index, 1);
      Swal.fire({
        title:`${name} qty updated to ${sum} pcs`,
        timer: 1000,
        showConfirmButton: false,
        width:'50%',
        height:'40%'
      })
      return setArrOrder([
        ...array,
        {
          name: name,
          price: price,
          productId: id,
          type: type,
          customerTable: props.tableNum,
          qty: sum
        }
      ])
    }
    Swal.fire({
      title:`${qty} pcs ${name} added`,
      timer: 1000,
      showConfirmButton: false,
      width:'50%',
      height:'40%'
    })
    setArrOrder([
      ...arrOrder,
      {
        name: name,
        price: price,
        productId: id,
        type: type,
        customerTable: props.tableNum,
        qty
      }
    ])
  };

  // QTY INPUT FN
  const inputQty = e => {
    let qty = parseInt(e.target.value);
    if (isNaN(qty)) {
      return setQty(0)
    }
    setQty(qty)
  };

  // RENDER DETAILED MENU ITEM
  const showDetail = () => {
    let result = productDetail.map(product => {
      console.log(product, 'ini')
      return (
        <Row className="mt-3 mb-3">
          <Col xs="3" className='text-center'>
            {
              product.photos === 'null'
              ?
              <CardImg
                left={true.toString()}
                style={{width:200,height:180}}
                className="mx-auto my-2"
                src={darwin}
                alt=""
              />
              :
              <CardImg
              left={true.toString()}
                style={{width:200,height:180}}
                className="mx-auto my-2"
              src={urlLokal+product.photos}
              alt=""
              />
            }
            
            <button
              className="btn btn-warning btn-block h-25"
              onClick={() =>
                addOrder(
                  product.name,
                  product.price,
                  product.id,
                  product.type
                )
              }
            >
              Add order
            </button>
          </Col>
          <Col xs="8" className="align-content-center">
            <Card className="text-center ">
              <CardTitle className="mt-2">
                <h3 className="text-center">{product.name}</h3>
              </CardTitle>
            </Card>
            <Card className="text-center mt-2 pb-2 overflowTest">
              <CardTitle className="mt-2">
                <h3>{product.description}</h3>
              </CardTitle>
            </Card>
            <Card className="mt-3 ">
              <CardTitle className="my-3 text-center">
                <h5 className="mb-0">
                  Qty :
                  <span className="ml-3">
                    <button
                      className="btn btn-info mr-2"
                      onClick={decQty5}
                    >
                      -5
                    </button>
                    <button className="btn btn-info mr-2" onClick={decQty}>
                      -
                    </button>
                    <input
                      style={{textAlign:'center'}}
                      type="text"
                      min="0"
                      maxLength='3'
                      onChange={e => inputQty(e)}
                      value={qty}
                    />
                    <button className="btn btn-info ml-2" onClick={incQty}>
                      +
                    </button>
                    <button
                      className="btn btn-info ml-2"
                      onClick={incQty5}
                    >
                      +5
                    </button>
                    <button
                      className="btn btn-danger ml-2"
                      onClick={resetQty}
                    >
                      Reset
                    </button>
                  </span>
                </h5>
              </CardTitle>
            </Card>
          </Col>
          <Col className="pl-0" xs="1">
            <button className="h-100 btn btn-danger" onClick={delDetail}>
              Cancel
            </button>
          </Col>
        </Row>
      );
    });
    return result;
  };

  // RESET DETAILED MENU ITEM
  // const resetDetail = () => {
  //   setProductDetail([])
  // };

  const resetTable = () => {
    delTableNum()
  };

  if (
    props.userName &&
    (props.userType === "cashier" || props.userType === "waiter") &&
    props.tableNum
  ) {

    if(!arrMenu.length){
      return(
          <div className='text-center'>
              <h1>
                  Loading...
              </h1>
          </div>
      )
  }
    if(props.tableNum.split('-')[0] === 'takeaway' && !props.tableNum.split('-')[1]){
      props.delTableNum()
      return <Redirect to="/table" />;
    }
    return (
      <div className="app">
        <div className="sidebar-container">
          {isOpen === true ? (
            <div className="d-flex ">
              <button
                onClick={toggleSidebar}
                className="btn btn-block btn-primary py-3 mb-2 mx-0 px-0"
              >
                Close
              </button>
            </div>
          ) : (
            <div className="d-flex h-100 justify-content-start ">
              <button
                onClick={toggleSidebar}
                className="btn btn-primary btn-block p-1"
              >
                Order List
              </button>
            </div>
          )}
          {isOpen === true ? (
            <div>
              <Transition in={isOpen} timeout={duration}>
                {state => (
                  <div
                    className="sidebar"
                    style={{
                      ...sidebarStyle,
                      ...sidebarTransitionStyles[state]
                    }}
                  >
                    <div>{renderLinks()}</div>
                    {arrOrder.length > 0 ? (
                      <div>
                        <button
                          className="btn btn-block btn-success mt-5 py-3 px-0"
                          onClick={toggle}
                        >
                          Submit order
                        </button>
                        <Modal
                          isOpen={modal}
                          toggle={toggle}
                          className={props.className}
                        >
                          <ModalHeader
                            toggle={toggle}
                            className="px-auto "
                          >
                            Confirmation
                          </ModalHeader>
                          <ModalBody>{renderConfirmation()}</ModalBody>
                          <ModalFooter>
                            <Link to="/table">
                              <Button color="primary" onClick={onSubmit}>
                                Confirm
                              </Button>
                            </Link>
                            <Button color="danger" onClick={toggle}>
                              Cancel
                            </Button>
                          </ModalFooter>
                        </Modal>
                      </div>
                    ) : (
                      ""
                    )}
                  </div>
                )}
              </Transition>
            </div>
          ) : (
            ""
          )}
        </div>
        <div className="container">
          {productDetail.length ? showDetail() : ""}
          <Row className="container mx-auto menu">
            <Col xs="11" className="border-bottom border-top border-dark">
              <h2>Menu Set</h2>
              <Row className="produk text-center ">
                {renderMenuSet()}
              </Row>
            </Col>
            <Col xs="11" className="border-bottom border-top border-dark">
              <h2>Main Course</h2>
              <Row className="produk text-center">
                {renderMainCourse()}
              </Row>
            </Col>
            <Col xs="11" className="border-bottom border-top border-dark">
              <h2>Side Dish</h2>
              <Row className="produk text-center">
                {renderSideDish()}
              </Row>
            </Col>
            <Col xs="11" className="border-bottom border-top border-dark">
              <h2>Beverage</h2>
              <Row className="produk text-center">
                {renderBeverage()}
              </Row>
            </Col>
          </Row>
        </div>
        <Link to="/table" className="d-flex justify-content-end ">
          <button className="btn btn-primary" onClick={resetTable}>
            Back
          </button>
        </Link>
        <div key="extra" style={{ height: 600 }}></div>
      </div>
    );
  } else if (props.userType === "kitchen") {
    return <Redirect to="/kitchen" />;
  } else if (props.userType === "admin") {
    return <Redirect to="/admin" />;
  } else if (!props.tableNum) {
    return <Redirect to="/table" />;
  } else {
    return <Redirect to="/" />;
  }
}



const mapStateToProps = state => {
  return {
    userName: state.auth.userName,
    userType: state.auth.userType,
    tableNum: state.tableNum.tableNum
  };
};

export default connect(mapStateToProps, { delTableNum })(Order);

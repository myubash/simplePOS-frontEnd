import React, { Component } from "react";
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

import axios from "axios";
import { delTableNum } from "../actions/index";
import Swal from "sweetalert2";
import { Transition } from "react-transition-group";
import NumberFormat from 'react-number-format'

import url from "../support/url";

let urlLokal = `http://localhost:2000/menu/`


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

export class Order extends Component {
  state = {
    arrMenu: [],
    productDetail: [],
    arrOrder: [],
    tableNum: this.props.tableNum,
    qty: 0,
    modal: false,
    isOpen: false
    };

  // SIDEBAR FRAME
  renderLinks = () => {
    return (
      <Transition in={this.state.isOpen} timeout={duration}>
        {state => (
          <div
            className="mt-2"
            style={{
              ...linkStyle,
              ...linkTransitionStyles[state]
            }}
          >
            <div>{this.renderOrders()}</div>
          </div>
        )}
      </Transition>
    );
  };

  // RENDER ORDERS
  renderOrders = () => {
    // let { id, customerId, orderDetail, status } = this.state.arrOrder
    return this.state.arrOrder.map(order => {
      return (
        <Row className="container mx-auto">
          <Col xs="11" className="border-bottom border-top border-dark p-0">
            <div className="d-flex py-4">
              <div className="pt-1 ml-2">{order.productName}</div>
              <div className="ml-auto pt-1">Qty : {order.qty}</div>
              <div className="ml-auto">
                <button
                  className="btn btn-danger"
                  onClick={() => this.delete(order.productId)}
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
  renderConfirmation = () => {
    return this.state.arrOrder.map(order => {
      return (
        <Row className="container mx-auto">
          <Col xs="11" className="border-bottom border-top border-dark p-0">
            <div className="d-flex py-4">
              <div className="pt-1 ml-2">{order.productName}</div>
              <div className="ml-auto pt-1">Qty : {order.qty}</div>
            </div>
          </Col>
        </Row>
      );
    });
  };

  // DELETE ORDER CONTENT
  delete = id => {
    let array = [...this.state.arrOrder];
    let index = array
      .map(function(e) {
        return e.productId;
      })
      .indexOf(id);
    if (index === -1) return alert("No index");
    array.splice(index, 1);
    // console.log(array)
    this.setState({ arrOrder: array });
  };

  // SUBMIT ORDER
  onSubmit = () => {
    this.toggle();

    let arrOrder = this.state.arrOrder;
    arrOrder.forEach(function(v) {
      delete v.productName;
    });
    arrOrder.forEach(function(v) {
      delete v.productType;
    });
    arrOrder.forEach(function(v) {
      delete v.productPrice;
    });
    let data = arrOrder.reduce(
      (acc, obj) => [...acc, Object.values(obj).map(y => y)],
      []
    );

    axios
      .post(url + "/order", {
        list: data
      })
      .then(res => {
        if(res.data.error) return alert(res.data.error)
        console.log(res);
        this.props.delTableNum();
        Swal.fire({
          type: "success",
          title: "Ordered"
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  // TOGGLE DETAIL
  toggle = () => {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  };

  // TOGGLE SIDEBAR
  toggleSidebar = () => {
    this.setState(prevState => ({
      isOpen: !prevState.isOpen
    }));
  };

  // GET MENU INFO
  componentDidMount() {
    axios
      .get(url + "/menu")
      .then(res => {
        if(res.data.error) return alert(res.data.error)
        this.setState({ arrMenu: res.data.menu });
      })
      .catch(err => {
        console.log(err);
      });
  }

  // RENDER CATEGORY MAIN COURSE
  renderMainCourse = () => {
    let result = this.state.arrMenu.map(product => {
      if (product.productType === "Main Course") {
        return (
          <Col xs="3">
            <Button
              onClick={() =>
                this.addDetail(
                  product.productName,
                  product.productDescription,
                  product.productPrice,
                  product.id,
                  product.productType,
                  product.productPhoto

                )
              }
              className="menuItem my-1 btn btn-dark"
            >
              {/* <CardTitle> */}
                <h4>{product.productName.toUpperCase()}</h4>
                <p>Price: <NumberFormat value={product.productPrice} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></p>
              {/* </CardTitle> */}
            </Button>
          </Col>
        );
      }
    });
    return result;
  };

  // RENDER CATEGORY SIDE DISH
  renderSideDish = () => {
    let result = this.state.arrMenu.map(product => {
      if (product.productType === "Side Dish") {
        return (
          <Col xs="3">
            <Button
              onClick={() =>
                this.addDetail(
                  product.productName,
                  product.productDescription,
                  product.productPrice,
                  product.id,
                  product.productType,
                  product.productPhoto
                )
              }
              className="menuItem my-1 btn btn-dark"
            >
              {/* <CardTitle> */}
                <h4>{product.productName.toUpperCase()}</h4>
                <p>Price: <NumberFormat value={product.productPrice} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></p>
              {/* </CardTitle> */}
            </Button>
          </Col>
        );
      }
    });
    return result;
  };

  // RENDER CATEGORY BEVERAGE
  renderBeverage = () => {
    let result = this.state.arrMenu.map(product => {
      if (product.productType === "Beverage") {
        return (
          <Col xs="3">
            <Button
              onClick={() =>
                this.addDetail(
                  product.productName,
                  product.productDescription,
                  product.productPrice,
                  product.id,
                  product.productType,
                  product.productPhoto
                )
              }
              className="menuItem my-1 btn btn-dark"
            >
              {/* <CardTitle> */}
                <h4>{product.productName.toUpperCase()}</h4>
                <p>Price: <NumberFormat value={product.productPrice} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></p>
              {/* </CardTitle> */}
            </Button>
          </Col>
        );
      }
    });
    return result;
  };

  // RENDER CATEGORY MENUSET
  renderMenuSet = () => {
    let result = this.state.arrMenu.map(product => {
      if (product.productType === "MenuSet") {
        return (
          <Col xs="3">
            <Button
              onClick={() =>
                this.addDetail(
                  product.productName,
                  product.productDescription,
                  product.productPrice,
                  product.id,
                  product.productType,
                  product.productPhoto
                )
              }
              className="menuItem my-1 btn btn-dark"
            >
              {/* <CardTitle> */}
                <h4>{product.productName.toUpperCase()}</h4>
                <p>Price: <NumberFormat value={product.productPrice} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></p>
              {/* </CardTitle> */}
            </Button>
          </Col>
        );
      }
    });
    return result;
  };

  // ADD DETAIL INFO
  addDetail = (name, description, price, id, type,productPhoto) => {
    this.setState({
      productDetail: [{ name, description, price, id, type, productPhoto }],
      qty: 0
    });
  };

  // DELETE DETAIL INFO
  delDetail = () => {
    this.setState({
      productDetail: []
    });
  };

  // DECREASE INPUT QTY
  decQty = () => {
    if (this.state.qty > 0) {
      this.setState({ qty: this.state.qty - 1 });
    }
  };

  // INCREASE INPUT QTY
  incQty = () => {
    if (this.state.qty >= 0) {
      this.setState({ qty: this.state.qty + 1 });
    }
  };

  // DECREASE INPUT QTY BY 5
  decQty5 = () => {
    if (this.state.qty >= 5) {
      this.setState({ qty: this.state.qty - 5 });
    }
    if (this.state.qty < 5) {
      this.setState({ qty: 0 });
    }
  };

  // INCREASE INPUT QTY BY 5
  incQty5 = () => {
    if (this.state.qty >= 0) {
      this.setState({ qty: this.state.qty + 5 });
    }
  };

  // RESET INPUT QTY
  resetQty = () => {
    if (this.state.qty >= 0) {
      this.setState({ qty: 0 });
    }
  };

  // INPUT ORDER TO SIDEBAR
  addOrder = async (name, price, id, type) => {
    let qty = this.state.qty;
    if (qty === 0) {
      return alert("Please insert quantity");
    }
    if (qty > 100) {
      this.setState({qty:0})
      return alert("Qty over limit")
    }
    let dor = this.state.arrOrder.filter(val => {
      return val.productId === id;
    });
    if (dor.length > 0) {
      let sum = parseInt(dor[0].qty) + parseInt(this.state.qty);
      if(sum > 100) {
        this.setState({qty:0})
        return alert('Qty cannot be more than 100 pcs')
      }
      let array = [...this.state.arrOrder];
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
      return this.setState({
        arrOrder: [
          ...array,
          {
            productName: name,
            productPrice: price,
            productId: id,
            productType: type,
            customerTable: this.props.tableNum,
            qty: sum
          }
        ],
        qty: 0
      });
    }
    Swal.fire({
      title:`${qty} pcs ${name} added`,
      timer: 1000,
      showConfirmButton: false,
      width:'50%',
      height:'40%'
    })
    return this.setState({
      arrOrder: [
        ...this.state.arrOrder,
        {
          productName: name,
          productPrice: price,
          productId: id,
          productType: type,
          customerTable: this.props.tableNum,
          qty
        }
      ],
      qty: 0
    });
  };

  // DUMMY FN
  jedor = () => {
    // console.log(this.state.arrOrder)
    // let dor = this.state.arrOrder.filter(val => {
    //     return val.productId === 2
    // })
    // console.log(...this.state.arrOrder)
  };

  // QTY INPUT FN
  inputQty = e => {
    let qty = parseInt(e.target.value);
    if (isNaN(qty)) {
      return this.setState({ qty: 0 });
    }
    this.setState({ qty: qty });
  };

  // RENDER DETAILED MENU ITEM
  showDetail = () => {
    let result = this.state.productDetail.map(product => {
      return (
        <Row className="mt-3 mb-3">
          <Col xs="3" className='text-center'>
            {
              product.productPhoto === 'null'
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
              src={urlLokal+product.productPhoto}
              alt=""
              />
            }
            
            <button
              className="btn btn-warning btn-block h-25"
              onClick={() =>
                this.addOrder(
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
                      onClick={this.decQty5}
                    >
                      -5
                    </button>
                    <button className="btn btn-info mr-2" onClick={this.decQty}>
                      -
                    </button>
                    <input
                      style={{textAlign:'center'}}
                      type="text"
                      min="0"
                      maxLength='3'
                      onChange={e => this.inputQty(e)}
                      value={this.state.qty}
                    />
                    <button className="btn btn-info ml-2" onClick={this.incQty}>
                      +
                    </button>
                    <button
                      className="btn btn-info ml-2"
                      onClick={this.incQty5}
                    >
                      +5
                    </button>
                    <button
                      className="btn btn-danger ml-2"
                      onClick={this.resetQty}
                    >
                      Reset
                    </button>
                  </span>
                </h5>
              </CardTitle>
            </Card>
          </Col>
          <Col className="pl-0" xs="1">
            <button className="h-100 btn btn-danger" onClick={this.delDetail}>
              Cancel
            </button>
          </Col>
        </Row>
      );
    });
    return result;
  };

  // RESET DETAILED MENU ITEM
  resetDetail = () => {
    this.setState({ productDetail: [] });
  };

  resetTable = () => {
    this.props.delTableNum();
  };


  // RENDER COMPONENT
  render() {
    if (
      this.props.userName &&
      (this.props.userType === "cashier" || this.props.userType === "waiter") &&
      this.props.tableNum
    ) {

      if(!this.state.arrMenu.length){
        return(
            <div className='text-center'>
                <h1>
                    Loading...
                </h1>
            </div>
        )
    }
      if(this.props.tableNum.split('-')[0] === 'takeaway' && !this.props.tableNum.split('-')[1]){
        this.props.delTableNum()
        return <Redirect to="/table" />;
      }
      return (
        <div className="app">
          <div className="sidebar-container">
            {this.state.isOpen === true ? (
              <div className="d-flex ">
                <button
                  onClick={this.toggleSidebar}
                  className="btn btn-block btn-primary py-3 mb-2 mx-0 px-0"
                >
                  Close
                </button>
              </div>
            ) : (
              <div className="d-flex h-100 justify-content-start ">
                <button
                  onClick={this.toggleSidebar}
                  className="btn btn-primary btn-block p-1"
                >
                  Order List
                </button>
              </div>
            )}
            {this.state.isOpen === true ? (
              <div>
                <Transition in={this.state.isOpen} timeout={duration}>
                  {state => (
                    <div
                      className="sidebar"
                      style={{
                        ...sidebarStyle,
                        ...sidebarTransitionStyles[state]
                      }}
                    >
                      <div>{this.renderLinks()}</div>
                      {this.state.arrOrder.length > 0 ? (
                        <div>
                          <button
                            className="btn btn-block btn-success mt-5 py-3 px-0"
                            onClick={this.toggle}
                          >
                            Submit order
                          </button>
                          <Modal
                            isOpen={this.state.modal}
                            toggle={this.toggle}
                            className={this.props.className}
                          >
                            <ModalHeader
                              toggle={this.toggle}
                              className="px-auto "
                            >
                              Confirmation
                            </ModalHeader>
                            <ModalBody>{this.renderConfirmation()}</ModalBody>
                            <ModalFooter>
                              <Link to="/table">
                                <Button color="primary" onClick={this.onSubmit}>
                                  Confirm
                                </Button>
                              </Link>
                              <Button color="danger" onClick={this.toggle}>
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
            {this.state.productDetail.length ? this.showDetail() : ""}
            <Row className="container mx-auto menu">
              <Col xs="11" className="border-bottom border-top border-dark">
                <h2>Menu Set</h2>
                <Row className="produk text-center ">
                  {this.renderMenuSet()}
                </Row>
              </Col>
              <Col xs="11" className="border-bottom border-top border-dark">
                <h2>Main Course</h2>
                <Row className="produk text-center">
                  {this.renderMainCourse()}
                </Row>
              </Col>
              <Col xs="11" className="border-bottom border-top border-dark">
                <h2>Side Dish</h2>
                <Row className="produk text-center">
                  {this.renderSideDish()}
                </Row>
              </Col>
              <Col xs="11" className="border-bottom border-top border-dark">
                <h2>Beverage</h2>
                <Row className="produk text-center">
                  {this.renderBeverage()}
                </Row>
              </Col>
            </Row>
          </div>
          <Link to="/table" className="d-flex justify-content-end ">
            <button className="btn btn-primary" onClick={this.resetTable}>
              Back
            </button>
          </Link>
          <div key="extra" style={{ height: 600 }}></div>
        </div>
      );
    } else if (this.props.userType === "kitchen") {
      return <Redirect to="/kitchen" />;
    } else if (this.props.userType === "admin") {
      return <Redirect to="/admin" />;
    } else if (!this.props.tableNum) {
      return <Redirect to="/table" />;
    } else {
      return <Redirect to="/" />;
    }
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

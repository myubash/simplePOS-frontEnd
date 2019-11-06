import React, { Component } from 'react'
import { Redirect, } from 'react-router-dom'
import { connect } from 'react-redux'
import { Row, Col, Card, CardBody } from 'reactstrap'

export class OrderListKitchen extends Component {
    render() {
        if (this.props.userName && this.props.userType === "kitchen") {
            return (
                <div className='container'>
                    <Row className='align-content-between mt-4 listKitchen'>
                        <Col xs='4' className=' my-2'>
                            <Card className='itemListKitchen'>
                                <h4 className='m-3'>Order-no</h4>
                                <CardBody className='itemKitchen px-3 py-1'>
                                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis explicabo voluptatem sed amet, deleniti aliquam neque tenetur maxime aliquid quas nesciunt itaque earum, non libero nihil debitis hic vitae tempore?
                                    Nisi nam modi et autem, aspernatur neque assumenda similique qui quae nemo saepe dolores, soluta ad suscipit possimus quod, libero non. Non voluptate impedit eius eos omnis adipisci nisi magnam?
                                    Possimus corporis modi ab beatae voluptatem unde voluptates fuga sed vero. Amet iste, voluptates fugit fuga, dolorum magnam doloremque, reprehenderit neque nam tenetur aspernatur. Fugit itaque excepturi ab optio laudantium.
                                    Ducimus soluta, repellendus alias quam porro quis deleniti enim atque, officiis blanditiis voluptatibus praesentium dignissimos nemo animi aspernatur accusamus minima vel provident optio! Magni, dolore aut? Quod eaque fugit perferendis.
                                    Maiores atque maxime, cum laudantium voluptate voluptates veniam culpa officiis recusandae nostrum sapiente soluta asperiores vitae cumque inventore distinctio laborum velit delectus dignissimos, fuga quasi eos veritatis quaerat. Esse, exercitationem!</p>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xs='4' className=' my-2'>
                            <Card className='itemListKitchen'>
                                <h4 className='m-3'>Order-no</h4>
                                <CardBody className='itemKitchen px-3 py-1'>
                                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis explicabo voluptatem sed amet, deleniti aliquam neque tenetur maxime aliquid quas nesciunt itaque earum, non libero nihil debitis hic vitae tempore?
                                    Nisi nam modi et autem, aspernatur neque assumenda similique qui quae nemo saepe dolores, soluta ad suscipit possimus quod, libero non. Non voluptate impedit eius eos omnis adipisci nisi magnam?
                                    Possimus corporis modi ab beatae voluptatem unde voluptates fuga sed vero. Amet iste, voluptates fugit fuga, dolorum magnam doloremque, reprehenderit neque nam tenetur aspernatur. Fugit itaque excepturi ab optio laudantium.
                                    Ducimus soluta, repellendus alias quam porro quis deleniti enim atque, officiis blanditiis voluptatibus praesentium dignissimos nemo animi aspernatur accusamus minima vel provident optio! Magni, dolore aut? Quod eaque fugit perferendis.
                                    Maiores atque maxime, cum laudantium voluptate voluptates veniam culpa officiis recusandae nostrum sapiente soluta asperiores vitae cumque inventore distinctio laborum velit delectus dignissimos, fuga quasi eos veritatis quaerat. Esse, exercitationem!</p>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xs='4' className=' my-2'>
                            <Card className='itemListKitchen'>
                                <h4 className='m-3'>Order-no</h4>
                                <CardBody className='itemKitchen px-3 py-1'>
                                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis explicabo voluptatem sed amet, deleniti aliquam neque tenetur maxime aliquid quas nesciunt itaque earum, non libero nihil debitis hic vitae tempore?
                                    Nisi nam modi et autem, aspernatur neque assumenda similique qui quae nemo saepe dolores, soluta ad suscipit possimus quod, libero non. Non voluptate impedit eius eos omnis adipisci nisi magnam?
                                    Possimus corporis modi ab beatae voluptatem unde voluptates fuga sed vero. Amet iste, voluptates fugit fuga, dolorum magnam doloremque, reprehenderit neque nam tenetur aspernatur. Fugit itaque excepturi ab optio laudantium.
                                    Ducimus soluta, repellendus alias quam porro quis deleniti enim atque, officiis blanditiis voluptatibus praesentium dignissimos nemo animi aspernatur accusamus minima vel provident optio! Magni, dolore aut? Quod eaque fugit perferendis.
                                    Maiores atque maxime, cum laudantium voluptate voluptates veniam culpa officiis recusandae nostrum sapiente soluta asperiores vitae cumque inventore distinctio laborum velit delectus dignissimos, fuga quasi eos veritatis quaerat. Esse, exercitationem!</p>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col xs='4' className=' my-2'>
                            <Card className='itemListKitchen'>
                                <h4 className='m-3'>Order-no</h4>
                                <CardBody className='itemKitchen px-3 py-1'>
                                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Officiis explicabo voluptatem sed amet, deleniti aliquam neque tenetur maxime aliquid quas nesciunt itaque earum, non libero nihil debitis hic vitae tempore?
                                    Nisi nam modi et autem, aspernatur neque assumenda similique qui quae nemo saepe dolores, soluta ad suscipit possimus quod, libero non. Non voluptate impedit eius eos omnis adipisci nisi magnam?
                                    Possimus corporis modi ab beatae voluptatem unde voluptates fuga sed vero. Amet iste, voluptates fugit fuga, dolorum magnam doloremque, reprehenderit neque nam tenetur aspernatur. Fugit itaque excepturi ab optio laudantium.
                                    Ducimus soluta, repellendus alias quam porro quis deleniti enim atque, officiis blanditiis voluptatibus praesentium dignissimos nemo animi aspernatur accusamus minima vel provident optio! Magni, dolore aut? Quod eaque fugit perferendis.
                                    Maiores atque maxime, cum laudantium voluptate voluptates veniam culpa officiis recusandae nostrum sapiente soluta asperiores vitae cumque inventore distinctio laborum velit delectus dignissimos, fuga quasi eos veritatis quaerat. Esse, exercitationem!</p>
                                </CardBody>
                            </Card>
                        </Col>


                    </Row>
                </div>
            )
        } else if (this.props.userType === "cashier") {
            return (
                <Redirect to='/cashier' />
            )
        } else if (this.props.userType === "admin") {
            return (
                <Redirect to='/admin' />
            )
        } else if (this.props.userType === "waiter") {
            return (
                <Redirect to='/waiter' />
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

export default connect(mapStateToProps, null)(OrderListKitchen)

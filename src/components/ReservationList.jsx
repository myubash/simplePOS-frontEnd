import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'
import url from '../support/url'

export class ReservationList extends Component {

    state = {
        reservation: [],
        reservationCompany: []
    }

    async componentDidMount() {

        try {
            let company = await axios.get(
                url + '/reservation'
            )
            if(company.data.error) return alert(company.data.error)

            var list = company.data.list
            let data = []
            company.data.list.forEach(val => {
                data.push(val.id)
            })
            let jedor = [...new Set(data)]
            // console.log(jedor)
            var dataCustList = []
            jedor.forEach((val) => {
                var dataCust = {}
                dataCust['id'] = val
                dataCust['list'] = []
                var temp = []
                var dataRes = []
                var isCompany = []
                list.forEach((dataList) => {
                    if(val == dataList.id){
                        temp.push({
                            productName: dataList.productName,
                            qty: dataList.qty
                        })
                        if(dataRes.length < 1){
                            dataRes.push({
                                id: dataList.id,
                                name: dataList.name,
                                address: dataList.address,
                                email: dataList.email,
                                companyName: dataList.companyName,
                                companyAddress: dataList.companyAddress,
                                nett: dataList.nett
                            })
                            dataCust['isCompany'] = dataList.isCompany
                        }
                    }
                    
                })
                dataCust['list'] = temp
                dataCust['dataRes'] = dataRes
                dataCustList.push(dataCust)
            })
            let companyArr = []
            let regularArr = []
            dataCustList.forEach(val => {
                if(val.isCompany){
                    return companyArr.push(val)
                }
                return regularArr.push(val)
            })
            console.log(companyArr,regularArr)
            this.setState({
                reservationCompany: companyArr,
                reservation: regularArr
            })
        } catch (error) {
            console.log(error)
        }
    }

    renderItemCompany = (id) => {
        return this.state.reservationCompany.map(val => {
            if (val.id === id) return val.list.map(item => {
                return (
                    <p>{item.productName}, {item.qty} pcs</p>
                )
            }
            )
        })
    }
    renderItem = (id) => {
        return this.state.reservation.map(val => {
            if (val.id === id) return val.list.map(item => {
                return (
                    <p>{item.productName}, {item.qty} pcs</p>
                )
            }
            )
        })
    }

    renderCompany = () => {
        return this.state.reservationCompany.map(item => {
            return item.dataRes.map(val => {
                return (
                    <tr>
                        <td>{val.id}</td>
                        <td>{val.name}</td>
                        <td>{val.address}</td>
                        <td>{val.companyName}</td>
                        <td>{val.companyAddress}</td>
                        <td>{val.email}</td>
                        <td>{val.nett}</td>
                        <td>{this.renderItemCompany(val.id)}</td>
                    </tr>
                )
            })
        })
    }
    renderReservation = () => {
        return this.state.reservation.map(item => {
            return item.dataRes.map(val => {
                return (
                    <tr>
                        <td>{val.id}</td>
                        <td>{val.name}</td>
                        <td>{val.address}</td>
                        <td>{val.email}</td>
                        <td>{val.nett}</td>
                        <td>{this.renderItem(val.id)}</td>
                    </tr>
                )
            })
        })
    }

    render() {
        if (this.props.userName && this.props.userType === "admin") {
            if(!this.state.reservation.length || !this.state.reservationCompany.length){
                return(
                    <div className='text-center'>
                        <h1>
                            Loading...
                        </h1>
                    </div>
                )
            }
            return (
                <div>
                    {
                        this.state.reservationCompany.length
                            ?
                            <div>
                                <h1 className='text-center my-3'>Company Reservation List</h1>
                                <table className='table float table-hover table-striped text-center'>
                                    <thead className='thead-dark'>
                                        <tr>
                                            <th>RESERVATION-ID</th>
                                            <th>NAME</th>
                                            <th>ADDRESS</th>
                                            <th>COMPANY-NAME</th>
                                            <th>COMPANY-ADDRESS</th>
                                            <th>EMAIL</th>
                                            <th>NETT</th>
                                            <th>MENU-ITEM</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.renderCompany()}
                                    </tbody>
                                </table>
                            </div>
                            :
                            ''
                    }
                    {
                        this.state.reservation.length
                            ?
                            <div>
                                <h1 className='text-center my-3'>Reservation List</h1>
                                <table className='table float table-hover table-striped text-center'>
                                    <thead className='thead-dark'>
                                        <tr>
                                            <th>RESERVATION-ID</th>
                                            <th>NAME</th>
                                            <th>ADDRESS</th>
                                            <th>EMAIL</th>
                                            <th>NETT</th>
                                            <th>MENU-ITEM</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.renderReservation()}
                                    </tbody>
                                </table>
                            </div>
                            :
                            ''
                    }


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
        } else if (this.props.userType === "kitchen") {
            return (
                <Redirect to='/kitchen' />
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

export default connect(mapStateToProps, null)(ReservationList)

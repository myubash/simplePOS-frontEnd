import React, { Component } from 'react'
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import '../../node_modules/react-vis/dist/style.css';
import { XYPlot, VerticalBarSeries, VerticalGridLines, HorizontalGridLines, XAxis, YAxis } from 'react-vis';

export class TransactionHistory extends Component {

    state = {
        arrHistory: [],
        data: []
    }

    async componentDidMount() {
        try {
            let dor = await axios.get(
                'http://localhost:2000/orderhistory'
            )
            this.setState({ arrHistory: dor.data })
            let jedor = this.state.arrHistory.map(val => {
                return val.history.list.map(item => {
                    return { x: item.productName, y: item.qty }
                })
            })
            let masuk = []
            function puss(item) {
                masuk.push(...item)
            }
            jedor.forEach(puss)
            console.log(masuk)
            this.setState({ data: masuk })

        } catch (error) {
            console.log(error)
        }
    }

    renderList = (table) => {
        return this.state.arrHistory.map(arr => {
            if (arr.history.customerTable === table) {
                return arr.history.list.map(item => {
                    return (
                        <p>
                            {item.productName}, {item.qty} pcs
                        </p>
                    )
                })
            }
        })
    }

    renderHistory = () => {
        return this.state.arrHistory.map(arr => {
            return (
                <tr>
                    <td>{arr.id}</td>
                    <td>Order-{arr.history.id}</td>
                    <td>Table-{arr.history.customerTable}</td>
                    <td>{this.renderList(arr.history.customerTable)}</td>
                </tr>
            )
        })
    }

    // addData = () => {

    //     console.log(masuk)
    //     this.setState({ data: masuk })
    // }


    render() {
        if (this.props.userName && this.props.userType === "admin") {
            if (this.state.arrHistory.length === 0) {
                return (
                    <h1 className='container'>Empty</h1>
                )
            }
            else {
                // (this.addData())
                return (
                    <div className='container'>
                        <h1 className=' text-center my-4'>Transaction History</h1>
                        <div >
                            {
                                this.state.data.length === 0
                                    ?
                                    <XYPlot
                                        dontCheckIfEmpty
                                        xDomain={[0, 3]}
                                        yDomain={[10, 3]}
                                        width={300}
                                        height={300}
                                        className='m-auto'>
                                        <VerticalGridLines />
                                        <HorizontalGridLines />
                                        <XAxis
                                            hideLine
                                            title="Empty Chart Right Here"
                                            tickFormat={v => `${v}!`}
                                            tickValues={[1, 1.5, 2, 3]} />
                                        <YAxis hideTicks />
                                    </XYPlot>
                                    :
                                    <XYPlot height={300} width={500} xType='ordinal' dontCheckIfEmpty className='m-auto'>
                                        <VerticalGridLines />
                                        <HorizontalGridLines />
                                        <XAxis />
                                        <YAxis />
                                        <VerticalBarSeries data={this.state.data} />
                                    </XYPlot>
                            }
                        </div>
                        <table className='table table-hover'>
                            <thead>
                                <tr className='text-center'>
                                    <th>No</th>
                                    <th>Order-ID</th>
                                    <th>Customer-table</th>
                                    <th colSpan='2'>Order list</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody className='text-center'>
                                {this.renderHistory()}
                            </tbody>
                        </table>

                    </div>
                )
            }
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

export default connect(mapStateToProps, null)(TransactionHistory)

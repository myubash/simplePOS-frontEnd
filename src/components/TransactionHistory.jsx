import React, { Component } from 'react'
import axios from 'axios'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import '../../node_modules/react-vis/dist/style.css';
import { XYPlot, VerticalBarSeries, VerticalGridLines, HorizontalGridLines, XAxis, YAxis } from 'react-vis';
import url from '../support/url'
import { FaCaretDown,FaCaretUp } from 'react-icons/fa'
import NumberFormat from 'react-number-format'


export class TransactionHistory extends Component {

    state = {
        arrHistory: [],
        data: [],
        toggleCaret: false,
        sort:'id',
        currentPage: 1,
        dataPerPage: 10
    }

    async componentDidMount() {
        try {
            let res = await axios.get(
                url + '/orderhistory'
            )
            if(res.data.error) return alert(res.data.error)
            console.log(res.data.list)
            this.setState({ arrHistory: res.data.list })
            let jedor = this.state.arrHistory.map(val => {
                    return { x: val.productName, y: parseInt(val.qty) }
            })
            let out = []
            let keys = ['y']
            jedor.forEach(function (e) {
                if (!this[e.x]) out.push(this[e.x] = e);
                else keys.forEach(k => this[e.x][k] += e[k])
            }, {})

            this.setState({ data: out })
        } catch (error) {
            console.log(error)
        }
    }

    renderHistory = () => {
        const { arrHistory, currentPage, dataPerPage } = this.state;
        const indexOfLastData = currentPage * dataPerPage;
        const indexOfFirstData = indexOfLastData - dataPerPage;
        const currentData = arrHistory.slice(indexOfFirstData, indexOfLastData);
        return currentData.map(arr => {
            let sum = arr.qty*arr.productPrice
            return (
                <tr>
                    <td>{arr.id}</td>
                    <td>{arr.productName}</td>
                    <td>{arr.productType}</td>
                    <td><NumberFormat value={arr.productPrice} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></td>
                    <td>{arr.qty}</td>
                    <td><NumberFormat value={sum} displayType={'text'} thousandSeparator={'.'} decimalSeparator={','} prefix={'Rp '} /></td>
                    <td>{arr.checkout_time}</td>
                </tr>
            )
        })
    }

    compareValues = (key, order = 'asc') => {
        return function innerSort(a, b) {
        if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
            // property doesn't exist on either object
            return 0;
        }
        

        const varA = (isNaN(parseInt(a[key])))
            ? a[key].toUpperCase() : parseInt(a[key])
        const varB = (isNaN(parseInt(b[key])))
            ? b[key].toUpperCase() : parseInt(b[key])
        let comparison = 0;
        if (varA > varB) {
            comparison = 1;
        } else if (varA < varB) {
            comparison = -1;
        }
        return (
            (order === 'desc') ? (comparison * -1) : comparison
        );
        };
    }

    onSort = (key,order= 'asc') => {
        let dor = this.state.arrHistory.sort(this.compareValues(key,order ))
        this.setState({arrHistory:dor,sort:key,toggleCaret: !this.state.toggleCaret})
    }
    handleClick = (e,page) => {
        e.persist();
        this.setState({currentPage: page})
    }

    renderPagination = () => {
        const { arrHistory, currentPage, dataPerPage } = this.state
        const pageNumbers = [];
        for (let i = 1; i <= Math.ceil(arrHistory.length / dataPerPage); i++) {
            pageNumbers.push(i);
        }
        return pageNumbers.map(val => {
            if(this.state.currentPage === val){
                return (
                    <li
                        className='page-item active'
                        key={val}
                        id={val}
                        onClick={(e) => this.handleClick(e,val)}
                        >
                        <p className='page-link'>{val}</p>
                        </li>
                    );
            }
            return (
                <li
                    className='page-item'
                    key={val}
                    id={val}
                    onClick={(e) => this.handleClick(e,val)}
                    >
                    <p className='page-link'>{val}</p>
                    </li>
                );
        })
    }

    render() {
        if (this.props.userName && this.props.userType === "admin") {
            if (this.state.arrHistory.length === 0) {
                return (
                    <h1 className='container text-center'>Loading...</h1>
                )
            }
            else {
                            
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
                                            tickValues={[1, 2, 3, 4]} />
                                        <YAxis hideTicks />
                                    </XYPlot>
                                    :
                                    <XYPlot height={300} width={800} xType='ordinal' dontCheckIfEmpty className='m-auto'>
                                        <VerticalGridLines />
                                        <HorizontalGridLines />
                                        <XAxis />
                                        <YAxis />
                                        <VerticalBarSeries data={this.state.data} />
                                    </XYPlot>
                            }
                        </div>
                        <div className='float-right'>
                            <ul className='pagination'>
                                {this.renderPagination()}
                            </ul>
                        </div>
                        <div >
                            <table className='table table-hover'>
                                <thead style={{ position: 'sticky', top: 0 }}>
                                    <tr className='text-center'>
                                        <th >
                                            ID 
                                            {
                                                this.state.toggleCaret && this.state.sort === 'id'
                                                ?

                                                    <FaCaretUp onClick={() =>this.onSort('id','desc')}/>

                                                :

                                                    <FaCaretDown onClick={() =>this.onSort('id','asc')}/>
                                            }
                                        
                                        </th>
                                        <th>
                                            Product Name
                                            {
                                                this.state.toggleCaret && this.state.sort === 'productName'
                                                ?

                                                    <FaCaretUp onClick={() =>this.onSort('productName','desc')}/>

                                                :

                                                    <FaCaretDown onClick={() =>this.onSort('productName','asc')}/>

                                            }
                                        </th>
                                        <th>
                                            Product Type
                                            {
                                                this.state.toggleCaret && this.state.sort === 'productType'
                                                ?

                                                    <FaCaretUp onClick={() =>this.onSort('productType','desc')}/>

                                                :

                                                    <FaCaretDown onClick={() =>this.onSort('productType','asc')}/>

                                            }
                                        </th>
                                        <th>
                                            Product Price
                                            {
                                                this.state.toggleCaret && this.state.sort === 'productPrice'
                                                ?

                                                    <FaCaretUp onClick={() =>this.onSort('productPrice','desc')}/>

                                                :

                                                    <FaCaretDown onClick={() =>this.onSort('productPrice','asc')}/>

                                            }
                                        </th>
                                        <th >
                                            Qty
                                            {
                                                this.state.toggleCaret && this.state.sort === 'qty'
                                                ?

                                                    <FaCaretUp onClick={() =>this.onSort('qty','desc')}/>

                                                :

                                                    <FaCaretDown onClick={() =>this.onSort('qty','asc')}/>

                                            }
                                        </th>
                                        <th >
                                            Total
                                        </th>
                                        <th >
                                            Transaction Time
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className='text-center'>
                                    {this.renderHistory()}
                                </tbody>
                            </table>
                        </div>
                        <div style={{height:100}}>

                        </div>
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

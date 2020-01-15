import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'
import url from '../support/url'
import { parse } from 'url'
import Swal from 'sweetalert2'

let urlLokal = `http://localhost:2000/newmenu/`


export class NewMenuSuggestion extends Component {

    state = {
        arrPending: [],
        arrAccepted: [],
        arrRejected: []
    }

    async componentDidMount() {
        try {
            let res = await axios.get(
                url + '/newmenu'
            )
            if(res.data.error) return alert(res.data.error)
            this.setState({ arrPending: res.data.pending, arrAccepted: res.data.accepted, arrRejected: res.data.rejected })
        } catch (error) {
            console.log(error)
        }
    }

    onAccept = (id) => {
        axios.patch(
            url + '/newmenu/accept/' + id
        )
            .then(res => {
                if(res.data.error) return alert(res.data.error)
                console.log(res)
                Swal.fire({
                    title:'Please confirm accepted menu',
                    showConfirmButton:false,
                    timer: 800
                })
                this.componentDidMount()
            })
            .catch(err => {
                console.log(err)
            })
    }

    onReject = (id) => {
        axios.patch(
            url + '/newmenu/reject/' + id,
            {
                rejected: true,
                pending: false
            }
        )
            .then(res => {
                if(res.data.error) return alert(res.data.error)
                console.log(res)
                Swal.fire({
                    title:'Please confirm rejected menu',
                    showConfirmButton:false,
                    timer: 800
                })
                this.componentDidMount()
            })
            .catch(err => {
                console.log(err)
            })
    }

    onCancel = (id) => {
        axios.patch(
            url + '/newmenu/pending/' + id,
            {
                rejected: true,
                pending: false
            }
        )
            .then(res => {
                if(res.data.error) return alert(res.data.error)
                console.log(res)
                Swal.fire({
                    title:'Change cancelled',
                    showConfirmButton:false,
                    timer: 500
                })
                this.componentDidMount()
            })
            .catch(err => {
                console.log(err)
            })
    }



    renderPending = () => {
        return this.state.arrPending.map(val => {
                return (
                    <tr>
                        <td>{val.productName}</td>
                        <td><img style={{width:'5vw'}} src={urlLokal+val.productPhoto} alt={val.productName} /></td>
                        <td>{val.productType}</td>
                        <td>{val.productEstPrice}</td>
                        <td style={{wordBreak:'break-all'}}>{val.productDescription}</td>
                        <td style={{wordBreak:'break-all'}}>{val.productIngredients}</td>
                        <td>Pending</td>
                        <td className='justify-content-center'>
                            <button className='btn btn-info mr-2' onClick={() => this.onAccept(val.id)}>Accept</button>
                            <button className='btn btn-danger' onClick={() => this.onReject(val.id)}>Reject</button>
                        </td>
                    </tr>
                )
        })
    }

    renderAccepted = () => {
        return this.state.arrAccepted.map(val => {
                return (
                    <tr style={{overflowX: 'auto',overflowY:'hidden',whiteSpace:'nowrap'}}>
                        <td>{val.productName}</td>
                        <td><img style={{width:'5vw'}} src={urlLokal+val.productPhoto} alt={val.productName} /></td>
                        <td>{val.productType}</td>
                        <td>{val.productEstPrice}</td>
                        <td style={{wordBreak:'break-all'}}>{val.productDescription}</td>
                        <td style={{wordBreak:'break-all'}}>{val.productIngredients}</td>
                        <td>Accepted</td>
                        <td>
                            <button className='btn btn-success mr-2' onClick={() => this.onConfirm(val.id, val.productName, val.productType, val.productPhoto, val.productEstPrice, val.productDescription)} >CONFIRM</button>
                            <button className='btn btn-warning mr-2' onClick={() => this.onCancel(val.id)} >CANCEL</button>
                        </td>
                    </tr>
                )
        })
    }

    renderRejected = () => {
        return this.state.arrRejected.map(val => {
                return (
                    <tr>
                        <td>{val.productName}</td>
                        <td><img style={{width:'5vw'}} src={urlLokal+val.productPhoto} alt={val.productName} /></td>
                        <td>{val.productType}</td>
                        <td>{val.productEstPrice}</td>
                        <td style={{wordBreak:'break-all'}}>{val.productDescription}</td>
                        <td style={{wordBreak:'break-all'}}>{val.productIngredients}</td>
                        <td>Rejected</td>
                        <td>
                            <button className='btn btn-danger mr-2' onClick={() => this.onDelete(val.id,val.productPhoto,val.productName)} >DELETE</button>
                            <button className='btn btn-warning mr-2' onClick={() => this.onCancel(val.id)} >CANCEL</button>
                        </td>
                    </tr>
                )
        })
    }

    dor = () => {
        console.log(this.state.arrPending.length)
    }

    onConfirm = async (id, name, type, photo, price, desc) => {
        id = parseInt(id)
        price = parseInt(price)
        let alert = await Swal.fire({
            title:'Are you sure?',
            text: `${name} will be added to current menu`,
            showCancelButton:true
        })
        if(!alert.value){
            return Swal.fire({
                title: 'Confirmation cancelled'
            })
        }
            try {
                let res = await axios.post(
                    url + '/newmenu/confirm/' + id,
                    {
                        productName: name,
                        productType: type,
                        productPrice: price,
                        productDescription: desc,
                        productPhoto: photo
                    }
                )
                if(res.data.error) return alert(res.data.error)
                console.log(res.data)
                Swal.fire({
                    title:`${name} added to menu`,
                    icon:'success'
                })
                this.componentDidMount()
            } catch (error) {
                console.log(error)
            }
    }

    onDelete = async (id,photo,name) => {
        console.log(photo)
        let alert = await Swal.fire({
            title:'Are you sure?',
            text: `${name} will be added to current menu`,
            showCancelButton:true
        })
        if(!alert.value){
            return Swal.fire({
                title: 'Confirmation cancelled'
            })
        }
        try {
            let res = await axios.post(
                url + '/newmenu/delete/' + id,
                {
                    photo: photo
                }
            )
            if(res.data.error) return alert(res.data.error)
            console.log(res.data)
            Swal.fire({
                title:`${name} cleared from suggestion`,
                icon:'success'
            })
            this.componentDidMount()
        } catch (error) {
            console.log(error)
        }
    }


    render() {
        if (this.props.userName && this.props.userType === "admin") {
            return (
                <div className='container'>
                    <h2 className='text-center mt-3'>SUGGESTION LIST</h2>
                    <table  className='table float text-center mt-3'>
                        <thead>
                            <th>PRODUCT-NAME</th>
                            <th>PHOTO</th>
                            <th>PRODUCT-TYPE</th>
                            <th>EST-PRICE</th>
                            <th>DESCRIPTION</th>
                            <th>INGREDIENTS</th>
                            <th>STATUS</th>
                            <th>ACTION</th>
                        </thead>
                        <tbody >
                            {
                                !this.state.arrPending.length
                                    ?
                                    <tr>
                                        <td colSpan='8' className='bg-danger'>List empty...</td>
                                    </tr>
                                    :
                                    this.renderPending()
                            }
                        </tbody>
                    </table>
                    {
                        this.state.arrAccepted.length
                            ?
                            <div>
                                <h2 className='text-center mt-3'>ACCEPTED MENU</h2>
                                <table className='table float text-center mt-3'>
                                    <thead>
                                        <th>PRODUCT-NAME</th>
                                        <th>PHOTO</th>
                                        <th>PRODUCT-TYPE</th>
                                        <th>EST-PRICE</th>
                                        <th>DESCRIPTION</th>
                                        <th>INGREDIENTS</th>
                                        <th>STATUS</th>
                                        <th>ACTION</th>
                                    </thead>
                                    <tbody>
                                        {this.renderAccepted()}
                                    </tbody>
                                </table>
                            </div>
                            :
                            ''
                    }

                    {
                        this.state.arrRejected.length
                            ?
                            <div>
                                <h2 className='text-center mt-3'>REJECTED MENU</h2>
                                <table className='table float text-center mt-3'>
                                    <thead>
                                        <th>PRODUCT-NAME</th>
                                        <th>PHOTO</th>
                                        <th>PRODUCT-TYPE</th>
                                        <th>EST-PRICE</th>
                                        <th>DESCRIPTION</th>
                                        <th>INGREDIENTS</th>
                                        <th>STATUS</th>
                                        <th>ACTION</th>
                                    </thead>
                                    <tbody>
                                        {this.renderRejected()}
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

export default connect(mapStateToProps, null)(NewMenuSuggestion)

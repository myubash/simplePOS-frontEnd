import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap';
import axios from 'axios';

export class NewMenu extends Component {
    state = {
        productType: '',
        photoName: '',
        file: null
    }

    upload = (e) => {
        e.preventDefault()
        let photoProduct = this.photoProduct.files[0]
        this.setState({
            photoName: photoProduct.name,
            file: URL.createObjectURL(photoProduct)
        })
    }

    onSubmit = async (e) => {
        e.preventDefault()
        let productName = this.productName.value
        let productDescription = this.productDescription.value
        let productIngredients = this.productIngredients.value
        let productPhoto = this.state.photoName
        let productEstPrice = this.productEstPrice.value
        let productType = this.state.productType
        if (!productName || !productDescription || !productIngredients || !productEstPrice) {
            return alert('Please fill in the form')
        }
        if (!productPhoto) {
            return alert('Please upload product photo')
        }
        if (!productType) {
            return alert('Please select product type')
        }
        try {
            let res = await axios.post(
                'http://localhost:2000/newmenu',
                {
                    productName: productName,
                    productType: productType,
                    productEstPrice: productEstPrice,
                    productDescription: productDescription,
                    productIngredients: productIngredients,
                    productPhoto: productPhoto
                }
            )
            console.log(res)
            alert('Success')
        } catch (error) {
            console.log(error)
        }
    }

    render() {
        if (this.props.userName && this.props.userType === "kitchen") {
            return (
                <div>
                    <div className='card col-6 mx-auto mt-5'>
                        <div className='card-body' >
                            <div className='card-title border-bottom border-dark'>
                                <h1>
                                    New menu form :
                            </h1>
                            </div>
                            <form className='form-group mb-0'>
                                <div className='card-title'>
                                    <h3>Product name : </h3>
                                    <input className='form-control' type="text" ref={input => { this.productName = input }} />
                                </div>
                                <div className='card-title'>
                                    <h3>Description : </h3>
                                    <textarea className='form-control' type="text" ref={input => { this.productDescription = input }} />
                                </div>
                                <div className='card-title'>
                                    <h3>Ingredients : </h3>
                                    <textarea className='form-control' type='text' ref={input => { this.productIngredients = input }} />
                                </div>
                                <div className='card-title'>
                                    <h3>Photo : </h3>
                                    {
                                        this.state.file
                                            ?
                                            <img src={this.state.file} alt="ha" style={{ height: '15%', width: '15%' }} className='my-2' />
                                            :
                                            ''
                                    }
                                    <div className="input-group mb-3">
                                        <div className="custom-file">
                                            <input type="file" onChange={this.upload} className="custom-file-input" id="inputGroupFile01" aria-describedby="inputGroupFileAddon01" ref={input => this.photoProduct = input} />
                                            <label className="custom-file-label" htmlFor="inputGroupFile01">{this.state.photoName ? this.state.photoName : 'Choose file'}</label>
                                        </div>
                                    </div>
                                </div>
                                <div className='card-title'>
                                    <h3>Estimate price : </h3>
                                    <div className="input-group mb-3">
                                        <div className="input-group-prepend">
                                            <span className="input-group-text" id="basic-addon1">Rp</span>
                                        </div>
                                        <input type="text" className="form-control" ref={input => { this.productEstPrice = input }} />
                                    </div>
                                </div>
                                <div className='card-title'>
                                    <h3>Product type : </h3>
                                    <UncontrolledButtonDropdown direction='down' className='btn-block'>
                                        <DropdownToggle caret >
                                            {
                                                this.state.productType
                                                    ?
                                                    this.state.productType
                                                    :
                                                    'Select one...'
                                            }
                                        </DropdownToggle>
                                        <DropdownMenu className='mr-2 w-100'>
                                            <DropdownItem onFocus={() => this.setState({ productType: 'Lauk' })}>Lauk</DropdownItem>
                                            <DropdownItem onFocus={() => this.setState({ productType: 'Paket' })}>Paket</DropdownItem>
                                            <DropdownItem onFocus={() => this.setState({ productType: 'Tambahan' })}>Tambahan</DropdownItem>
                                            <DropdownItem divider />
                                            <DropdownItem disabled>Seasonal</DropdownItem>
                                        </DropdownMenu>
                                    </UncontrolledButtonDropdown>
                                </div>
                                <button className='m-0 p-0' style={{ opacity: 0 }} onClick={this.onSubmit}>
                                </button>
                            </form>
                            <button type='submit' className='btn btn-block btn-info' onClick={this.onSubmit}>SUBMIT</button>
                        </div>
                    </div>
                    <div style={{ height: 300 }} className='container'>
                    </div>
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
        } else if (this.props.userType === "admin") {
            return (
                <Redirect to='/admin' />
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

export default connect(mapStateToProps, null)(NewMenu)

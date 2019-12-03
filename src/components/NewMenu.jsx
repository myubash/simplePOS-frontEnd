import React, { Component } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap';
import axios from 'axios';
import url from '../support/url'

export class NewMenu extends Component {
    state = {
        productType: '',
        photoName: '',
        file: null,
        type: []
    }

    upload = (e) => {
        e.preventDefault()
        let productPhoto = this.productPhoto.files[0]
        this.setState({
            photoName: productPhoto.name,
            file: URL.createObjectURL(productPhoto)
        })
    }

    cancelUploadPhoto = e => {
        e.preventDefault();
        this.productPhoto = null;
        this.setState({
            photoName: "",
            file: null
        });
    };

    async componentDidMount() {
        try {
            let type = await axios.get(url+'/producttype')
            if(type.data.error) return alert(type.data.error)
            this.setState({type: type.data.list})
        } catch (error) {
            console.log(error)
        }
    }

    onSubmit = async (e) => {
        e.preventDefault()
        

        let formData = new FormData()

        let productName = this.productName.value
        let productDescription = this.productDescription.value
        let productIngredients = this.productIngredients.value
        let productEstPrice = this.productEstPrice.value
        let productType = this.state.productType
        let productPhoto = null
        if(this.productPhoto) productPhoto = this.productPhoto.files[0]
        if (!productName || !productDescription || !productIngredients) {
            return alert('Please fill in the form')
        }
        if(!isNaN(parseInt(productName))) return alert('Product name is string only')
        if(isNaN(parseInt(productEstPrice))) return alert('Input estimate price incorrect')
        if (!productPhoto) {
            return alert('Please upload product photo')
        }
        if (!productType) {
            return alert('Please select product type')
        }
        let getType = this.state.type.filter(val => {
            return val.productType === productType
        })
        productType = getType[0].id


        formData.append('productName',productName)
        formData.append('productDescription',productDescription)
        formData.append('productIngredients',productIngredients)
        formData.append('productEstPrice',productEstPrice)
        formData.append('productType',productType)
        formData.append('productPhoto',productPhoto)

        // for(var pair of formData.entries()) {
        //     console.log(pair[0]+ ', '+ pair[1]); 
        // }
        try {
            let res = await axios.post(
                url + '/newmenu',
                    formData
            )
            if(res.data.error) return alert(res.data.error)
            console.log(res.data)

            this.productName.value = ''
            this.productDescription.value = ''
            this.productIngredients.value = ''
            this.productEstPrice.value = ''
            this.state.productType = ''
            this.productPhoto = null
            this.setState({
                photoName: "",
                file: null
            });
            
            alert('Success')
        } catch (error) {
            console.log(error)
        }
    }

    renderProductType = () => {
        return this.state.type.map(val => {
            return(
                    <DropdownItem onFocus={() => this.setState({ productType: `${val.productType}` })}>{val.productType}</DropdownItem>
            )
        })
        
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
                                            <input type="file" onChange={this.upload} className="custom-file-input" id="inputGroupFile01" aria-describedby="inputGroupFileAddon01" ref={input => this.productPhoto = input} />
                                            <label className="custom-file-label" htmlFor="inputGroupFile01">{this.state.photoName ? this.state.photoName : 'Choose file'}</label>
                                        </div>
                                        {
                                            this.state.file
                                            ?
                                            <button
                                            onClick={this.cancelUploadPhoto}
                                            className="btn btn-danger mt-2 btn-block"
                                            >Cancel</button>
                                            :
                                            null
                                        }
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
                                            {this.renderProductType()}
                                            <DropdownItem divider></DropdownItem>
                                            <DropdownItem className='bg-danger text-light' onFocus={() => this.setState({ productType: '' })}>Cancel</DropdownItem>
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

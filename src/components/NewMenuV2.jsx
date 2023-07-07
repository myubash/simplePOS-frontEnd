import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import { UncontrolledButtonDropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap';
import { xhr } from '../support/xhr'
import url from '../support/url'

const NewMenu = (props) => {
  //     state = {
  //         productType: '',
  //         photoName: '',
  //         file: null,
  //         type: []
  //     }
  const initForm = {
    name: '',
    type: null,
    description: '',
    ingredients: [],
    price: '',
    photoName: ''
  }

  const [form, setForm] = useState(initForm)
  const [optionType, setOptionType] = useState([])
  const [file, setFile] = useState(null)
  const [fileBlob, setFileBlob] = useState(null)
  const [fileName, setFileName] = useState('')

  const upload = (e) => {
    e.preventDefault()
    const productPhoto = e.target.files[0]
    setFileName(productPhoto.name)
    setFile(productPhoto)
    setFileBlob(URL.createObjectURL(productPhoto))
  }

  const cancelUploadPhoto = () => {
    setFileName('')
    setFile(null)
    setFileBlob(null)
  };

  useEffect(() => {
    (async() => {
      try {
        const res = await xhr.get('/product-type')
        setOptionType(res.data.data)
      } catch (error) {
          console.log(error)
      }
    })()
  }, [])


  const onSubmit = async (e) => {
    // validation
    if (!form.name) return alert('Product name is required')
    if (!form.type) return alert('Type is required')
    if (!form.price) return alert('Price is required')

    try {
      // upload photo
      const formUpload = new FormData()
      formUpload.append('images', file)
      const resUpload = await xhr.post('/menu/upload', formUpload)

      const formdata = {
        ...form,
        type: form.type._id,
        photos: resUpload.data,

      }
      const res = await xhr.post('/menu/create', formdata)
      setForm(initForm)
      setFile(null)
      setFileBlob(null)
      setFileName('')
      alert(res.message)
    } catch (error) {
        console.log(error)
    }
  }
  const handleChange = (name, value) => {
    setForm({
      ...form,
      [name]: value
    })
  }

  const renderProductType = () => {
    return optionType.map(val => {
      return(
        <DropdownItem onFocus={() => handleChange('type', val)}>{val.name}</DropdownItem>
      )
    })
  }

  if (props.userName && props.userType === "kitchen") {
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
                    <input className='form-control' type="text" value={form.name} onChange={(e) => handleChange('name', e.target.value)} />
                  </div>
                  <div className='card-title'>
                    <h3>Description : </h3>
                    <textarea className='form-control' type="text" value={form.description} onChange={(e) => handleChange('description', e.target.value)} />
                  </div>
                  {/* <div className='card-title'>
                    <h3>Ingredients : </h3>
                    <textarea className='form-control' type='text' onChange={(e) => handleChange('ingredients', e.target.value)} />
                  </div> */}
                  <div className='card-title'>
                    <h3>Photo : </h3>
                    {
                      fileBlob
                        ? <img src={fileBlob} alt="ha" style={{ height: '15%', width: '15%' }} className='my-2' />
                        : ''
                    }
                    <div className="input-group mb-3">
                      <div className="custom-file">
                        <input type="file" onChange={upload} className="custom-file-input" id="inputGroupFile01" aria-describedby="inputGroupFileAddon01" />
                        <label className="custom-file-label" htmlFor="inputGroupFile01">{fileName || 'Choose file'}</label>
                      </div>
                      {
                        fileBlob
                          ? <button
                              onClick={cancelUploadPhoto}
                              className="btn btn-danger mt-2 btn-block"
                            >
                              Cancel
                            </button>
                          : null
                      }
                    </div>
                  </div>
                  <div className='card-title'>
                    <h3>Estimate price : </h3>
                    <div className="input-group mb-3">
                      <div className="input-group-prepend">
                          <span className="input-group-text" id="basic-addon1">Rp</span>
                      </div>
                      <input type="number" className="form-control" value={form.price} onChange={(e) => handleChange('price', e.target.value)} />
                    </div>
                  </div>
                  <div className='card-title'>
                    <h3>Product type : </h3>
                    <UncontrolledButtonDropdown direction='down' className='btn-block'>
                      <DropdownToggle caret >
                        {
                          form.type
                            ?
                            form.type.name
                            :
                            'Select one...'
                        }
                      </DropdownToggle>
                      <DropdownMenu className='mr-2 w-100'>
                        {renderProductType()}
                        <DropdownItem divider></DropdownItem>
                        <DropdownItem className='bg-danger text-light' onFocus={() => handleChange('type', null)}>Cancel</DropdownItem>
                      </DropdownMenu>
                    </UncontrolledButtonDropdown>
                  </div>
                </form>
                <button type='submit' className='btn btn-block btn-info' onClick={onSubmit}>SUBMIT</button>
            </div>
          </div>
          <div style={{ height: 300 }} className='container'>
        </div>
      </div>
    )
  } else if (props.userType === "waiter") {
      return (
          <Redirect to='/waiter' />
      )
  } else if (props.userType === "cashier") {
      return (
          <Redirect to='/cashier' />
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

const mapStateToProps = state => {
    return {
        userName: state.auth.userName,
        userType: state.auth.userType
    }
}

export default connect(mapStateToProps, null)(NewMenu)

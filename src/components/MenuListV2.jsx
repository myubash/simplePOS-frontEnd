import React, { useEffect, useState, useCallback } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import {xhr} from '../support/xhr'
import { FaCaretDown,FaCaretUp,FaBars } from 'react-icons/fa'

import {
    ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem
} from 'reactstrap';

import { Transition } from 'react-transition-group'



let urlLokal = `http://localhost:2000/api/`
// TRANSITION DURATION
const duration = 500

// TRANSITION
const sidebarStyle = {
    transition: `width ${duration}ms`
}

// WIDTH SETTING
const sidebarTransitionStyles = {
    entering: { width: 0 },
    entered: { width: '300px' },
    exiting: { width: '300px' },
    exited: { width: 0 }
}

// OPACITY TRANSITION DURATION (same as width duration)
const linkStyle = {
    transition: `opacity ${duration}ms`
}

// LINK OPACITY SETTING
const linkTransitionStyles = {
    entering: { opacity: 0 },
    entered: { opacity: 1 },
    exiting: { opacity: 1 },
    exited: { opacity: 0 }
}

const MenuList = (props) => {

  const initFormFilter = {
    name: '',
    priceMin: '',
    priceMax: '',
    productType: null
  }

  const [menuList, setMenuList] = useState([])
  const [menuFilteredList, setMenuFilteredList] = useState([])
  const [isSidebarOpen, setSidebarOpen] = useState(false)
  const [isDropdownOpen, setDropdownOpen] = useState(false)
  const [saveType, setSaveType] = useState('')

  const [formFilter, setFormFilter] = useState(initFormFilter)

  useEffect(() => {
    (async() => {
      try {
        const res = await xhr.get('/menu')
        setMenuList(res.data)
      } catch (error) {
        console.log(error)
      }
    })()
  }, [])

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen)
  }

  const toggleDropdown = () => {
    setDropdownOpen(!isDropdownOpen)
  }

  const handleChangeFilter = (name, value) => {
    setFormFilter({
      ...formFilter,
      [name]: value
    })
  }

  const compareValues = (key, order = 'asc') => {
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


  const renderDropdown = () => {
    let category = menuList.map(val => { return val.type?.name || '' })
    let hasil = [...new Set(category)]

    return hasil.map(val => {
      return (
          <DropdownItem onFocus={() => handleChangeFilter('productType', val)}>
              {val}
          </DropdownItem>
      )
    })
  }

  // const onSort = (key, order= 'asc') => {
  //   let arrSort = menuFilteredList.sort(compareValues( key, order ))
  //   setMenuFilteredList(arrSort)
  //   // setSort(key)
  //   // toggleCaret()
  // }

  const onSearch = useCallback(() => {
    const {
      name: _name,
      priceMin,
      priceMax,
      productType 
    } = formFilter
    let name = _name.toLowerCase()
    let min = parseInt(priceMin)
    let max = parseInt(priceMax)
    console.log(formFilter)
    let hasilFilter = menuList.filter((product) => {
      let productLowercase = product.name.toLowerCase()


      if (isNaN(min) && isNaN(max) && !productType) {
          return productLowercase.includes(name)
      } else if (isNaN(min) && isNaN(max) && !name) {
          return product.type?.name === productType
      } else if (isNaN(min) && !productType && !name) {
          return product.price <= max
      } else if (isNaN(min) && !productType && !name) {
          return product.price >= min
      } else if (isNaN(min) && !productType) {
          return productLowercase.includes(name) && product.price <= max
      } else if (isNaN(max) && !productType) {
          return productLowercase.includes(name) && product.price >= min
      } else if (isNaN(max) && !productType) {
          return product.type.name === productType && product.price >= min
      } else if (isNaN(min) && !name) {
          return product.type.name === productType && product.price <= max
      } else if (isNaN(min) && isNaN(max)) {
          return product.type.name === productType && productLowercase.includes(name)
      } else if (!productType) {
          return product.price <= max && product.price >= min && productLowercase.includes(name)
      } else if (!name) {
          return product.price <= max && product.price >= min && product.type.name === productType
      } else {
          return product.price <= max && product.price >= min && product.type === productType && productLowercase.includes(name)
      }
    })
    setMenuFilteredList(hasilFilter)
  }, [formFilter, menuList])

  useEffect(() => {
    onSearch()
  }, [onSearch, formFilter])

  const resetFilter = () => {
    setFormFilter(initFormFilter)
    setMenuFilteredList([])
  }


      // SIDEBAR FRAME
  const renderLinks = () => {
    return <Transition in={isSidebarOpen} timeout={duration}>
      {(state) => (
          <div className='mt-2' style={{
              ...linkStyle,
              ...linkTransitionStyles[state]
          }}>
              <div className='container'>
                  <h1 className="border-bottom border-dark card-title">
                      Search
                  </h1>
                  <form className='form-group'>
                      <h4>Name</h4>
                      <input 
                        type="text" 
                        value={formFilter.name}
                        onChange={(e) => {
                          handleChangeFilter('name', e.target.value)
                        }} 
                        className="form-control"
                      />
                      <h4>Price</h4>
                      <input 
                        placeholder="Minimum" 
                        value={formFilter.priceMin}
                        type="number" 
                        className="form-control mb-2 " 
                        onChange={(e) => {
                          handleChangeFilter('priceMin', e.target.value)
                        }}
                      />
                      <input 
                        placeholder="Maximum" 
                        value={formFilter.priceMax}
                        type="number" 
                        className="form-control " 
                        onChange={(e) => {
                          handleChangeFilter('priceMax', e.target.value)
                        }}
                      />
                  </form>
                  <h4>Type</h4>
                  <ButtonDropdown isOpen={isDropdownOpen} toggle={toggleDropdown}>
                      <DropdownToggle caret>
                          {
                              formFilter.productType
                                  ?
                                  formFilter.productType
                                  :
                                  'Select one...'
                          }
                      </DropdownToggle>
                      <DropdownMenu>
                          {renderDropdown()}
                      </DropdownMenu>
                  </ButtonDropdown>
                  <button onClick={resetFilter} className='btn btn-danger btn-block mt-3'>Reset filter</button>
              </div>
          </div>
        )
      }
    </Transition>
  }

  const renderMenu = () => {
    const _menuList = menuFilteredList.length ? menuFilteredList : menuList
    return _menuList.map(val => {
      return (
          <tr>
              <td>{val._id}</td>
              <td>
                {
                  val.photos.map((ph, idx) => <img style={{width:50}} src={urlLokal + ph} alt={idx} />)
                }
              </td>
              <td>{val.name}</td>
              <td>{val.price}</td>
              <td>{val.type?.name}</td>
              <td>{val.description}</td>
          </tr>
      )
    })
  }

  if (props.userName && props.userType === "admin") {
    if(!menuList.length){
        return(
            <div className='text-center'>
                <h1>
                    Loading...
                </h1>
            </div>
        )
    }
    return (
      <div className='app'>
        <div className='sidebar-container'>
          {
            isSidebarOpen === true
                ?
                <div className='d-flex '>
                    <button onClick={toggleSidebar} className='btn btn-block btn-primary py-3 mb-2 mx-0 px-0'>Close</button>
                </div>
                :
                <div className='d-flex h-100 justify-content-start'>
                    <button onClick={toggleSidebar} className='btn btn-primary btn-block p-2'> <FaBars size={30}/> </button>
                </div>

          }
          {
            isSidebarOpen === true
              ?
              <div >
                  <Transition in={isSidebarOpen} timeout={duration}>
                      {(state) => (
                          <div className="sidebar" style={{
                              ...sidebarStyle,
                              ...sidebarTransitionStyles[state]
                          }}>
                              <div>
                                  {renderLinks()}
                              </div>
                          </div>
                      )}
                  </Transition>
              </div>
              :
              ''
          }
        </div>
        <table className='table float table-hover table-striped text-center'>
          <thead className='thead-dark'>
              <th>
                  ID
              </th>
              <th>PHOTO</th>
              <th>
                  PRODUCT-NAME
              </th>
              <th>
                  PRODUCT-PRICE
              </th>
              <th>
                  PRODUCT-TYPE
              </th>
              <th>
                  PRODUCT-DESCRIPTION
              </th>
          </thead>
          <tbody>
              {renderMenu()}
          </tbody>
        </table>
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
  } else if (props.userType === "kitchen") {
      return (
          <Redirect to='/kitchen' />
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

export default connect(mapStateToProps, null)(MenuList)

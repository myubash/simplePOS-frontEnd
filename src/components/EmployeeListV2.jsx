import React, { useState, useEffect } from 'react'
import { Redirect } from 'react-router-dom'
import { connect } from 'react-redux'
import {xhr} from '../support/xhr'
import TableGeneral from './common/TableGeneral'

const EmployeeList = (props) => {

  //         employeeList: [],
  //         sort: 'id',
  //         toggleCaret: false

  const [employeeList, setEmployeeList] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await xhr.get('/employee')
      setEmployeeList(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  // const renderEmployeeList = () => {

  // }

  const tableHeader = [
    {
      label: "No",
      id: "no",
      selector: (row) => row.no,
      hidden: false,
    },
    {
      label: "Full Name",
      id: "fullName",
      selector: (row) => row.fullName,
      hidden: false,
    },
    {
      label: "Email",
      id: "email",
      selector: (row) => row.email,
      hidden: false,
    },
    {
      label: "Title",
      id: "title",
      selector: (row) => row.title,
      hidden: false,
    },
    {
      label: "Phone",
      id: "phone",
      selector: (row) => row.phone,
      hidden: false,
    },
    {
      label: "Managed By",
      id: "managed by",
      selector: (row) => row.managedBy.username || '-',
      hidden: false,
    },
  ]

  const rowDatas = (dataList = []) => {
    if (dataList.length === 0) return dataList;
    return dataList.map((data, index) => {
      return {
        ...data,
        no: index + 1,
      }
    })
  }

  

  if (props.userName && props.userType === "admin") {
    return (
        <div className='container'>
          <h3 className='text-center mt-4'> Employee list </h3>
          <TableGeneral
            header={tableHeader}
            data={rowDatas(employeeList)}
          />
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

// class EmployeeList extends Component {

//     state = {
//         employeeList: [],
//         sort: 'id',
//         toggleCaret: false
//     }

//     componentDidMount() {
//         axios.get(
//             url + '/employee'
//         )
//             .then(res => {
//                 if(res.data.error) return alert(res.data.error)
//                 console.log(res.data.list)
//                 this.setState({ employeeList: res.data.list })
//             })
//             .catch(err => {
//                 console.log(err)
//             })
//     }

//     renderEmployee = () => {
//         return this.state.employeeList.map(val => {
//             return (
//                 <tr>
//                     <td>{val.id}</td>
//                     <td>{val.userId}</td>
//                     <td>{val.userType}</td>
//                     <td>{val.name}</td>
//                     <td>{val.email}</td>
//                     <td>{val.address}</td>
//                     <td>{val.birthPlace}</td>
//                     <td>{val.birthDate}</td>
//                 </tr>
//             )
//         })
//     }

//     compareValues = (key, order = 'asc') => {
//         return function innerSort(a, b) {
//         if (!a.hasOwnProperty(key) || !b.hasOwnProperty(key)) {
//             // property doesn't exist on either object
//             return 0;
//         }

//         const varA = (isNaN(parseInt(a[key])))
//             ? a[key].toUpperCase() : parseInt(a[key])
//         const varB = (isNaN(parseInt(b[key])))
//             ? b[key].toUpperCase() : parseInt(b[key])
    
//         let comparison = 0;
//         if (varA > varB) {
//             comparison = 1;
//         } else if (varA < varB) {
//             comparison = -1;
//         }
//         return (
//             (order === 'desc') ? (comparison * -1) : comparison
//         );
//         };
//     }

//     onSort = (key,order= 'asc') => {
//         let dor = this.state.employeeList.sort(this.compareValues(key,order ))
//         this.setState({employeeList:dor,sort:key,toggleCaret: !this.state.toggleCaret})
//     }

//     render() {
//         if (this.props.userName && this.props.userType === "admin") {
//             return (
//                 <div className='container'>
//                     <h3 className='text-center mt-4'> Employee list </h3>
//                     <table className='table table-hover table-striped float text-center mt-4'>
//                         <thead className='thead-dark'>
//                             <th>EMPLOYEE-ID
//                             {
//                                 this.state.toggleCaret && this.state.sort === 'id'
//                                 ?
//                                 <FaCaretUp onClick={() =>this.onSort('id','desc')}/>
//                                 :
//                                 <FaCaretDown onClick={() =>this.onSort('id','asc')}/>
//                             }
//                             </th>
//                             <th>USER-ID
//                             {
//                                 this.state.toggleCaret && this.state.sort === 'userId'
//                                 ?
//                                 <FaCaretUp onClick={() =>this.onSort('userId','desc')}/>
//                                 :
//                                 <FaCaretDown onClick={() =>this.onSort('userId','asc')}/>
//                             }
//                             </th>
//                             <th>USER-TYPE
//                             {
//                                 this.state.toggleCaret && this.state.sort === 'userType'
//                                 ?
//                                 <FaCaretUp onClick={() =>this.onSort('userType','desc')}/>
//                                 :
//                                 <FaCaretDown onClick={() =>this.onSort('userType','asc')}/>
//                             }
//                             </th>
//                             <th>NAME
//                             {
//                                 this.state.toggleCaret && this.state.sort === 'name'
//                                 ?
//                                 <FaCaretUp onClick={() =>this.onSort('name','desc')}/>
//                                 :
//                                 <FaCaretDown onClick={() =>this.onSort('name','asc')}/>
//                             }
//                             </th>
//                             <th>EMAIL
//                             {
//                                 this.state.toggleCaret && this.state.sort === 'email'
//                                 ?
//                                 <FaCaretUp onClick={() =>this.onSort('email','desc')}/>
//                                 :
//                                 <FaCaretDown onClick={() =>this.onSort('email','asc')}/>
//                             }
//                             </th>
//                             <th>ADDRESS
//                             {
//                                 this.state.toggleCaret && this.state.sort === 'address'
//                                 ?
//                                 <FaCaretUp onClick={() =>this.onSort('address','desc')}/>
//                                 :
//                                 <FaCaretDown onClick={() =>this.onSort('address','asc')}/>
//                             }
//                             </th>
//                             <th>BIRTHPLACE
//                             {
//                                 this.state.toggleCaret && this.state.sort === 'birthPlace'
//                                 ?
//                                 <FaCaretUp onClick={() =>this.onSort('birthPlace','desc')}/>
//                                 :
//                                 <FaCaretDown onClick={() =>this.onSort('birthPlace','asc')}/>
//                             }
//                             </th>
//                             <th>BIRTHDATE
//                             {
//                                 this.state.toggleCaret && this.state.sort === 'birthDate'
//                                 ?
//                                 <FaCaretUp onClick={() =>this.onSort('birthDate','desc')}/>
//                                 :
//                                 <FaCaretDown onClick={() =>this.onSort('birthDate','asc')}/>
//                             }
//                             </th>
//                         </thead>
//                         <tbody>
//                             {
//                                 this.state.employeeList.length
//                                 ?
//                                 this.renderEmployee()
//                                 :
//                                 <tr>
//                                     <td colSpan='8' className='bg-danger'>List empty...</td>
//                                 </tr>
//                             }
//                         </tbody>
//                     </table>
//                 </div>
//             )
//         } else if (this.props.userType === "waiter") {
//             return (
//                 <Redirect to='/waiter' />
//             )
//         } else if (this.props.userType === "cashier") {
//             return (
//                 <Redirect to='/cashier' />
//             )
//         } else if (this.props.userType === "kitchen") {
//             return (
//                 <Redirect to='/kitchen' />
//             )
//         } else {
//             return (
//                 <Redirect to='/' />
//             )
//         }
//     }
// }

const mapStateToProps = state => {
    return {
        userName: state.auth.userName,
        userType: state.auth.userType
    }
}

export default connect(mapStateToProps, null)(EmployeeList)

import React, { Component } from 'react'
import SidebarContent from './SidebarContent'
import axios from 'axios'


class Sidebar extends Component {
    state = {
        isOpen: false,
        arrOrder: []
    }

    toggleSidebar = () => {
        this.setState(prevState => ({
            isOpen: !prevState.isOpen
        }))
    }

    handleDelArrC = (_arrOrder) => {
        this.setState({
            arrOrder: _arrOrder
        })
    }
    handleDelArr = () => {
        this.props.onDelArr(this.state.arrOrder)
    }



    render() {
        return (
            <div className='sidebar-container'>
                {
                    this.state.isOpen === true
                        ?
                        <div className='d-flex '>
                            <button onClick={this.toggleSidebar} className='btn btn-block btn-primary py-3 mb-2 mx-0 px-0'>Close</button>
                        </div>
                        :
                        <div className='d-flex h-100 justify-content-start '>
                            <button onClick={this.toggleSidebar} className='btn btn-primary btn-block p-0'>Order List</button>
                        </div>

                }
                {
                    this.state.isOpen === true
                        ?
                        <div >
                            <SidebarContent onDelArr={this.handleDelArr} onDelArrC={this.handleDelArrC} order={this.props.order} isOpen={this.state.isOpen} />
                        </div>
                        :
                        ''
                }


            </div>
        )
    }
}

export default Sidebar

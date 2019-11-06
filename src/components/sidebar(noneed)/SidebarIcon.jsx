import React from 'react'
import { FaWindowClose } from 'react-icons/fa'


const SidebarIcon = ({ handleClick, isOpen }) => {
    return (
        <div onClick={handleClick}>
            {
                isOpen
                    ?
                    <FaWindowClose size={32} />
                    :
                    <div className='d-flex h-100 justify-content-end '>
                        <button className='btn btn-primary h-100'>Back</button>
                    </div>
            }
        </div>
    )
}

export default SidebarIcon
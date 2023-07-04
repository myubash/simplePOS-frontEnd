import React from 'react'

const Spinner = ({className}) => (
  <div className={"spinner-border " + className} role="status">
    <span className="sr-only">Loading...</span>
  </div>
)

export default Spinner
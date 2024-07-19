import React from 'react'
import Employee from './Employee'

export default function EmployeeList() {
  return (
    <div className='row'>
      
      <div className='col-md-12'>
        <div className='jumbotron jumbotron-fluid py-4'>
          <div className='container text-center'>
            <h1 className='display-4'> Employee Register </h1>
          </div>
        </div>
      </div>

      <div className='col-md-4'>
        <Employee/>
      </div>

      <div className='col-md-8'>
          <div> list of employee records </div>
      </div>
      
    </div>
  )
}

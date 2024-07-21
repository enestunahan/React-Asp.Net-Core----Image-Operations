import React, { useEffect, useState } from 'react'
import Employee from './Employee'
import employeeService from '../Services/EmployeeService';
import { Snackbar, Alert } from '@mui/material';

export default function EmployeeList() {
  
  const [employeeList , setEmployeeList] = useState([]);
  const [recordForEdit , setRecordForEdit] = useState(null);
  const [loading , setLoading] = useState(true);
  const [error , setError] = useState(null);
  const [open, setOpen] = useState(false);
  
  useEffect(()=> {
     refreshEmployeeList();
  },[]);


  const refreshEmployeeList = async () => {

    setLoading(true);
    try{
      const data = await employeeService.getAll();
      setEmployeeList(data);
    }catch(err){
      setError(err.response ? err.response.data : err.message);
      setOpen(true);
    }finally{
      setLoading(false);
    }

  }


const addOrEdit = async (formData , onSuccess)=> {

    try{
      if(formData.get('id') === "0"){
        await employeeService.create(formData);
      }else{
        await employeeService.update(formData.get('id') , formData);
      }
      onSuccess();
      refreshEmployeeList();
    }catch(err){
      setError(err.response ? err.response.data : err.message);
      setOpen(true);
    }

}

const showRecordDetails = data => {
    setRecordForEdit(data);
}

const onDelete = async (e, id) => {
    e.stopPropagation();
    
    if(window.confirm('Are you sure to delete this record?')){
      
      try{
          await employeeService.delete(id);
          refreshEmployeeList();
      }catch(err){
        setError(err.response ? err.response.data : err.message);
        setOpen(true);
      }
    
    }
}

  const imageCard = data => (

      <div className='card' onClick={()=> showRecordDetails(data)}>
          
          <img src={data.imageSrc} className='card-img-top rounded-circle'/>
          
          <div className='card-body'>
            <h5>{data.name}</h5>
            <span> {data.occupation} </span> <br />
            <button className='btn btn-light delete-button' onClick={e => onDelete(e,parseInt(data.id)) }>
                  <i className='far fa-trash-alt'></i>
            </button>
          </div>
      
      </div>

  )

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpen(false);
  };
  
  return (
    <div className='row'>
      
      {loading ? (
        <p>Loading ...</p>
      ): (
        <>
          {error && (
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error">
              {error}
            </Alert>
          </Snackbar>
          )}

          <div className='col-md-12'>
                  <div className='jumbotron jumbotron-fluid py-4'>
                      <div className='container text-center'>
                        <h1 className='display-4'> Employee Register </h1>
                      </div>
                    </div>
          </div>

          <div className='col-md-4'>
                    <Employee
                    addOrEdit={addOrEdit} 
                    recordForEdit = {recordForEdit}
                    />
          </div>

           <div className='col-md-8'>                     
                      <table>
                        <tbody>
                          {
                            [...Array(Math.ceil(employeeList.length / 3))].map((e,i)=> 
                              <tr key={i}>
                                <td> {imageCard(employeeList[3*i])} </td>
                                <td> {employeeList[3 * i + 1] ? imageCard(employeeList[3 * i + 1]) : null} </td>
                                <td> {employeeList[3 * i + 2] ? imageCard(employeeList[3 * i + 2]) : null} </td>
                              </tr>
                            )
                          }
                        </tbody>
                  </table>                 
           </div>

        </>
      )
    }

    
      
    </div>
  )
}

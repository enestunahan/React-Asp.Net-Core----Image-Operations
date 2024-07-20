import React, { useEffect, useState } from 'react'
import Employee from './Employee'
import axios from 'axios'

export default function EmployeeList() {
  
  const [employeeList , setEmployeeList] = useState([]);
  const [recordForEdit , setRecordForEdit] = useState(null);
  
  useEffect(()=> {
    refreshEmployeeList();
  },[]);

  const employeeApi = (url = 'https://localhost:7296/api/Employee/') => {
    return {
      fetchAll: ()=> axios.get(url),
      create: newRecord => axios.post(url, newRecord),
      update: (id , updatedRecord) => axios.put(url + id , updatedRecord),
      delete: id=> axios.delete(url + id)
    }
  }

  const refreshEmployeeList = () => {
    
    employeeApi().fetchAll()
                 .then(res => setEmployeeList(res.data))
                 .catch(err => console.log(err));

  }


  const addOrEdit = (formData , onSuccess)=> {

    if(formData.get('id') === "0"){
        employeeApi().create(formData)
        .then(res => {
          onSuccess();
          refreshEmployeeList();
        })
        .catch(err => console.log(err));
    }
    else{
      employeeApi().update(formData.get('id') , formData)
      .then(res => {
        onSuccess();
        refreshEmployeeList();
      })
      .catch(err => console.log('hata' , err.response.data));
    }

     
  }


  const showRecordDetails = data => {
      setRecordForEdit(data);
  }

  const onDelete = (e, id) => {
    e.stopPropagation();
    if(window.confirm('Are you sure to delete this record?')){
      employeeApi().delete(id)
      .then(res => refreshEmployeeList())
      .catch(err => console.log(err));
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
      
    </div>
  )
}

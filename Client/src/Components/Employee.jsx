import React, { useState } from 'react'
import defaultEmployeeFoto from '../../public/img/defaultEmployee.png'


const initialFieldValues = {
  id:0,
  name:'',
  occupation: '',
  imageName : '',
  imageSrc: defaultEmployeeFoto,
  imageFile: null
}

export default function Employee(props) {
  
  const {addOrEdit} = props

  const [values , setValues] = useState(initialFieldValues);
  const [errors , setErrors] = useState({});

  const handleInputChange = (e) => {
    
    const {name , value} = e.target;
    setValues(
      {
        ...values, 
        [name]:value
      }
    )
  }

  const showPreview  = (e) => {
      if(e.target.files && e.target.files[0]){
          let imageFile = e.target.files[0];
          const reader = new FileReader();
          reader.onload = x => {
              setValues({
                ...values,
                imageFile: imageFile,
                imageSrc: x.target.result
              })
          }
          reader.readAsDataURL(imageFile);
      }
      else{
        setValues({
          ...values,
          imageFile: null,
          imageSrc: defaultEmployeeFoto
        })
      }
  }

  const validate = () =>{
    let temp = {};
    temp.name = values.name === '' ? false : true;
    temp.imageSrc = values.imageSrc === defaultEmployeeFoto ? false : true;
    setErrors(temp);
    return Object.values(temp).every(x=> x === true);
  }

  const resetForm = () => {
    setValues(initialFieldValues);
    document.getElementById('image-uploader').value = null;
    setErrors({});
  }

  const handleFormSubmit = (e) => {
    
    e.preventDefault();

      if(validate()){
        debugger;
        const formData = new FormData();

        formData.append('id' , values.id);
        formData.append('name', values.name);
        formData.append('occupation' , values.occupation);
/*        formData.append('imageName', values.imageName);*/
        formData.append('imageFile', values.imageFile);
        addOrEdit(formData , resetForm)
      }

  }

  const errorApplyClass = field => ((field in errors && errors[field] == false) ? ' invalid-field' : '');


  return (
      <>

        <div className='container text-center'>
            <p className='lead'> An Employee </p>
        </div>

        <form autoComplete='off' noValidate onSubmit={handleFormSubmit}>

            <div className='card'>


              <img src={values.imageSrc} className='card-img-top' />

              <div className='card-body'>
                  
                  <div className='form-group'>
                    <input type="file" accept='image/*' className={'form-control-file' + errorApplyClass('imageSrc')} onChange={showPreview} id='image-uploader' />
                  </div>

                  <div className='form-group'>
                    <input className={'form-control' + errorApplyClass('name')}
                           placeholder='Employee Name'
                           name='name' 
                           value={values.name} 
                           onChange={handleInputChange}
                           />
                  </div>
                 
                  <div className='form-group'>
                    <input className='form-control' 
                           placeholder='Occupation'
                           name='occupation' 
                           value={values.occupation} 
                           onChange={handleInputChange}
                          />
                  </div>

                  <div className='form-group text-center'>
                    <button type='submit' className='btn btn-dark'>Submit</button>
                  </div>
              
              </div>
            </div>

        </form>

      </>
  )

}

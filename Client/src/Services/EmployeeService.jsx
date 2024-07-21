import axios from "axios";


const BASE_URL = 'https://localhost:7296/api/Employee/';


const getAll = async () => {
    try{
        let response = await axios.get(BASE_URL);
        return response.data;
    }
    catch (err){
        console.log('Error fetching data: ' , err);
        throw err;
    }
}

const create = async (newRecord) => {
    try{
        let response = await axios.post(BASE_URL,newRecord);
        return response.data;
    }catch(err){
        console.log('Error creating employee : ' , err);
        throw err;
    }
}

const update =  async (id,  updatedRecord) => {
    try{
        let response = await axios.put(`${BASE_URL}${id}`,updatedRecord);
        return response.data;
    }catch (err){
        console.log('Error updating employee:', error);
        throw error;
    }
}

const remove = async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}${id}`);
      return response.data;
    } catch (error) {
      console.log('Error deleting employee:', error);
      throw error;
    }
};

const employeeService = {
    getAll,
    create,
    update,
    delete:remove
};

export default employeeService;
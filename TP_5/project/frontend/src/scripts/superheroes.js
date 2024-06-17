import axios from "axios";

const getSuperheroes = () => {
  try {
    return axios.get(`http://localhost:5000/api/superheroes`);
  }
  catch (error) {
    console.log(error);
  }
}

const getSuperheroesByName = (name, house = "") => {
  try {
    return axios.post(`http://localhost:5000/api/superheroes/name`, {data: {name: name, house: house}});
  }
  catch (error) {
    console.log(error);
  }
}

const getSuperheroesByHouse = (house) => {
  try {
    return axios.post(`http://localhost:5000/api/superheroes/house`, {data: house});
  }
  catch (error) {
    console.log(error);
  }
}

const getSuperheroe = (name) => {
  try {
    return axios.post(`http://localhost:5000/api/superheroe`, {data: name});
  }
  catch (error) {
    console.log(error);
  }
}

const deleteSuperhero = (name) => {
  try {
    return axios.delete(`http://localhost:5000/api/superheroes/delete`, {data: {
      name: name
    }});
  }
  catch (error) {
    console.log(error);
  }
}

const updateSuperhero = (form) => {
  try {
    return axios.post(`http://localhost:5000/api/superheroes/update`, {data: form});
  }
  catch (error) {
    console.log(error);
  }
}

const createSuperhero = (form) => {
  try {
    return axios.post(`http://localhost:5000/api/superheroes/add`, {data: form});
  }
  catch (error) {
    console.log(error);
  }
}

export {getSuperheroes, getSuperheroe, deleteSuperhero, updateSuperhero, createSuperhero, getSuperheroesByName, getSuperheroesByHouse};
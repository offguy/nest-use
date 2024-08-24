const axios = require("axios")



const getData = async () => {
    return await axios.get("https://jsonplaceholder.typicode.com/users")
}

const postData = async (user) => {
    return await axios.post("https://jsonplaceholder.typicode.com/users", user )
}

const putData = async (user) => {
    return await axios.put("https://jsonplaceholder.typicode.com/users/" + user.id, user)
} 

const deleteData = async (id) => {
    return await axios.delete("https://jsonplaceholder.typicode.com/users/" + id)
}
module.exports = {getData, postData, putData, deleteData}
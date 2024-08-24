const jFile = require("jsonfile");
const path = require("path");
const filePath = path.join(__dirname, "../..", "Data", "users.json")

const readData = async () => {
    try {
        return await jFile.readFile(filePath);
    } catch (error) {
        throw error;
    }

};
const saveData = async (users) => {
    return await jFile.writeFile(filePath, {users: users})
}

module.exports = {readData, saveData}
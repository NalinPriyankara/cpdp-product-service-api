const CategorySchema = require('../model/CategorySchema');
const {request, response} = require("express");

//POST
const createCategory = async (request, response) => {
    console.log(request.body);
}
//PUT
const updateCategory = async (request, response) => {
    console.log(request.body);
}
//DELETE
const deleteCategory = async (request, response) => {
    console.log(request.body);
}
//GET
const findCategoryById = async (request, response) => {
    console.log(request.body);
}
//GET
const findAllCategories = async (request, response) => {
    console.log(request.body);
}

module.exports = {
    createCategory, updateCategory, deleteCategory, findCategoryById, findAllCategories
}
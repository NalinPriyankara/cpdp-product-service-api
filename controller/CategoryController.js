const CategorySchema = require('../model/CategorySchema');
const {request, response} = require("express");

//POST
const createCategory = async (request, response) => {
    try{
        const {categoryName, file, countryIds} = request.body;
        if (!categoryName || !file || !countryIds) {
            return response.status(400).json({code:400, message:"Some fields are missing.", data:null});
        }

        const category = new CategorySchema({
            //client side must send the file resource
            //you must upload the icon into the S3 bucket and then you can get the response body.
            //the client send the ids of all the available countries, and the system must find all the countries for the request.

            categoryName: request.body.categoryName,
            icon: {
                hash: 'Temp Hash',
                resourceUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR01iIIKHc5FLioR2D8Voo5YM6Bpdxqqa4cZQ&s',
                fileName: 'Temp File Name',
                directory: 'Temp Directory'
            },
            availableCountries: [
                {
                    countryId: 'Temp-id-1',
                    countryName: 'Sri Lanka'
                },
                {
                    countryId: 'Temp-id-2',
                    countryName: 'UK'
                },
            ]
        });
        const saveData = await category.save();
        return response.status(201).json({code:201, message:"Category has been saved.", data:saveData});
    }catch (e) {
        response.status(500).json({code:500, message:'Server Error.', error:err});
    }
}
//PUT
const updateCategory = async (request, response) => {
    try{
        const {categoryName} = request.body;
        if (!categoryName) {
            return response.status(400).json({code:400, message:"Some fields are missing.", data:null});
        }
        const updateData = await CategorySchema.findOneAndUpdate({'_id':request.params.id},{
            $set: {
                categoryName:categoryName
            }
        },{new: true});
        return response.status(200).json({code:200, message:"Category has been updated.", data:updateData});
    }catch (e) {
        response.status(500).json({code:500, message:'Server Error.', error:e});
    }
}
//DELETE
const deleteCategory = async (request, response) => {
    try{
        if (!request.params.id) {
            return response.status(400).json({code:400, message:"Some fields are missing.", data:null});
        }
        const deletedData = await CategorySchema.findOneAndDelete({'_id':request.params.id});
        return response.status(204).json({code:204, message:"Category has been deleted.", data:deletedData});
    }catch (e) {
        response.status(500).json({code:500, message:'Server Error.', error:e});
    }
}
//GET
const findCategoryById = async (request, response) => {
    try{
        if (!request.params.id) {
            return response.status(400).json({code:400, message:"Some fields are missing.", data:null});
        }
        const categoryData = await CategorySchema.findById({'_id':request.params.id});
        if (categoryData){
            return response.status(200).json({code:200, message:"Category data.", data:categoryData});
        }
        return response.status(404).json({code:404, message:"Category data not found.", data:null});
    }catch (e) {
        response.status(500).json({code:500, message:'Server Error.', error:e});
    }
}
//GET
const findAllCategories = async (request, response) => {
    try{
        const {searchText, page=1, size=10} = request.query;
        const pageIndex = parseInt(page);
        const pageSize = parseInt(size);

        const query = {};
        if (searchText){
            query.$text={$search: searchText}
        }
        const skip = (pageIndex-1)*pageSize;
        const categoryList = await CategorySchema.find(query)
            .limit(pageSize)
            .skip(skip);
        const categoryListCount = await CategorySchema.countDocuments(query);
        return response.status(200).json({code:200, message:"Category data.", data:{list:categoryList, dataCount:categoryListCount}});
    }catch (e) {
        response.status(500).json({code:500, message:'Server Error.', error:e});
    }
}

module.exports = {
    createCategory, updateCategory, deleteCategory, findCategoryById, findAllCategories
}
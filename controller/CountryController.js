const CountrySchema = require('../models/CountrySchema');
const CategorySchema = require("../model/CategorySchema");

const createCountry = async (request, response) => {
    try{
        const {countryName, file, countryCode} = request.body;
        if(!countryName || !file || !countryCode){
            return response.status(400).json({code:400, message:"some fields are missing."});
        }
        const country = new CountrySchema({
            countryName: countryName,
            flag:{
                hash: 'Temp Hash',
                resourceUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR01iIIKHc5FLioR2D8Voo5YM6Bpdxqqa4cZQ&s',
                fileName: 'Temp File Name',
                directory: 'Temp Directory'
            },
            countryCode: countryCode
        });
        const saveData = await country.save();
        return response.status(201).json({code:201, message:"Country has been saved.", data:saveData});
    }catch (e) {
        response.status(500).json({code:500, message:'Server Error.', error:err});
    }
}
const updateCountry= async (request, response) => {
    try{
        const {countryName, countryCode} = request.body;
        if (!countryName || !countryCode) {
            return response.status(400).json({code:400, message:"Some fields are missing.", data:null});
        }
        const updateData = await CountrySchema.findOneAndUpdate({'_id':request.params.id},{
            $set: {
                countryName:countryName,
                countryCode:countryCode
            }
        },{new: true});
        return response.status(200).json({code:200, message:"Country has been updated.", data:updateData});
    }catch (e) {
        response.status(500).json({code:500, message:'Server Error.', error:e});
    }
}
//DELETE
const deleteCountry = async (request, response) => {
    try{
        if (!request.params.id) {
            return response.status(400).json({code:400, message:"Some fields are missing.", data:null});
        }
        const deletedData = await CountrySchema.findOneAndDelete({'_id':request.params.id});
        return response.status(204).json({code:204, message:"Country has been deleted.", data:deletedData});
    }catch (e) {
        response.status(500).json({code:500, message:'Server Error.', error:e});
    }
}
//GET
const findCountryById = async (request, response) => {
    try{
        if (!request.params.id) {
            return response.status(400).json({code:400, message:"Some fields are missing.", data:null});
        }
        const countryData = await CountrySchema.findById({'_id':request.params.id});
        if (countryData){
            return response.status(200).json({code:200, message:"Country data.", data:countryData});
        }
        return response.status(404).json({code:404, message:"Country data not found.", data:null});
    }catch (e) {
        response.status(500).json({code:500, message:'Server Error.', error:e});
    }
}
//GET
const findAllCountries = async (request, response) => {
    try{
        const {searchText, page=1, size=10} = request.query;
        const pageIndex = parseInt(page);
        const pageSize = parseInt(size);

        const query = {};
        if (searchText){
            query.$text={$search: searchText}
        }
        const skip = (pageIndex-1)*pageSize;
        const countryList = await CountrySchema.find(query)
            .limit(pageSize)
            .skip(skip);
        const countryListCount = await CountrySchema.countDocuments(query);
        return response.status(200).json({code:200, message:"Country data.", data:{list:countryList, dataCount:countryListCount}});
    }catch (e) {
        response.status(500).json({code:500, message:'Server Error.', error:e});
    }
}

module.exports = {
    createCountry, updateCountry, deleteCountry, findCountryById, findAllCountries
}
const CartSchema = require('../model/CartSchema');
const {request, response} = require("express");

//POST
const createCartRecord = async (request, response) => {
    try{
        const {userId, productId, qty, createdDate} = request.body;
        if (!userId || !productId  || !qty || !createdDate) {
            return response.status(400).json({code:400, message:"Some fields are missing.", data:null});
        }

        const cart = new CartSchema({
            userId: userId,
            productId: productId,
            qty: qty,
            createdDate: createdDate
        });
        const saveData = await cart.save();
        return response.status(201).json({code:201, message:"Cart record has been saved.", data:saveData});
    }catch (e) {
        response.status(500).json({code:500, message:'Server Error.', error:err});
    }
}
//PUT
const updateCartRecord = async (request, response) => {
    try{
        const {userId, productId, qty, createdDate} = request.body;
        if (!userId || !productId || !qty || !createdDate) {
            return response.status(400).json({code:400, message:"Some fields are missing.", data:null});
        }
        const updateData = await CartSchema.findOneAndUpdate({'_id':request.params.id},{
            $set: {
                userId: userId,
                productId: productId,
                qty: qty,
                createdDate: createdDate
            }
        },{new: true});
        return response.status(200).json({code:200, message:"Cart record has been updated.", data:updateData});
    }catch (e) {
        response.status(500).json({code:500, message:'Server Error.', error:e});
    }
}
//DELETE
const deleteCartRecord = async (request, response) => {
    try{
        if (!request.params.id) {
            return response.status(400).json({code:400, message:"Some fields are missing.", data:null});
        }
        const deletedData = await CartSchema.findOneAndDelete({'_id':request.params.id});
        return response.status(204).json({code:204, message:"Cart record has been deleted.", data:deletedData});
    }catch (e) {
        response.status(500).json({code:500, message:'Server Error.', error:e});
    }
}
//GET
const findCartRecordById = async (request, response) => {
    try{
        if (!request.params.id) {
            return response.status(400).json({code:400, message:"Some fields are missing.", data:null});
        }
        const cartData = await CartSchema.findById({'_id':request.params.id});
        if (cartData){
            return response.status(200).json({code:200, message:"Product data.", data:cartData});
        }
        return response.status(404).json({code:404, message:"Cart data not found.", data:null});
    }catch (e) {
        response.status(500).json({code:500, message:'Server Error.', error:e});
    }
}
//GET
const findAllCartRecords = async (request, response) => {
    try{
        const {page=1, size=10} = request.query;
        const pageIndex = parseInt(page);
        const pageSize = parseInt(size);

        const skip = (pageIndex-1)*pageSize;
        const cartDataList = await CartSchema.find()
            .limit(pageSize)
            .skip(skip);
        const cartDataListCount = await CartSchema.countDocuments();
        return response.status(200).json({code:200, message:"Product data.", data:{list:cartDataList, dataCount:cartDataListCount}});
    }catch (e) {
        response.status(500).json({code:500, message:'Server Error.', error:e});
    }
}

module.exports = {
    createCartRecord, updateCartRecord, deleteCartRecord, findCartRecordById, findAllCartRecords
}
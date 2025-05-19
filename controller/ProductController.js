const ProductSchema = require('../model/ProductSchema');
const {request, response} = require("express");

//POST
const createProduct = async (request, response) => {
    try{
        const {productName, images, actualPrice, oldPrice, qty, description, discount, categoryId} = request.body;
        if (!productName || !images || !actualPrice || oldPrice || qty || description || discount || categoryId) {
            return response.status(400).json({code:400, message:"Some fields are missing.", data:null});
        }

        const product = new ProductSchema({
            productName: productName,
            images: [
                {
                    hash: 'Temp Hash',
                    resourceUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR01iIIKHc5FLioR2D8Voo5YM6Bpdxqqa4cZQ&s',
                    fileName: 'Temp File Name',
                    directory: 'Temp Directory'
                }
            ],
            actualPrice: actualPrice,
            oldPrice: oldPrice,
            qty: qty,
            description: description,
            discount: discount,
            categoryId: categoryId
        });
        const saveData = await product.save();
        return response.status(201).json({code:201, message:"Product has been saved.", data:saveData});
    }catch (e) {
        response.status(500).json({code:500, message:'Server Error.', error:err});
    }
}
//PUT
const updateProduct = async (request, response) => {
    try{
        const {productName, actualPrice, oldPrice, qty, description, discount, categoryId} = request.body;
        if (!productName || !actualPrice || oldPrice || qty || description || discount || categoryId) {
            return response.status(400).json({code:400, message:"Some fields are missing.", data:null});
        }
        const updateData = await ProductSchema.findOneAndUpdate({'_id':request.params.id},{
            $set: {
                productName: productName,
                actualPrice: actualPrice,
                oldPrice: oldPrice,
                qty: qty,
                description: description,
                discount: discount,
                categoryId: categoryId
            }
        },{new: true});
        return response.status(200).json({code:200, message:"Product has been updated.", data:updateData});
    }catch (e) {
        response.status(500).json({code:500, message:'Server Error.', error:e});
    }
}
//DELETE
const deleteProduct = async (request, response) => {
    try{
        if (!request.params.id) {
            return response.status(400).json({code:400, message:"Some fields are missing.", data:null});
        }
        const deletedData = await ProductSchema.findOneAndDelete({'_id':request.params.id});
        return response.status(204).json({code:204, message:"Product has been deleted.", data:deletedData});
    }catch (e) {
        response.status(500).json({code:500, message:'Server Error.', error:e});
    }
}
//GET
const findProductById = async (request, response) => {
    try{
        if (!request.params.id) {
            return response.status(400).json({code:400, message:"Some fields are missing.", data:null});
        }
        const productData = await ProductSchema.findById({'_id':request.params.id});
        if (productData){
            return response.status(200).json({code:200, message:"Product data.", data:productData});
        }
        return response.status(404).json({code:404, message:"Product data not found.", data:null});
    }catch (e) {
        response.status(500).json({code:500, message:'Server Error.', error:e});
    }
}
//GET
const findAllProducts = async (request, response) => {
    try{
        const {searchText, page=1, size=10} = request.query;
        const pageIndex = parseInt(page);
        const pageSize = parseInt(size);

        const query = {};
        if (searchText){
            query.$text={$search: searchText}
        }
        const skip = (pageIndex-1)*pageSize;
        const productList = await ProductSchema.find(query)
            .limit(pageSize)
            .skip(skip);
        const productListCount = await ProductSchema.countDocuments(query);
        return response.status(200).json({code:200, message:"Product data.", data:{list:productList, dataCount:productListCount}});
    }catch (e) {
        response.status(500).json({code:500, message:'Server Error.', error:e});
    }
}

module.exports = {
    createProduct, updateProduct, deleteProduct, findProductById, findAllProducts
}
const BookmarkSchema = require('../model/BookmarkSchema');
const {request, response} = require("express");

//POST
const createBookmark = async (request, response) => {
    try{
        const {userId, productId, createdDate} = request.body;
        if (!userId || !productId  || !createdDate) {
            return response.status(400).json({code:400, message:"Some fields are missing.", data:null});
        }

        const bookmark = new BookmarkSchema({
            userId: userId,
            productId: productId,
            createdDate: createdDate
        });
        const saveData = await bookmark.save();
        return response.status(201).json({code:201, message:"Bookmark has been saved.", data:saveData});
    }catch (e) {
        response.status(500).json({code:500, message:'Server Error.', error:err});
    }
}
//PUT
const updateBookmark = async (request, response) => {
    try{
        const {userId, productId, createdDate} = request.body;
        if (!userId || !productId || !createdDate) {
            return response.status(400).json({code:400, message:"Some fields are missing.", data:null});
        }
        const updateData = await BookmarkSchema.findOneAndUpdate({'_id':request.params.id},{
            $set: {
                userId: userId,
                productId: productId,
                createdDate: createdDate
            }
        },{new: true});
        return response.status(200).json({code:200, message:"Bookmark has been updated.", data:updateData});
    }catch (e) {
        response.status(500).json({code:500, message:'Server Error.', error:e});
    }
}
//DELETE
const deleteBookmark = async (request, response) => {
    try{
        if (!request.params.id) {
            return response.status(400).json({code:400, message:"Some fields are missing.", data:null});
        }
        const deletedData = await BookmarkSchema.findOneAndDelete({'_id':request.params.id});
        return response.status(204).json({code:204, message:"Bookmark has been deleted.", data:deletedData});
    }catch (e) {
        response.status(500).json({code:500, message:'Server Error.', error:e});
    }
}
//GET
const findCartBookmarkById = async (request, response) => {
    try{
        if (!request.params.id) {
            return response.status(400).json({code:400, message:"Some fields are missing.", data:null});
        }
        const bookmarkData = await BookmarkSchema.findById({'_id':request.params.id});
        if (bookmarkData){
            return response.status(200).json({code:200, message:"Bookmark data.", data:bookmarkData});
        }
        return response.status(404).json({code:404, message:"Bookmark data not found.", data:null});
    }catch (e) {
        response.status(500).json({code:500, message:'Server Error.', error:e});
    }
}
//GET
const findAllBookmarks = async (request, response) => {
    try{
        const {page=1, size=10} = request.query;
        const pageIndex = parseInt(page);
        const pageSize = parseInt(size);

        const skip = (pageIndex-1)*pageSize;
        const bookmarkDataList = await BookmarkSchema.find()
            .limit(pageSize)
            .skip(skip);
        const bookmarkListCount = await BookmarkSchema.countDocuments();
        return response.status(200).json({code:200, message:"Product data.", data:{list:bookmarkDataList, dataCount:bookmarkListCount}});
    }catch (e) {
        response.status(500).json({code:500, message:'Server Error.', error:e});
    }
}

module.exports = {
    createBookmark, updateBookmark, deleteBookmark, findCartBookmarkById, findAllBookmarks
}
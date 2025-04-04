const express = require('express');
const router = express.Router();
const Video = require('../models/Video');

// Create Video

router.post('/', async(req,res)=>{
    try{
        const newVideo = new Video(req.body);
        const savedVideo = await newVideo.save();
        res.status(201).json(savedVideo);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
});

 //GET all videos

 router.get('/', async(req,res) =>{
    try {
        const videos = await Video.find();
        res.json(videos);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
 })

 // Delete video

 router.delete('/:id', async(req,res)=> {
    try {
        await Video.findByIdAndDelete(req.params.id);
        res.json({message:'Video deleted'});
    } catch (err){
        res.status(500).json({error: err.message});
    }
 })

 module.exports = router;
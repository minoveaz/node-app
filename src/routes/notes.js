const express = require("express")
const router = express.Router();

const Note = require("../models/Note")

router.get('/notes/add', (req, res) => {
    res.render('notes/new-note');
});

router.post('/notes/new-note', async (req, res) => {
    const {tittle, description} = req.body;
    console.log(req.body);

    const errors = [];
    if(!tittle){
        errors.push({text: 'Please put a tittle in the Note'})
    }
    if(!description){
        errors.push({text: 'Please put a Description in the Note'})
    }
    if(errors.length > 0){
        res.render('notes/new-note', {
            errors, 
            tittle, 
            description
        })
    }
    else{
        const newNote = new Note({tittle, description});
        await newNote.save();
        console.log(newNote);
        req.flash('success_msg', 'Note Added Successfully')
        res.redirect("/notes")
    }
});


router.get('/notes', async (req, res) => {
    const notes = await Note.find().lean().sort({date: 'desc'});
    res.render('notes/all-notes', {notes})
});

router.get('/notes/edit/:id', async (req, res) => {
    const note = await Note.findById(req.params.id).lean();
    res.render('notes/edit-note',{note})
}) 

router.put('/notes/edit-note/:id', async (req, res) => {
    const {tittle, description} = req.body;
    await Note.findByIdAndUpdate(req.params.id, {tittle, description});
    req.flash('success_msg', 'Note Updated Succesfully')
    res.redirect('/notes')
})

router.delete('/notes/delete/:id', async(req, res) =>{
    await Note.findByIdAndRemove(req.params.id)
    console.log(req.params.id);
    req.flash('success_msg', 'Note Deleted Succesfully')
    res.redirect('/notes')
})

module.exports = router
const router = require('express').Router();
const Notes = require('../models/Notes');
const { isAuthenticated } = require('../helpers/auth');

router.get('/notes', isAuthenticated, async (req, res) =>{
    const notes = await Notes.find({user: req.body.id}).sort({date: 'desc'});
    res.render('notes/all-notes', { notes });
});

router.get('/notes/add', isAuthenticated, (req, res) =>{
    res.render('notes/new-notes');
});

router.post('/notes/new-note', isAuthenticated, async (req, res) =>{
    const { tittle, description } = req.body;
    const errors = [];
    if(!tittle){
        errors.push({text: 'Please write a tittle'});
    } 
    if(!description){
        errors.push({text: 'Please write a description'});
    }
    if(errors.length > 0){
        res.render('notes/new-notes', {
            errors,
            tittle,
            description
        });
    }
    else{
        const newNotes = new Notes({tittle, description});
        newNotes.user = req.user.id;
        await newNotes.save();
        req.flash('success_msg', 'Note added success');
        res.redirect('/notes');
    }
});

router.get('/notes/edit/:id', isAuthenticated, async (req, res) =>{
    const note = await Notes.findById(req.params.id);
    res.render('notes/edit-note', {note});
});

router.put('/notes/edit-note/:id', isAuthenticated, async (req, res) => {
    const {tiitle, description} = req.body;
    await Notes.findByIdAndUpdate(req.params.id, {tiitle, description});
    req.flash('success_msg', 'Note updated successfully');
    res.redirect('/notes');
});

router.delete('/notes/delete/:id', isAuthenticated, async (req, res) => {
    await Notes.findByIdAndDelete(req.params.id);
    req.flash('success_msg', 'Note deleted successfully');
    res.redirect('/notes');
});

module.exports = router;
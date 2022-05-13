// Write your "projects" router here!
const express = require('express');
const { handleError, validateProjectId, validateProject} = require('./projects-middleware');
const Projects = require('./projects-model');

const router = express.Router();

router.get('/', (req, res, next) => {
    Projects.get()
        .then(projects => {
            res.status(200).json(projects)
        })
        .catch(next);
})

router.get('/:id', validateProjectId, (req, res, next) => {
    res.status(200).json(req.project);
})

router.get('/:id/actions', validateProjectId, (req, res, next) => {
    Projects.getProjectActions(req.params.id)
        .then(actions => {
            res.status(201).json(actions);
        })
        .catch(next);
})

router.post('/', validateProject, (req, res, next) => {
    Projects.insert(req.body)
        .then(newProject => {
            res.status(201).json(newProject);
        })
        .catch(next);
})

router.put('/:id', validateProjectId, validateProject, (req, res, next) => {
    
        Projects.update(req.params.id, 
                        {   name: req.body.name, 
                            description: req.body.description, 
                            completed: req.body.completed || false})
        .then(updatedProject => {
            res.status(200).json(updatedProject);
        })
        .catch(next);
})

router.delete('/:id', validateProjectId, (req, res, next) => {
    Projects.remove(req.params.id)
    .then(deletedProjectAction => {
        res.status(200).json(deletedProjectAction);
    })
    .catch(next);
})


router.use(handleError)

module.exports = router;
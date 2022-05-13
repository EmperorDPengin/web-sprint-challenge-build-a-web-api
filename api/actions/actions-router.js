// Write your "actions" router here!
const express = require('express');
const Actions = require('./actions-model');
const { handleError, validateActionId, validateActions, checkActionPostTargetId } = require('./actions-middlware'); 

const actionsRouter = express.Router();

actionsRouter.get('/', (req, res, next) => {
    Actions.get()
        .then( actions => {
            res.status(201).json(actions);
        })
        .catch(next)
})

actionsRouter.get('/:id',validateActionId, (req, res, next) => {
    res.status(201).json(req.action);
})

actionsRouter.post('/',validateActions, checkActionPostTargetId, (req, res, next) => {
    Actions.insert(req.body)
        .then(newAction => {
            res.status(201).json(newAction);
        })
        .catch(next);
})

actionsRouter.put('/:id',validateActionId, validateActions, checkActionPostTargetId, (req, res, next) => {
    Actions.update(req.params.id, 
                {   
                    project_id: req.body.project_id, 
                    description: req.body.description, 
                    notes: req.body.notes,
                    completed: req.body.completed || false
                })
    .then(updatedAction => {
    res.status(200).json(updatedAction);
    })
    .catch(next);
})

actionsRouter.delete('/:id',validateActionId, (req, res, next) => {
    Actions.remove(req.params.id)
        .then(deletedAction => {
            res.status(200).json(deletedAction);
        })
        .catch(next);
})

actionsRouter.use(handleError);

module.exports = actionsRouter;
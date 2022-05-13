// add middlewares here related to actions
const Actions = require('./actions-model');
const Projects = require('../projects/projects-model');
const yup = require('yup');

function handleError(err, req, res, next) {
    res.status(err.status || 500).json({
        message: err.message,
        prodMessage: 'something went wrong'
    });
}

function validateActionId(req, res, next) {
    Actions.get(req.params.id)
        .then( actionById => {
            if (actionById) {
                req.action = actionById;
                next();
            } else {
                next({ status: 404, message: "action not found"});
            }
        })
        .catch(next);
}

const actionSchema = yup.object().shape({
    project_id: yup
        .number('Project ID should be a Number')
        .required('Project ID is required'),
    description: yup
        .string()
        .trim()
        .required('Description is rquired'),
    notes: yup
        .string()
        .trim()
        .required('Notes are required'),
    completed: yup.boolean()

})
function validateActions(req, res, next) {
    actionSchema.validate(req.body,
        {
            strict: true,
            stripUnknown: true
        })
            .then(validated => {
                req.body = validated;
                next();
            })
            .catch(err => {
                next({ status: 400, message: err.message})
            })
}

function checkActionPostTargetId(req, res, next) {
    const { projectId } = req.body;

    Projects.get(projectId)
        .then( projectById => {
            if (projectById) {
                next();
            } else {
                next({ status: 404, message: "project with ID not found"});
            }
        })
        .catch(next);
}

module.exports = {
    handleError,
    validateActionId,
    validateActions,
    checkActionPostTargetId
}
// add middlewares here related to projects
const Projects = require('./projects-model');
const yup = require('yup');


function handleError(err, req, res, next) {
    res.status(err.status || 500).json({
        message: err.message,
        prodMessage: 'something went wrong'
    });
}

function validateProjectId(req, res, next) {
    Projects.get(req.params.id)
        .then( projectById => {
            if (projectById) {
                req.project = projectById;
                next();
            } else {
                next({ status: 404, message: "project not found"});
            }
        })
        .catch(next);
}

const projectSchema = yup.object().shape({
    name: yup
        .string()
        .trim()
        .min(1)
        .required('the projects needs a name')
        .max(50, 'Project Name cannot be more than 50 characters long'),
    description: yup
        .string()
        .trim()
        .required('the projects needs a description')
        .max(200, 'Project Description cannot be more than 200 characters long'),
    completed: yup
        .bool()
        .required('the projects needs a completed')
})
function validateProject(req, res, next) {
    projectSchema.validate(req.body,
        {
            strict: true,
            stripUnknown: true
        })
            .then(validated => {
                req.body = validated;
                next();
            })
            .catch(err => {
                next({ status: 400, message: 'The Project is missing information'})
            })
}

module.exports = {
    handleError,
    validateProjectId,
    validateProject
}
const Joi = require('@hapi/joi');

module.exports = {
  schemaRegistration: Joi.object().keys({
    username: Joi.string().required(),
    surName: Joi.string().required(),
    firstName: Joi.string().required(),
    middleName: Joi.string().required(),
    password: Joi.string().required(),
  }),
  schemaUpdateProfileInfo: Joi.object().keys({
    firstName: Joi.string().required(),
    middleName: Joi.string().required(),
    surName: Joi.string().required(),
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
    avatar: Joi.string().required(),
  })
}

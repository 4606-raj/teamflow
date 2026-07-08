import * as Joi from 'joi'

export const envValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),

  PORT: Joi.number().default(3000),

  DATABASE_URL: Joi.string().required(),

  DB_HOST: Joi.string().required(),

  DB_PORT: Joi.number().required(),

  DB_USER: Joi.string().required(),

  DB_NAME: Joi.string().required(),

  DB_PASSWORD: Joi.string().required(),

  JWT_ACCESS_SECRET: Joi.string().required(),

  JWT_ACCESS_EXPIRES_IN: Joi.string().required(),

  JWT_REFRESH_SECRET: Joi.string().required(),

  JWT_REFRESH_EXPIRES_IN: Joi.string().required(),
})
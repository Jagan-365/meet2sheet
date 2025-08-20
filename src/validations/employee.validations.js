import Joi from "joi";

const emailSchema = Joi.string().trim().email().lowercase().required();

const dateSchema = Joi.string()
  .pattern(/^\d{4}-\d{2}-\d{2}$/)
  .message("Date must be in format YYYY-MM-DD");

export const getEmployeeSchema = {
    query: Joi.object({
        email: emailSchema
    })
};

export const getJobsSchema = {
  query: Joi.object({
    email: emailSchema
  })
};

export const createTimeLogSchema = {
  body: Joi.object({
    user: Joi.string().trim().required().messages({
      "string.empty": "User is required"
    }),

    jobId: Joi.string().trim().required().messages({
      "string.empty": "Job ID is required"
    }),

    workDate: dateSchema.required(),

    hours: Joi.string()
    .pattern(/^([01]\d|2[0-3]):([0-5]\d)$/)
    .required()
    .messages({
    "string.pattern.base": "Hours must be in format HH:mm (00:00 to 23:59)",
    "string.empty": "Hours is required"
   }),

    billingStatus: Joi.string()
      .valid("Billable", "Non-billable")
      .optional()
      .messages({
        "any.only": "Billing status must be either 'Billable' or 'Non-billable'"
      }),

    workItem: Joi.string().trim().optional(),

    description: Joi.string().trim().optional(),

    projectId: Joi.string().trim().optional(),

    projectName: Joi.string().trim().optional()
  }).oxor("projectId", "projectName") // ✅ only one of them allowed
};


export const getTimeSheetSchema = {
    query: Joi.object({
        user: Joi.string().required(),
        fromDate: dateSchema.required(),  // format: yyyy-MM-dd
        toDate: dateSchema.required()
    })
};

export const createTimeSheetSchema = {
  body: Joi.object({
    user: Joi.string().trim().required(),
    timesheetName: Joi.string().trim().required(),
    fromDate: dateSchema.required(),
    toDate: dateSchema.required()
  })
};

export const updateTimeSheetSchema = {
    body: Joi.object({
        timesheetId: Joi.string().required(),
        sendforApproval: Joi.boolean().required()
    })
};

export const updateTimeSheetStatusSchema = {
  body: Joi.object({
   timesheetId: Joi.string().trim().required(),
  approvalStatus: Joi.string()
    .valid("approved", "rejected")
    .required(),
  })
};


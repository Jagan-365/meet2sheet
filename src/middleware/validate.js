export function validate(schema, property) {
    return (req, res, next) => {
        let targetSchema;
        let targetProperty;

        if (schema.query) {
            targetSchema = schema.query;
            targetProperty = "query";
        } else if (schema.body) {
            targetSchema = schema.body;
            targetProperty = "body";
        } else if (schema.params) {
            targetSchema = schema.params;
            targetProperty = "params";
        } else {
            return res.status(500).json({
                success: false,
                message: "Invalid schema passed to validator"
            });
        }

        const { error } = targetSchema.validate(req[targetProperty]);
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Validation error",
                details: error.details.map(d => d.message),
            });
        }
        next();
    };
}

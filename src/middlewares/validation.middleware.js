

import { errorRes } from "../utils/error.handle.js";

export const validation = (Schema) => {
    return (req, res, next) => {
        try {
            const validationErrors = [];

            Object.keys(Schema).forEach((key) => {
                const validationRes = Schema[key].safeParse(req[key]);

                if (!validationRes.success) {
                    validationErrors.push({
                        [key]: validationRes.error.issues
                    });
                } else {
                    req[key] = validationRes.data;
                }
            });

            if (validationErrors.length > 0) {
                return errorRes({
                    msg: "Validation errors",
                    statusCode: 400,
                    options: validationErrors
                });
            }

            return next();

        } catch (error) {
            return next(error);
        }
    };
};
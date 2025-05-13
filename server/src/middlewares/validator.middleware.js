
export const validate = (schema) => async (req, res, next) => {
  console.log('Validate:', req.body); 
  
  try {
    await schema.parseAsync(req.body);  
    next();  
  } catch (error) {
    console.error('Validation Error:', error.errors);  
    res.status(400).json({
      message: "Validation failed",
      errors: error.errors  
    });
  }
};

// middlewares/parseJsonFields.js

export const parseJsonFields = (fields = []) => {
  return (req, res, next) => {
    for (const field of fields) {
      if (req.body[field] && typeof req.body[field] === "string") {
        try {
          req.body[field] = JSON.parse(req.body[field]);
        } catch (err) {
          return res.status(400).json({
            message: `Invalid JSON format for field: ${field}`,
          });
        }
      }
    }
    next();
  };
};

// errorHandler.js

export function errorHandler(err, req, res, next) {
  // 4a: Validation error -> 400 with a { field: message } map
  if (err.name === "ValidationError") {
    const fields = {};
    for (const key in err.errors) fields[key] = err.errors[key].message;
    return res.status(400).json({ error: "ValidationError", fields });
  }

  // 4b: Bad ID format -> 400
  if (err.name === "CastError") {
    return res.status(400).json({ error: "CastError", message: "Invalid ID format", field: err.path });
  }

  // 4c: Duplicate key -> 409
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ error: "DuplicateKey", message: field + " already exists", field });
  }

  // Fallback (provided) - unknown error.
  console.error(err);
  res.status(500).json({ error: "InternalServerError" });
}
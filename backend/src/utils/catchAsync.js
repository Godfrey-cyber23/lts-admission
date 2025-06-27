/**
 * @desc    Higher-order function to wrap async/await route handlers
 * @param   {Function} fn - Async route handler function
 * @returns {Function} Wrapped middleware function with error handling
 * 
 * @example
 * router.get('/', catchAsync(async (req, res) => {
 *   const data = await fetchData();
 *   res.json(data);
 * }));
 */
const catchAsync = fn => {
  return (req, res, next) => {
    // Add request context to errors
    const requestContext = {
      path: req.path,
      method: req.method,
      params: req.params,
      query: req.query,
      ip: req.ip,
      timestamp: new Date().toISOString()
    };

    // Handle both async errors and sync errors
    Promise.resolve(fn(req, res, next))
      .catch(error => {
        // Attach request context to error
        error.requestContext = requestContext;
        
        // Handle specific error types differently if needed
        if (error.name === 'ValidationError') {
          error.statusCode = 400;
        }
        
        // Pass to Express error handler
        next(error);
      });
  };
};

export default catchAsync;
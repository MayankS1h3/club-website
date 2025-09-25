// Middleware to preprocess FormData for event creation
export const preprocessEventData = (req, res, next) => {
  // Convert string numbers to actual numbers for validation
  if (req.body.ticket_price) {
    req.body.ticket_price = parseFloat(req.body.ticket_price);
  }
  
  if (req.body.max_capacity) {
    req.body.max_capacity = parseInt(req.body.max_capacity, 10);
  }
  
  // Set defaults for optional fields
  if (!req.body.event_type) {
    req.body.event_type = 'party';
  }
  
  if (!req.body.max_capacity) {
    req.body.max_capacity = 100;
  }
  
  if (!req.body.ticket_price) {
    req.body.ticket_price = 0;
  }
  
  next();
};
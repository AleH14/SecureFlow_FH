// Placeholder for auth middleware
// This will be implemented when we add JWT authentication

const auth = (req, res, next) => {
  // TODO: Implement JWT token verification
  // For now, just proceed to next middleware
  console.log('Auth middleware - Coming soon');
  next();
};

const admin = (req, res, next) => {
  // TODO: Implement admin role verification
  // For now, just proceed to next middleware
  console.log('Admin middleware - Coming soon');
  next();
};

module.exports = {
  auth,
  admin
};
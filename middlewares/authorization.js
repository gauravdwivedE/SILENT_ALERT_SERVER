const authorize = (roles = []) => {
    if (typeof roles === 'string') roles = [roles];  
    return (req, res, next) => {
      const userRole = req.user?.role;
      if (!userRole || !roles.includes(userRole)) {
        return res.status(403).json({ message: 'Access denied' });
      }
      next();
    };
  };
  
export default  authorize;
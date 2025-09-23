import jwt from 'jsonwebtoken';

export const requireAdminAuth = (jwtSecret) => {
  return (req, res, next) => {
    console.log('🔐 Admin auth check:', req.path);
    
    const token = req.cookies?.admin_token;
    if (!token) {
      console.log('❌ No admin token found');
      return res.status(401).json({ error: 'Admin authentication required' });
    }
    
    try {
      const payload = jwt.verify(token, jwtSecret);
      
      // Verify it's an admin token
      if (payload.type !== 'admin') {
        console.log('❌ Not an admin token');
        return res.status(403).json({ error: 'Admin access required' });
      }
      
      console.log('✅ Admin authenticated:', payload.username);
      req.admin = { 
        id: payload.sub, 
        username: payload.username, 
        email: payload.email 
      };
      next();
    } catch (error) {
      console.log('❌ Admin token verification failed:', error.message);
      return res.status(401).json({ error: 'Invalid admin token' });
    }
  };
}
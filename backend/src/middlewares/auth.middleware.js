import jwt from 'jsonwebtoken';

export const requireAuth = (jwtSecret) => {
  return (req, res, next) => {
    console.log('🍪 All cookies:', req.cookies);
    console.log('🔑 JWT Secret:', jwtSecret ? 'Present' : 'Missing');
    
    const token = req.cookies?.access_token;
    console.log('🎫 Token found:', token ? 'Yes' : 'No');
    
    if (!token) return res.status(401).json({ error: 'Unauthorized - No token' });
    
    try {
      const payload = jwt.verify(token, jwtSecret);
      console.log('✅ JWT verified successfully:', payload);
      req.user = { id: payload.sub, email: payload.email };
      next();
    } catch (error) {
      console.log('❌ JWT verification failed:', error.message);
      return res.status(401).json({ error: 'Unauthorized - Invalid token' });
    }
  };
}

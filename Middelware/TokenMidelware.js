const jwt = require('jsonwebtoken');
const secretKey = 'eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTcxNTMzMTEzNiwiaWF0IjoxNzE1MzMxMTM2fQ.0fZqi6zZkce5UD69Bk11Kx4neDMzvwPNp9Tt9DVtXzM';


const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check if Authorization header is present
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(200).json({ error: 'Unauthorized: No token provided' });
    }

    // Extract token from Authorization header
    const token = authHeader.split(' ')[1];

    try {
        // Verify token
        const decodedToken = jwt.verify(token, secretKey);

        // Attach decoded token payload to request object
        req.decodedToken = decodedToken;

        // Continue to the next middleware
        next();
    } catch (error) {
        // Handle token verification errors
        console.error('Token verification error:', error);
        return res.status(200).json({ error: 'Unauthorized' });
    }
};

module.exports = verifyToken;


const jwt = require('jsonwebtoken');

exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Hardcoded credentials for development as requested
    const ADMIN_EMAIL = 'info@vihaanconsulting.com';
    const ADMIN_PASS = 'Vihaan@123';

    if (email === ADMIN_EMAIL && password === ADMIN_PASS) {
      // Create a simple JWT token
      const token = jwt.sign(
        { role: 'admin', email: ADMIN_EMAIL },
        process.env.JWT_SECRET || 'fallback_secret_key_123',
        { expiresIn: '24h' }
      );

      return res.status(200).json({
        success: true,
        token,
        user: {
          id: 'admin-1',
          name: 'Admin',
          email: ADMIN_EMAIL,
          role: 'admin'

        }
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid credentials'
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during authentication'
    });
  }
};

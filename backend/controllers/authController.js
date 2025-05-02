const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const registerUser = async (req, res) => {
    const {name ,  email, password , phone } = req.body;
    console.log(req.body);
    // Check if name, email, password, and role are provided
    if (!name || !email || !password || !phone) {
      return res.status(400).json({ message: 'All fields are required' });
    }
  
    try {
        //Register Student and other approved roles directly
        const user = new User({
          name,
          email,
          password: await bcrypt.hash(password, 10),
          phone
        });
        // console.log(user);
        await user.save();
        return res.status(201).json({ message: 'Registration successful' });
    } catch (err) {
      // console.log(err.message);
      return res.status(500).json({ message: err.message });
    }
  };  

// Login logic
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: 'All fields are required' });

    try {
        const user = await User.findOne({ email }).exec();
        if (!user) return res.status(401).json({ message: 'User not found' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: 'Incorrect password' });

        // Generate JWT
        const accessToken = jwt.sign(
            { UserInfo: { 
                id: user._id, 
                name: user.name,
                email: user.email, 
                
            } },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '10h' }
        );

        // Set token as an HTTP-only cookie
        res.cookie('jwt', accessToken, {
            httpOnly: true, // accessible only by web server
            // secure: process.env.NODE_ENV === 'production', // only use secure cookies in production
            secure: true,
            sameSite: 'None', // cross-site cookie
            maxAge: 60 * 60 * 10000 // 1 hour
        });
        res.status(200).json({user,accessToken});
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const logoutUser = (req, res) => {
    res.clearCookie('jwt', {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        secure:true,
        sameSite: 'None'
    });
    res.status(200).json({ message: 'Logged out' });
};

module.exports = { registerUser, loginUser, logoutUser };
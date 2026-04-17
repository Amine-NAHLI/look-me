const User = require('../models/User');
const jwt = require('jsonwebtoken');
const { z } = require('zod');

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// Zod schemas for validation
const registerSchema = z.object({
  firstName: z.string().min(2, "Le prénom est trop court"),
  email: z.string().email("Format d'email invalide"),
  password: z.string().min(6, "Le mot de passe doit faire au moins 6 caractères")
});

const loginSchema = z.object({
  email: z.string().email("Format d'email invalide"),
  password: z.string().min(1, "Mot de passe requis")
});

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
exports.registerUser = async (req, res) => {
  try {
    const parsedData = registerSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({ message: parsedData.error.errors[0].message });
    }

    const { firstName, email, password } = parsedData.data;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Cet utilisateur existe déjà" });
    }

    // Create user
    const user = await User.create({
      firstName,
      email,
      password
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({ message: "Données d'utilisateur invalides" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'inscription" });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
exports.loginUser = async (req, res) => {
  try {
    const parsedData = loginSchema.safeParse(req.body);
    if (!parsedData.success) {
      return res.status(400).json({ message: parsedData.error.errors[0].message });
    }

    const { email, password } = parsedData.data;

    // Check for user email
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la connexion" });
  }
};

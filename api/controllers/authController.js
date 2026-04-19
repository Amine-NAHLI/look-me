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
  phone: z.string().optional(),
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

    const { firstName, email, password, phone } = parsedData.data;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "Cet utilisateur existe déjà" });
    }

    // Create user
    const user = await User.create({
      firstName,
      email,
      password,
      phone
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        firstName: user.firstName,
        email: user.email,
        phone: user.phone,
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
        phone: user.phone,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la connexion" });
  }
};

// @desc    Get user profile
// @route   GET /api/users/me
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      res.json({
        _id: user._id,
        firstName: user.firstName,
        email: user.email,
        phone: user.phone,
        role: user.role,
      });
    } else {
      res.status(404).json({ message: "Utilisateur non trouvé" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur serveur" });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/me
// @access  Private
exports.updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Check if email is already taken by another user
      if (req.body.email && req.body.email !== user.email) {
        const emailExists = await User.findOne({ email: req.body.email });
        if (emailExists) {
          return res.status(400).json({ message: "Cet email est déjà utilisé" });
        }
      }

      user.firstName = req.body.firstName || user.firstName;
      user.email = req.body.email || user.email;
      user.phone = req.body.phone || user.phone;

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: "Utilisateur non trouvé" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour" });
  }
};

// @desc    Update user password
// @route   PUT /api/users/me/password
// @access  Private
exports.updateUserPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (user && (await user.matchPassword(oldPassword))) {
      user.password = newPassword;
      await user.save();
      res.json({ message: "Mot de passe mis à jour avec succès" });
    } else {
      res.status(401).json({ message: "Ancien mot de passe incorrect" });
    }
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la mise à jour du mot de passe" });
  }
};

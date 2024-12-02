import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User, { IUser } from '../models/User';

export const register = async (req: Request, res: Response): Promise<Response> => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Email already in use.' });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    return res.status(201).json({ message: 'User registered successfully.' });
  } catch (error) {
    return res.status(500).json({ message: 'Server error.', error });
  }
};

export const login = async (req: Request, res: Response): Promise<Response> => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found.' });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials.' });

    const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET as string, {
      expiresIn: '1h',
    });

    return res.json({ token });
  } catch (error) {
    return res.status(500).json({ message: 'Server error.', error });
  }
};

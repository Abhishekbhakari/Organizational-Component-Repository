import User, { findOne } from '../models/User';
import { genSalt, hash, compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

export async function register(req, res) {
  const { username, password, role } = req.body;
  try {
    let user = await findOne({ username });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({
      username,
      password,
      role,
    });

    const salt = await genSalt(10);
    user.password = await hash(password, salt);
    await user.save();

    const payload = { user: { id: user.id } };
    sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
}


export async function login(req, res) {
  const { username, password } = req.body;
  try {
    let user = await findOne({ username });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const payload = { user: { id: user.id } };
    sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
}


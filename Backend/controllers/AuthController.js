const UserModel = require("../models/UserSchema");
const bcrypt = require("bcrypt");

const AuthController = {
    // ---------------- REGISTER ATTENDEE ----------------
    registerAttendee: async (req, res) => {
        try {
            const { firstName, lastName, email, password, phone } = req.body;

            const existing = await UserModel.findOne({ email });
            if (existing) {
                return res.json({ message: "Email already exists", status: false });
            }

            const hash = await bcrypt.hash(password, 10);

            const newUser = await UserModel.create({
                firstName,
                lastName,
                email,
                password: hash,
                phone,
                role: "attendee"
            });

            res.json({
                message: "Attendee registered successfully",
                user: {
                    id: newUser._id,
                    email: newUser.email,
                    role: newUser.role
                },
                status: true
            });
        } catch (err) {
            res.json({ message: err.message, status: false });
        }
    },

    // ---------------- REGISTER EXHIBITOR ----------------
    registerExhibitor: async (req, res) => {
        try {
            const { firstName, lastName, email, password, phone } = req.body;

            const existing = await UserModel.findOne({ email });
            if (existing) {
                return res.json({ message: "Email already exists", status: false });
            }

            const hash = await bcrypt.hash(password, 10);

            const newUser = await UserModel.create({
                firstName,
                lastName,
                email,
                password: hash,
                phone,
                role: "exhibitor"
            });

            res.json({
                message: "Exhibitor registered successfully",
                user: {
                    id: newUser._id,
                    email: newUser.email,
                    role: newUser.role
                },
                status: true
            });
        } catch (err) {
            res.json({ message: err.message, status: false });
        }
    },

    // ---------------- CREATE ORGANIZER (ADMIN ONLY) ----------------
    createOrganizer: async (req, res) => {
        try {
            const { firstName, lastName, email, password, phone } = req.body;

            const existing = await UserModel.findOne({ email });
            if (existing) {
                return res.json({ message: "Email already exists", status: false });
            }

            const hash = await bcrypt.hash(password, 10);

            const newUser = await UserModel.create({
                firstName,
                lastName,
                email,
                password: hash,
                phone,
                role: "organizer"
            });

            res.json({
                message: "Organizer account created successfully",
                user: {
                    id: newUser._id,
                    email: newUser.email,
                    role: newUser.role
                },
                status: true
            });
        } catch (err) {
            res.json({ message: err.message, status: false });
        }
    },

    // ---------------- LOGIN ----------------
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            const existing = await UserModel.findOne({ email });
            if (!existing) {
                return res.json({ message: "Account not found", status: false });
            }

            const isMatch = await bcrypt.compare(password, existing.password);
            if (!isMatch) {
                return res.json({ message: "Invalid credentials", status: false });
            }

            res.json({
                message: "Login successful",
                user: {
                    id: existing._id,
                    email: existing.email,
                    role: existing.role,
                    firstName: existing.firstName,
                    lastName: existing.lastName,
                    phone: existing.phone
                },
                status: true
            });
        } catch (err) {
            res.json({ message: err.message, status: false });
        }
    },

    // ---------------- UPDATE USER ----------------
    updateUser: async (req, res) => {
        try {
            const { id } = req.params;
            const { firstName, lastName, email, phone, password } = req.body;

            const user = await UserModel.findById(id);
            if (!user) {
                return res.json({ message: "User not found", status: false });
            }

            let updatedData = { firstName, lastName, email, phone };

            if (password) {
                const hash = await bcrypt.hash(password, 10);
                updatedData.password = hash;
            }

            const updatedUser = await UserModel.findByIdAndUpdate(id, updatedData, { new: true });

            res.json({
                message: "User updated successfully",
                user: updatedUser,
                status: true
            });
        } catch (err) {
            res.json({ message: err.message, status: false });
        }
    },

    // ---------------- DELETE USER ----------------
    deleteUser: async (req, res) => {
        try {
            const { id } = req.params;

            const user = await UserModel.findById(id);
            if (!user) {
                return res.json({ message: "User not found", status: false });
            }

            await UserModel.findByIdAndDelete(id);

            res.json({ message: "User deleted successfully", status: true });
        } catch (err) {
            res.json({ message: err.message, status: false });
        }
    },

    // ---------------- GET ALL USERS BY ROLE ----------------
    getUsersByRole: async (req, res) => {
        try {
            const { role } = req.params;

            const users = await UserModel.find({ role }).select("-password");

            res.json({
                users,
                status: true
            });
        } catch (err) {
            res.json({ message: err.message, status: false });
        }
    }
};

module.exports = AuthController;

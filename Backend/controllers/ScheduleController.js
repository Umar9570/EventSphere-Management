const ScheduleModel = require("../models/ScheduleSchema");
const ExpoModel = require("../models/ExpoSchema");

const ScheduleController = {
    // ---------------- CREATE SCHEDULE ----------------
    createSchedule: async (req, res) => {
        try {
            const { expoId, title, speaker, startTime, endTime, room } = req.body;

            const expo = await ExpoModel.findById(expoId);
            if (!expo) return res.json({ message: "Expo not found", status: false });

            const newSchedule = await ScheduleModel.create({
                expo: expoId,
                title,
                speaker,
                startTime,
                endTime,
                room
            });

            // add schedule to expo
            expo.schedule.push(newSchedule._id);
            await expo.save();

            res.json({ message: "Schedule created", schedule: newSchedule, status: true });
        } catch (err) {
            res.json({ message: err.message, status: false });
        }
    },

    // ---------------- UPDATE SCHEDULE ----------------
    updateSchedule: async (req, res) => {
        try {
            const { id } = req.params;
            const updatedData = req.body;

            const schedule = await ScheduleModel.findByIdAndUpdate(id, updatedData, { new: true });
            if (!schedule) return res.json({ message: "Schedule not found", status: false });

            res.json({ message: "Schedule updated", schedule, status: true });
        } catch (err) {
            res.json({ message: err.message, status: false });
        }
    },

    // ---------------- DELETE SCHEDULE ----------------
    deleteSchedule: async (req, res) => {
        try {
            const { id } = req.params;

            const schedule = await ScheduleModel.findById(id);
            if (!schedule) return res.json({ message: "Schedule not found", status: false });

            await ScheduleModel.findByIdAndDelete(id);

            res.json({ message: "Schedule deleted", status: true });
        } catch (err) {
            res.json({ message: err.message, status: false });
        }
    },

    // ---------------- GET SCHEDULES BY EXPO ----------------
    getSchedulesByExpo: async (req, res) => {
        try {
            const { expoId } = req.params;

            const schedules = await ScheduleModel.find({ expo: expoId });

            res.json({ schedules, status: true });
        } catch (err) {
            res.json({ message: err.message, status: false });
        }
    },

    // ---------------- GET SINGLE SCHEDULE ----------------
    getScheduleById: async (req, res) => {
        try {
            const { id } = req.params;

            const schedule = await ScheduleModel.findById(id);
            if (!schedule) return res.json({ message: "Schedule not found", status: false });

            res.json({ schedule, status: true });
        } catch (err) {
            res.json({ message: err.message, status: false });
        }
    }
};

module.exports = ScheduleController;

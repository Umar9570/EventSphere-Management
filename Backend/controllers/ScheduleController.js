const Schedule = require("../models/ScheduleSchema");
const Expo = require("../models/ExpoSchema");

const ScheduleController = {
  // ---------------- GET ALL SESSIONS ----------------
  getAllSchedules: async (req, res) => {
    try {
      const schedule = await Schedule.find()
        .populate("expo", "name")
        .sort({ date: 1, startTime: 1 });

      res.json({ status: true, schedule });
    } catch (err) {
      console.error("Get schedule error:", err);
      res.status(500).json({ status: false, message: "Server error" });
    }
  },

  // ---------------- CREATE SESSION ----------------
  createSchedule: async (req, res) => {
    try {
      const { title, description, expo, date, startTime, endTime } = req.body;

      const expoExists = await Expo.findById(expo);
      if (!expoExists)
        return res.status(404).json({ status: false, message: "Expo not found" });

      const newSession = await Schedule.create({
        title,
        description,
        expo,
        date,
        startTime,
        endTime,
      });

      res.json({ status: true, schedule: newSession });
    } catch (err) {
      console.error("Create schedule error:", err);
      res.status(500).json({ status: false, message: "Server error" });
    }
  },

  // ---------------- UPDATE SESSION ----------------
  updateSchedule: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, expo, date, startTime, endTime } = req.body;

      const session = await Schedule.findById(id);
      if (!session)
        return res.status(404).json({ status: false, message: "Session not found" });

      if (expo) {
        const expoExists = await Expo.findById(expo);
        if (!expoExists)
          return res.status(404).json({ status: false, message: "Expo not found" });
      }

      session.title = title ?? session.title;
      session.description = description ?? session.description;
      session.expo = expo ?? session.expo;
      session.date = date ?? session.date;
      session.startTime = startTime ?? session.startTime;
      session.endTime = endTime ?? session.endTime;

      await session.save();

      res.json({ status: true, schedule: session });
    } catch (err) {
      console.error("Update schedule error:", err);
      res.status(500).json({ status: false, message: "Server error" });
    }
  },

  // ---------------- DELETE SESSION ----------------
  deleteSchedule: async (req, res) => {
    try {
      const { id } = req.params;

      const session = await Schedule.findByIdAndDelete(id);
      if (!session)
        return res.status(404).json({ status: false, message: "Session not found" });

      res.json({ status: true, message: "Session deleted successfully" });
    } catch (err) {
      console.error("Delete schedule error:", err);
      res.status(500).json({ status: false, message: "Server error" });
    }
  },
};

module.exports = ScheduleController;

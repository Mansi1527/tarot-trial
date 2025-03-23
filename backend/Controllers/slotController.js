import express from "express";
import Slot from "../models/slotModels.js" 

// Get all slots
export const getSlots = async (req, res) => {
  try {
    const slots = await Slot.find({});
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: "Error fetching slots", error });
  }
};

// Book a slot
export const bookSlot = async (req, res) => {
  try {
    const { date, time, email } = req.body;

    if (!date || !time || !email) {
      res.status(400).json({ message: "All fields are required" });
      return;
    }

    const existingSlot = await Slot.findOne({ date, time });

    if (existingSlot && existingSlot.bookedBy) {
      res.status(400).json({ message: "Slot already booked" });
      return;
    }

    await Slot.updateOne({ date, time }, { bookedBy: email }, { upsert: true });

    res.json({ message: "Slot booked successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error booking slot", error });
  }
};

// Delete a slot
export const deleteSlot = async (req, res) => {
  try {
    const { date, time } = req.body; // ✅ Change from req.query to req.body

    if (!date || !time) {
      return res.status(400).json({ message: "Date and time are required" });
    }

    const deletedSlot = await Slot.findOneAndDelete({ date, time });

    if (!deletedSlot) {
      return res.status(404).json({ message: "Slot not found" });
    }

    res.json({ message: "Slot deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting slot", error });
  }
};



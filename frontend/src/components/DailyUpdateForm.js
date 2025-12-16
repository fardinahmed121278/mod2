import React, { useState } from "react";
import axios from "axios";

const DailyUpdateForm = ({ onCreated }) => {
  const [child, setChild] = useState("");
  const [attendance, setAttendance] = useState(false);
  const [napStart, setNapStart] = useState("");
  const [napEnd, setNapEnd] = useState("");
  const [meal, setMeal] = useState("");
  const [behaviorNotes, setBehaviorNotes] = useState("");
  const [files, setFiles] = useState([]);
  const [visibility, setVisibility] = useState("both");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newUpdate = {
        child,
        attendance,
        napStart,
        napEnd,
        meal,
        behaviorNotes,
        files,
        visibility,
      };

      await axios.post("http://localhost:5000/api/staff-daily-updates", newUpdate, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      onCreated(); // Re-fetch activities after creation
    } catch (err) {
      console.error("Error saving daily update:", err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h3 className="text-lg font-semibold mb-4">Log Daily Update</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Child</label>
          <input
            type="text"
            value={child}
            onChange={(e) => setChild(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Attendance</label>
          <input
            type="checkbox"
            checked={attendance}
            onChange={() => setAttendance(!attendance)}
          />
        </div>
        <div>
          <label>Nap Start</label>
          <input
            type="time"
            value={napStart}
            onChange={(e) => setNapStart(e.target.value)}
          />
        </div>
        <div>
          <label>Nap End</label>
          <input
            type="time"
            value={napEnd}
            onChange={(e) => setNapEnd(e.target.value)}
          />
        </div>
        <div>
          <label>Meal</label>
          <input
            type="text"
            value={meal}
            onChange={(e) => setMeal(e.target.value)}
          />
        </div>
        <div>
          <label>Behavior Notes</label>
          <textarea
            value={behaviorNotes}
            onChange={(e) => setBehaviorNotes(e.target.value)}
          />
        </div>
        <div>
          <label>Visibility</label>
          <select
            value={visibility}
            onChange={(e) => setVisibility(e.target.value)}
          >
            <option value="admin">Admin</option>
            <option value="parent">Parent</option>
            <option value="both">Both</option>
          </select>
        </div>
        <button type="submit">Log Update</button>
      </form>
    </div>
  );
};

export default DailyUpdateForm;

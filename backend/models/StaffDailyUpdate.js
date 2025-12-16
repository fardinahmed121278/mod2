import React, { useState, useEffect } from "react";
import axios from "axios";

const StaffDailyUpdate = ({ assignedChildren, onCreated }) => {
  const [formData, setFormData] = useState({
    child: "", // Select the child from assigned children
    attendance: false,
    napStart: "",
    napEnd: "",
    meal: "",
    behaviorNotes: "",
    files: [], // Upload files (optional)
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      files: Array.from(e.target.files),
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        "http://localhost:5000/api/daily-updates",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      onCreated(); // Refresh the data (fetch new updates)
      setFormData({
        child: "",
        attendance: false,
        napStart: "",
        napEnd: "",
        meal: "",
        behaviorNotes: "",
        files: [],
      });
    } catch (err) {
      console.error("Error submitting daily update:", err);
    }
  };

  return (
    <div>
      <h2>Log Daily Update</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label>Child</label>
          <select
            name="child"
            value={formData.child}
            onChange={handleChange}
            required
          >
            <option value="">Select a child</option>
            {assignedChildren.map((child) => (
              <option key={child._id} value={child._id}>
                {child.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label>Attendance</label>
          <input
            type="checkbox"
            name="attendance"
            checked={formData.attendance}
            onChange={(e) => setFormData({ ...formData, attendance: e.target.checked })}
          />
        </div>
        <div>
          <label>Nap Start</label>
          <input
            type="time"
            name="napStart"
            value={formData.napStart}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Nap End</label>
          <input
            type="time"
            name="napEnd"
            value={formData.napEnd}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Meal</label>
          <input
            type="text"
            name="meal"
            value={formData.meal}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Behavior Notes</label>
          <textarea
            name="behaviorNotes"
            value={formData.behaviorNotes}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Upload Files (Optional)</label>
          <input
            type="file"
            name="files"
            multiple
            onChange={handleFileChange}
          />
        </div>
        <button type="submit">Log Daily Update</button>
      </form>
    </div>
  );
};

export default StaffDailyUpdate;

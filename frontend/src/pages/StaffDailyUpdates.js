import React, { useState } from "react";
import axios from "axios";

const StaffDailyUpdates = () => {
  const [attendance, setAttendance] = useState(false);
  const [napStart, setNapStart] = useState("");
  const [napEnd, setNapEnd] = useState("");
  const [meal, setMeal] = useState("");
  const [behaviorNotes, setBehaviorNotes] = useState("");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  // Handle file uploads
  const handleFileChange = (e) => {
    setFiles(e.target.files);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    const formData = new FormData();
    formData.append("attendance", attendance);
    formData.append("napStart", napStart);
    formData.append("napEnd", napEnd);
    formData.append("meal", meal);
    formData.append("behaviorNotes", behaviorNotes);

    // Append files to form data
    for (let i = 0; i < files.length; i++) {
      formData.append("files", files[i]);
    }

    try {
      const response = await axios.post("/api/daily-updates", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setStatus({ type: "success", msg: "Daily updates saved successfully!" });
    } catch (err) {
      setStatus({ type: "error", msg: "Failed to save daily updates!" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2 className="text-center">Daily Updates</h2>

      {status && (
        <div
          className={`alert ${
            status.type === "success" ? "alert-success" : "alert-danger"
          }`}
        >
          {status.msg}
        </div>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label>Attendance</label>
          <input
            type="checkbox"
            checked={attendance}
            onChange={() => setAttendance(!attendance)}
          />
        </div>

        <div className="form-group">
          <label>Nap Start Time</label>
          <input
            type="time"
            value={napStart}
            onChange={(e) => setNapStart(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Nap End Time</label>
          <input
            type="time"
            value={napEnd}
            onChange={(e) => setNapEnd(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label>Meal</label>
          <input
            type="text"
            value={meal}
            onChange={(e) => setMeal(e.target.value)}
            placeholder="Meal description"
          />
        </div>

        <div className="form-group">
          <label>Behavior Notes</label>
          <textarea
            value={behaviorNotes}
            onChange={(e) => setBehaviorNotes(e.target.value)}
            placeholder="Notes about the child's behavior"
          />
        </div>

        <div className="form-group">
          <label>Upload Activity Logs (photos, videos, etc.)</label>
          <input type="file" multiple onChange={handleFileChange} />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Daily Update"}
        </button>
      </form>
    </div>
  );
};

export default StaffDailyUpdates;

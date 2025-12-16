import React, { useEffect, useState } from "react";
import {
  UserGroupIcon,
  ClockIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import DailyUpdateForm from "../components/DailyUpdateForm";

const StaffDashboard = () => {
  const { user, logout } = React.useContext(AuthContext);
  const [assignedChildren, setAssignedChildren] = useState([]);
  const [recentActivities, setRecentActivities] = useState([]);
  const [loadingChildren, setLoadingChildren] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(true);

  const token = localStorage.getItem("token");

  // Fetch assigned children for the staff
  const fetchAssignedChildren = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/children/assigned", // Replace with the backend endpoint to fetch assigned children
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setAssignedChildren(res.data.data || []);
    } catch (err) {
      setAssignedChildren([]);
      console.log("Assigned children fetch skipped — endpoint pending.");
    } finally {
      setLoadingChildren(false);
    }
  };

  // Fetch recent staff activities (including daily updates)
  const fetchStaffActivities = async () => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/activities/staff", // Replace with the backend endpoint to fetch staff activities
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRecentActivities(res.data.data || []);
    } catch (err) {
      setRecentActivities([]);
      console.log("Staff activities fetch skipped — endpoint pending.");
    } finally {
      setLoadingActivities(false);
    }
  };

  // Fetch data on page load
  useEffect(() => {
    fetchAssignedChildren();
    fetchStaffActivities();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* NAVBAR */}
      <div className="bg-white shadow fixed w-full top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">Staff Dashboard</h1>
            {user?.staffRole && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                {String(user.staffRole).toUpperCase()}
              </span>
            )}
          </div>
          <button onClick={logout} className="px-4 py-2 rounded-lg bg-gray-900 text-white hover:bg-gray-800">
            Logout
          </button>
        </div>
      </div>

      <div className="pt-24 max-w-7xl mx-auto px-6 pb-12 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column for daily updates */}
        <div className="lg:col-span-2">
          <DailyUpdateForm
            assignedChildren={assignedChildren} 
            onCreated={fetchStaffActivities} 
          /> {/* Use the DailyUpdateForm component for logging */}
        </div>

        {/* RIGHT COLUMN — Assigned Children + Recent Activities */}
        <div className="space-y-8">
          {/* ASSIGNED CHILDREN */}
          <div className="bg-white p-6 rounded-xl shadow border">
            <div className="flex items-center gap-2 mb-4">
              <UserGroupIcon className="h-6 w-6 text-purple-600" />
              <h2 className="text-lg font-semibold">My Assigned Children</h2>
            </div>

            {loadingChildren ? (
              <div className="text-center py-6 text-gray-500">Loading...</div>
            ) : assignedChildren.length === 0 ? (
              <div className="p-6 text-gray-500 bg-gray-50 rounded-lg text-center">
                No assigned children yet.
              </div>
            ) : (
              <ul className="space-y-3">
                {assignedChildren.map((child) => (
                  <li
                    key={child._id}
                    className="p-4 bg-gray-50 rounded-lg flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium">{child.name}</p>
                      <p className="text-sm text-gray-500">
                        Age: {child.age} | Parent: {child.parent?.name}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* RECENT ACTIVITIES (Including daily updates) */}
          <div className="bg-white p-6 rounded-xl shadow border">
            <div className="flex items-center gap-2 mb-4">
              <ClockIcon className="h-6 w-6 text-green-600" />
              <h2 className="text-lg font-semibold">Recent Activities</h2>
            </div>

            {loadingActivities ? (
              <div className="text-center py-6 text-gray-500">Loading...</div>
            ) : recentActivities.length === 0 ? (
              <div className="p-6 text-gray-50 rounded-lg text-gray-500 text-center">
                No recent activity logs yet.
              </div>
            ) : (
              <div className="space-y-4">
                {recentActivities.map((a) => (
                  <div
                    key={a._id}
                    className="bg-gray-50 p-4 rounded-lg border flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold text-gray-800">
                        {a.title || a.activityType}
                      </p>
                      <p className="text-sm text-gray-600">{a.description}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(a.date).toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;

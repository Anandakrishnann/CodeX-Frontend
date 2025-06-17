// StreakTracker.js

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const StreakTracker = () => {
  const [streakView, setStreakView] = useState("daily");
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Sample streak data (replace with actual data from your backend)
  const streakData = {
    currentStreak: 7,
    bestStreak: 21,
    totalDays: 42,
    thisMonth: 12,
    completion: 87,
    lastSevenDays: [
      { day: "M", active: true },
      { day: "T", active: true },
      { day: "W", active: true },
      { day: "T", active: true },
      { day: "F", active: true },
      { day: "S", active: true },
      { day: "S", active: true },
    ],
  };

  const getDaysInMonth = (year, month) =>
    new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();

  const goToPreviousMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() - 1);
    setCurrentMonth(newMonth);
  };

  const goToNextMonth = () => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + 1);
    setCurrentMonth(newMonth);
  };

  const formatMonth = (date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  return (
    <div className="mt-6 text-left">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">Learning Streak</h3>
        <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            className={`px-3 py-1 text-sm font-medium rounded-md ${
              streakView === "daily"
                ? "bg-black text-white"
                : "text-gray-700 hover:bg-gray-200"
            } transition-colors`}
            onClick={() => setStreakView("daily")}
          >
            Daily
          </button>
          <button
            className={`px-3 py-1 text-sm font-medium rounded-md ${
              streakView === "monthly"
                ? "bg-black text-white"
                : "text-gray-700 hover:bg-gray-200"
            } transition-colors`}
            onClick={() => setStreakView("monthly")}
          >
            Monthly
          </button>
        </div>
      </div>

      {/* Daily View */}
      {streakView === "daily" && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center">
              <div className="relative">
                <div className="w-12 h-12 flex items-center justify-center bg-gradient-to-br from-green-400 to-green-600 rounded-full text-white font-bold text-xl shadow-md">
                  {streakData.currentStreak}
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center text-xs font-bold shadow">
                  🔥
                </div>
              </div>
              <div className="ml-3">
                <p className="font-bold text-gray-800">Current Streak</p>
                <p className="text-sm text-gray-600">Keep it going!</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-gray-800">{streakData.bestStreak}</p>
              <p className="text-sm text-gray-600">Best</p>
            </div>
          </div>

          <p className="text-sm font-medium text-gray-700 mb-2">Last 7 Days</p>
          <div className="flex justify-between">
            {streakData.lastSevenDays.map((item, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className="text-xs text-gray-500 mb-1">{item.day}</div>
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    item.active
                      ? "bg-gradient-to-br from-green-400 to-green-600 text-white shadow-sm"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {item.active ? "✓" : ""}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Monthly View */}
      {streakView === "monthly" && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <button
              onClick={goToPreviousMonth}
              className="p-1 rounded-full hover:bg-gray-200 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <p className="text-sm font-medium text-gray-700">
              {formatMonth(currentMonth)}
            </p>
            <button
              onClick={goToNextMonth}
              className="p-1 rounded-full hover:bg-gray-200 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
              <div
                key={i}
                className="text-xs text-center text-gray-500 font-medium py-1"
              >
                {day}
              </div>
            ))}

            {[
              ...Array(
                getFirstDayOfMonth(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth()
                )
              ),
            ].map((_, i) => (
              <div key={`empty-${i}`} className="h-7 rounded-md"></div>
            ))}

            {[
              ...Array(
                getDaysInMonth(
                  currentMonth.getFullYear(),
                  currentMonth.getMonth()
                )
              ),
            ].map((_, i) => {
              const hasActivity = Math.random() > 0.3;
              const today = new Date();
              const isToday =
                today.getDate() === i + 1 &&
                today.getMonth() === currentMonth.getMonth() &&
                today.getFullYear() === currentMonth.getFullYear();

              return (
                <div
                  key={`day-${i + 1}`}
                  className={`h-7 rounded-md flex items-center justify-center text-xs ${
                    isToday
                      ? "bg-black text-white font-bold ring-2 ring-offset-1 ring-black"
                      : hasActivity
                      ? "bg-gradient-to-br from-green-400 to-green-600 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {i + 1}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-500">Total Days</p>
            <p className="font-bold text-gray-800">{streakData.totalDays}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-500">This Month</p>
            <p className="font-bold text-gray-800">{streakData.thisMonth}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <p className="text-xs text-gray-500">Completion</p>
            <p className="font-bold text-gray-800">{streakData.completion}%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StreakTracker;

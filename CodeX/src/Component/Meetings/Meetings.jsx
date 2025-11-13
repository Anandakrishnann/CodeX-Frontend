"use client";

import { useEffect, useState } from "react";
import { Calendar, Clock, Users, X, Edit, Trash2 } from "lucide-react";
import { useSelector } from "react-redux";
import { tutorAxios, userAxios } from "../../../axiosConfig";
import { toast } from "react-toastify";
import { XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

export default function TutorMeeting() {
  const [activeTab, setActiveTab] = useState("your-meetings");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [limit, setLimit] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editLimit, setEditLimit] = useState("");
  const [openModal, setOpenModal] = useState(false);
  const [openEditModal, setOpenEditModal] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [scheduledMeetings, setSheduledMeetings] = useState([]);
  const [availableMeetings, setAvailableMeetings] = useState([]);
  const [userBookedMeetings, setUserBookedMeetings] = useState([]);
  const [recentMeetings, setRecentMeetings] = useState([]);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const role = useSelector((state) => state.user.role);
  const user = useSelector((state) => state.user.user);
  const today = new Date().toISOString().split("T")[0];
  const navigate = useNavigate();
  const location = window.location.href;

  useEffect(() => {
    if (role === "tutor") {
      tutorSheduledMeetings();
      tutorRecentMeetings();
      tutorSubscribed();
    } else if (role === "user") {
      userAvailableMeetings();
      userBookedMeetingFetch();
      userRecentMeetings();
    }
  }, [role]);

  const tutorSubscribed = async () => {
    try {
      const response = await tutorAxios.get("tutor_subscribed/");
      if (response.data.subscribed) {
        setIsSubscribed(true);
      } else {
        setIsSubscribed(false);
      }
    } catch (error) {
      setIsSubscribed(false);
    }
  };

  const userAvailableMeetings = async () => {
    try {
      const response = await userAxios.get("available-meetings/");
      setAvailableMeetings(response.data);
    } catch (error) {}
  };

  const userBookedMeetingFetch = async () => {
    try {
      const response = await userAxios.get("booked-meetings/");
      setUserBookedMeetings(response.data);
    } catch (error) {}
  };

  const userRecentMeetings = async () => {
    try {
      const response = await userAxios.get("recent-meetings/");
      setRecentMeetings(response.data);
    } catch (error) {}
  };

  const tutorRecentMeetings = async () => {
    try {
      const response = await tutorAxios.get("recent-meetings/");
      setRecentMeetings(response.data);
    } catch (error) {}
  };

  const tutorSheduledMeetings = async () => {
    try {
      const response = await tutorAxios.get("sheduled-meetings/");
      setSheduledMeetings(response.data);
    } catch (error) {}
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setModalData(null);
  };

  const handleCreateMeeting = async () => {
    if (!selectedDate || !selectedTime || !limit) {
      toast.error("Please fill in all fields");
      return;
    }

    const selectedDateTime = new Date(`${selectedDate}T${selectedTime}`);
    const currentTime = new Date();
    const diffInMinutes = (selectedDateTime - currentTime) / (1000 * 60);

    if (diffInMinutes < 15) {
      toast.error("Meeting time must be at least 30 minutes from now");
      return;
    }

    try {
      await tutorAxios.post("shedule-meeting/", {
        date: selectedDate,
        time: selectedTime,
        limit: parseInt(limit),
      });
      toast.success("Meeting created successfully!");
      setSelectedDate("");
      setSelectedTime("");
      setLimit("");
      tutorSheduledMeetings();
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          "Something went wrong while creating the meeting"
      );
    }
  };

  const getMeetingsToDisplay = () => {
    if (activeTab === "your-meetings") {
      return role === "tutor" ? scheduledMeetings : userBookedMeetings;
    } else if (activeTab === "schedule" && role === "user") {
      return availableMeetings;
    } else if (activeTab === "recent-meetings") {
      return recentMeetings;
    }
    return [];
  };

  const handleBook = (meeting) => {
    setModalData(meeting);
    setOpenModal(true);
  };

  const handleBooking = async (meetId) => {
    try {
      await userAxios.post("book-meeting/", {
        meeting_id: meetId,
      });
      toast.success("Meeting Slot Booked Successfully");
      userAvailableMeetings();
      userBookedMeetingFetch();
      handleCloseModal();
    } catch (error) {}
  };

  const handleEditChange = async (meeting_id) => {
    try {
      await tutorAxios.post("edit-meeting/", {
        meeting_id: meeting_id,
        date: editDate,
        time: editTime,
        limit: parseInt(editLimit),
      });
      toast.success("Meeting Edited successfully!");
      setEditDate("");
      setEditTime("");
      setEditLimit("");
      tutorSheduledMeetings();
    } catch (error) {
      toast.error(
        error.response?.data?.error ||
          "Something went wrong while Edited the meeting"
      );
    }
  };

  const handleDeleteChange = async (meeting_id) => {
    const result = await Swal.fire({
      title: "Delete Meeting?",
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await tutorAxios.post("delete-meeting/", { meeting_id });
      Swal.fire("Deleted!", "The meeting has been deleted.", "success");
      tutorSheduledMeetings();
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.error ||
          "Something went wrong while deleting the meeting",
        "error"
      );
    }
  };

  const handleJoinMeeting = (meetId) => {
    navigate(`/room/${meetId}/${user.id}/${user.first_name}`);
  };

  return (
    <div className="min-h-screen p-6 relative z-10">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-6xl font-bold text-white mb-2">Meeting's</h1>
          <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
        </div>

        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-xl p-2 shadow-lg border border-gray-200">
            {["your-meetings", "schedule", "recent-meetings"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-blue-600 text-white shadow-md"
                    : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                }`}
              >
                {tab.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
              </button>
            ))}
          </div>
        </div>

        {(activeTab !== "schedule" || role !== "tutor") && (
          <>
            {getMeetingsToDisplay().length === 0 ? (
              <div className="text-center text-gray-600 font-medium py-12">
                {activeTab === "schedule"
                  ? "No available meetings to schedule."
                  : activeTab === "your-meetings"
                  ? "You have not booked any meetings yet."
                  : "No recent meetings found."}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {getMeetingsToDisplay().map((meeting) => {
                  const meetingDateTime = new Date(
                    `${meeting.date}T${meeting.time}`
                  );
                  const isJoinEnabled = new Date() >= meetingDateTime;

                  return (
                    <div
                      key={meeting.id}
                      className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
                    >
                      <div className="p-6 border-b border-gray-100">
                        <h3 className="text-lg font-bold text-gray-900 mb-1">
                          {meeting.tutor_name || meeting.name || "Tutor"}
                        </h3>
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${
                            meeting.left === 0
                              ? "bg-gray-100 text-gray-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {meeting.left === meeting.limit
                            ? "Full"
                            : `${meeting.left} spots left`}
                        </span>
                      </div>

                      <div className="p-6 space-y-4">
                        <div className="flex items-center text-gray-600">
                          <Calendar className="w-4 h-4 mr-3 text-blue-600" />
                          <span className="text-sm">
                            {new Date(meeting.date).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-center text-gray-600">
                          <Clock className="w-4 h-4 mr-3 text-blue-600" />
                          <span className="text-sm">{meeting.time}</span>
                        </div>

                        <div className="flex items-center text-gray-600">
                          <Users className="w-4 h-4 mr-3 text-blue-600" />
                          <span className="text-sm">
                            {meeting.left}/{meeting.limit} participants
                          </span>
                        </div>
                      </div>

                      <div className="p-6 pt-0">
                        {role === "tutor" && activeTab === "your-meetings" ? (
                          (() => {
                            const meetingDateTime = new Date(
                              `${meeting.date}T${meeting.time}`
                            );
                            const currentTime = new Date();

                            const diffInMs = meetingDateTime - currentTime;
                            const diffInMinutes = diffInMs / (1000 * 60);

                            const tutorCanJoin =
                              diffInMinutes <= 5 && diffInMinutes >= -120;
                            // tutor can join 5 min before until 2 hrs after (safety)

                            const showEditDelete = diffInMinutes > 5;
                            // edit & delete only before 5 mins

                            return (
                              <>
                                {showEditDelete ? (
                                  <div className="flex gap-2">
                                    <button
                                      onClick={() => {
                                        setEditDate(meeting.date);
                                        setEditTime(meeting.time);
                                        setEditLimit(meeting.limit);
                                        setModalData(meeting);
                                        setOpenEditModal(true);
                                      }}
                                      className="flex-1 border-2 border-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:border-blue-600 hover:text-blue-600 flex justify-center"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>

                                    <button
                                      onClick={() =>
                                        handleDeleteChange(meeting.id)
                                      }
                                      className="flex-1 border-2 border-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:border-red-500 hover:text-red-500 flex justify-center"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() =>
                                      handleJoinMeeting(meeting.id)
                                    }
                                    className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg font-medium"
                                  >
                                    Join Meeting
                                  </button>
                                )}
                              </>
                            );
                          })()
                        ) : (
                          <>
                            {activeTab === "schedule" &&
                              (meeting.left <= meeting.limit ? (
                                <button
                                  onClick={() => handleBook(meeting)}
                                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium"
                                >
                                  Book Meeting
                                </button>
                              ) : (
                                <div className="w-full bg-red-100 text-red-700 py-3 px-4 rounded-lg text-center font-medium flex items-center justify-center gap-2">
                                  <XCircle className="w-5 h-5" />
                                  Fully Booked
                                </div>
                              ))}

                            {activeTab === "your-meetings" &&
                              role === "user" &&
                              (() => {
                                const meetingDateTime = new Date(
                                  `${meeting.date}T${meeting.time}`
                                );
                                const currentTime = new Date();
                                const userCanJoin =
                                  currentTime >= meetingDateTime;

                                return (
                                  <button
                                    className={`w-full py-3 px-4 rounded-lg font-medium transition ${
                                      userCanJoin
                                        ? "bg-green-600 hover:bg-green-700 text-white"
                                        : "bg-gray-300 text-gray-600"
                                    }`}
                                    disabled={!userCanJoin}
                                    onClick={() =>
                                      handleJoinMeeting(meeting.id)
                                    }
                                  >
                                    Join Meeting
                                  </button>
                                );
                              })()}
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {activeTab === "schedule" &&
          role === "tutor" &&
          isSubscribed === true &&
          location !== "http://localhost:3000/user/meet" && (
            <div className="max-w-2xl mx-auto">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8">
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-6">
                  Create New Meeting
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block mb-1 font-semibold text-sm">
                      Meeting Date
                    </label>
                    <input
                      type="date"
                      min={today}
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-sm">
                      Meeting Time
                    </label>
                    <input
                      type="time"
                      value={selectedTime}
                      onChange={(e) => setSelectedTime(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-600"
                    />
                  </div>

                  <div>
                    <label className="block mb-1 font-semibold text-sm">
                      Participant Limit
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={limit}
                      onChange={(e) => setLimit(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-blue-600"
                    />
                  </div>

                  <div className="flex gap-4 mt-6">
                    <button
                      onClick={handleCreateMeeting}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
                    >
                      Create Meeting
                    </button>

                    <button
                      onClick={() => {
                        setSelectedDate("");
                        setSelectedTime("");
                        setLimit("");
                      }}
                      className="flex-1 border-2 border-gray-200 text-gray-700 px-6 py-3 rounded-lg font-semibold"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

        {openModal && modalData && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md border border-gray-200 overflow-hidden">
              <div className="p-6 border-b relative">
                <button
                  onClick={handleCloseModal}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-bold">Confirm Booking</h2>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-gray-500">Tutor:</span>
                  <span>{modalData.tutor_name}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-gray-500">Date:</span>
                  <span>{new Date(modalData.date).toLocaleDateString()}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-gray-500">Time:</span>
                  <span>{modalData.time}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-gray-500">Spots:</span>
                  <span>
                    {modalData.left}/{modalData.limit}
                  </span>
                </div>
              </div>

              <div className="p-6 pt-0 flex gap-3">
                <button
                  onClick={() => handleBooking(modalData.id)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
                >
                  Confirm Booking
                </button>

                <button
                  onClick={handleCloseModal}
                  className="border-2 border-gray-200 text-gray-700 py-3 px-6 rounded-lg font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {openEditModal && modalData && (
          <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
              <div className="p-6 border-b flex justify-between items-center">
                <h2 className="text-xl font-bold">Edit Meeting</h2>
                <button
                  onClick={() => setOpenEditModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium">Date</label>
                  <input
                    type="date"
                    value={editDate}
                    onChange={(e) => setEditDate(e.target.value)}
                    min={today}
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Time</label>
                  <input
                    type="time"
                    value={editTime}
                    onChange={(e) => setEditTime(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium">Limit</label>
                  <input
                    type="number"
                    value={editLimit}
                    onChange={(e) => setEditLimit(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg p-2"
                  />
                </div>
              </div>

              <div className="p-6 flex gap-3">
                <button
                  onClick={() => {
                    handleEditChange(modalData.id);
                    setOpenEditModal(false);
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold"
                >
                  Save Changes
                </button>

                <button
                  onClick={() => setOpenEditModal(false)}
                  className="border border-gray-300 py-3 px-6 rounded-lg font-semibold"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

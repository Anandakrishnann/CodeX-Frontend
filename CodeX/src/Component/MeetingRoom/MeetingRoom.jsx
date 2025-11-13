import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

export default function MeetingRoom() {
  const containerRef = useRef(null);
  const { roomID, userID, userName } = useParams();
  const zegoRef = useRef(null);

  useEffect(() => {
    if (!roomID || !userID || !userName || !containerRef.current) return;

    const appID = Number(import.meta.env.VITE_ZEGOCLOUD_APP_ID);
    const serverSecret = import.meta.env.VITE_ZEGOCLOUD_SERVER_SECRET;

    if (!appID || !serverSecret) {
      console.error("❌ Zego AppID or ServerSecret missing in .env");
      return;
    }

    // Prevent re-join if already joined
    if (zegoRef.current) return;

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appID,
      serverSecret,
      String(roomID),
      String(userID),
      userName || "Guest"
    );

    const zp = ZegoUIKitPrebuilt.create(kitToken);
    zegoRef.current = zp;

    zp.joinRoom({
      container: containerRef.current,
      sharedLinks: [
        {
          name: "Copy Link",
          url: `${window.location.origin}/meeting/${roomID}/${userID}/${encodeURIComponent(userName)}`,
        },
      ],
      scenario: { mode: ZegoUIKitPrebuilt.OneONoneCall },
      showScreenSharingButton: true,
      showTextChat: true,
      showPreJoinView: false,
    });

    // ✅ Clean up when unmounted
    return () => {
      if (zegoRef.current) {
        zegoRef.current.destroy();
        zegoRef.current = null;
      }
    };
  }, [roomID, userID, userName]);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div
        ref={containerRef}
        style={{ width: "100%", height: "100%", borderRadius: "10px", overflow: "hidden" }}
      />
    </div>
  );
}

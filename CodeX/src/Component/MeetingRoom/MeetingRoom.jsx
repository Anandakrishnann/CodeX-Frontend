import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

export default function MeetingRoom() {
  const containerRef = useRef(null);
  const { roomID, userID, userName } = useParams();

  useEffect(() => {
    const initMeeting = async () => {
      if (!roomID || !userID || !userName || !containerRef.current) {
        console.warn("Missing meeting params");
        return;
      }

      const appID = Number(import.meta.env.VITE_ZEGOCLOUD_APP_ID);
      const serverSecret = import.meta.env.VITE_ZEGOCLOUD_SERVER_SECRET;

      if (!appID || !serverSecret) {
        console.error("Zego AppID or ServerSecret is missing in .env");
        return;
      }

      const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
        appID,
        serverSecret,
        roomID,
        userID.toString(),
        userName
      );

      const zp = ZegoUIKitPrebuilt.create(kitToken);
      zp.joinRoom({
        container: containerRef.current,
        sharedLinks: [
          {
            name: "Copy Link",
            url: window.location.href,
          },
        ],
        scenario: {
          mode: ZegoUIKitPrebuilt.OneONoneCall,
        },
        showScreenSharingButton: true,
        showTextChat: true,
        showPreJoinView: false,
      });
    };

    initMeeting();
  }, [roomID, userID, userName]);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-100">
      <div ref={containerRef} style={{ width: "100%", height: "100%" }} />
    </div>
  );
}

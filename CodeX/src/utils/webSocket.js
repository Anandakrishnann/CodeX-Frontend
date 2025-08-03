export function createChatSocket(roomId, onMessage) {
    const socket = new WebSocket(`${import.meta.env.VITE_API_WEBSOCKET_URL}${roomId}/`);

    socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        onMessage(data.message);
    };

    socket.onopen = () => {
        console.log("WebSocket connected");
    };

    socket.onclose = () => {
        console.log("WebSocket disconnected");
    };

    return socket;
}

import { useEffect } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const useWebSocket = (onEvent) => {
  useEffect(() => {
    const socket = new SockJS("http://localhost:8080/ws");

    const stompClient = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        stompClient.subscribe("/topic/glasanje", (message) => {
          const data = JSON.parse(message.body);
          console.log("Primljeno preko WebSocketa:", data);
          if (onEvent) onEvent(data);
        });
      },
      debug: () => {},
    });

    stompClient.activate();

    return () => {
      stompClient.deactivate();
    };
  }, [onEvent]);
};

export default useWebSocket;

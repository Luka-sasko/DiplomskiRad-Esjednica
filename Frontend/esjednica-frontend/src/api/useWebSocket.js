import { useEffect } from 'react';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const useWebSocket = (onGlasanjeStart) => {
  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe('/topic/glasanje', (message) => {
          const data = JSON.parse(message.body);
          onGlasanjeStart(data);
        });
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [onGlasanjeStart]);
};

export default useWebSocket;

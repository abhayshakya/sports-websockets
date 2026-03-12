import { WebSocket, WebSocketServer } from "ws";
import { wsArcjet } from "../arcjet.js";

function sendJson(socket, payload) {
    if(socket.readyState !== WebSocket.OPEN)
        return;
    socket.send(JSON.stringify(payload));
}

function broadCast(wss, payload) {
    const message = JSON.stringify(payload)

    for (const client of wss.clients) {
        if (client.readyState !== WebSocket.OPEN) continue;
        client.send(message);
    }
}

export function attachWebSocketServer(server) {
    const wss = new WebSocketServer({ noServer: true, path: '/ws', maxPayload: 1024 * 1024 });

    server.on('upgrade', async (req, socket, head) => {
        const { pathname } = new URL(req.url, `http://${req.headers.host}`);

        if (pathname !== '/ws') {
            return;
        }

        if (wsArcjet) {
            try {
                const decision = await wsArcjet.protect(req);

                if (decision.isDenied()) {
                    if (decision.reason.isRateLimit()) {
                        socket.write('HTTP/1.1 429 Too Many Requests\r\n\r\n');
                    } else {
                        socket.write('HTTP/1.1 403 Forbidden\r\n\r\n');
                    }
                    socket.destroy();
                    return;
                }
            } catch (e) {
                console.error('WS upgrade protection error', e);
                socket.write('HTTP/1.1 500 Internal Server Error\r\n\r\n');
                socket.destroy();
                return;
            }
        }
        sendJson(socket, { type: 'Welcome' });
        socket.on('error', console.error);
    });

    function broadcastMatchCreated(match) {
        broadCast(wss, { type: 'match_created', data: match });
    }

    return { broadcastMatchCreated };
}
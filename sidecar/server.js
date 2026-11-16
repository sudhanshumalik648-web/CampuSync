/**
 * CampusSync - Lightweight Real-Time WebSocket Sidecar Server (Socket.io)
 * Receives webhook events from PHP backend or frontend actions and broadcasts real-time updates.
 */

const http = require('http');
const express = require('express');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

const PORT = process.env.PORT || 3001;

// Keep track of connected faculty clients
let connectedClients = 0;

io.on('connection', (socket) => {
    connectedClients++;
    console.log(`[Socket.io] New faculty connected: ${socket.id} (Total active: ${connectedClients})`);

    // Faculty joining a specific board room
    socket.on('join_board', (boardId) => {
        socket.join(`board_${boardId}`);
        console.log(`[Socket.io] Socket ${socket.id} joined room board_${boardId}`);
    });

    // Handle task move event broadcast
    socket.on('task_move', (payload) => {
        console.log(`[Socket.io] Task moved by faculty:`, payload);
        socket.to(`board_${payload.boardId || 1}`).emit('board_updated', {
            type: 'TASK_MOVED',
            taskId: payload.taskId,
            columnId: payload.columnId,
            movedBy: payload.movedBy,
            timestamp: new Date().toISOString()
        });
    });

    // Handle new proposal broadcast
    socket.on('task_created', (payload) => {
        console.log(`[Socket.io] New task created:`, payload);
        socket.to(`board_${payload.boardId || 1}`).emit('board_updated', {
            type: 'TASK_CREATED',
            task: payload.task,
            timestamp: new Date().toISOString()
        });
    });

    socket.on('disconnect', () => {
        connectedClients--;
        console.log(`[Socket.io] Faculty disconnected: ${socket.id} (Total active: ${connectedClients})`);
    });
});

// HTTP Webhook Endpoint for PHP Backend trigger
app.post('/webhook/notify', (req, res) => {
    const { board_id, event_type, data } = req.body;
    io.to(`board_${board_id || 1}`).emit('board_updated', {
        type: event_type || 'GENERAL_UPDATE',
        data,
        timestamp: new Date().toISOString()
    });
    res.json({ success: true, broadcasted_to: `board_${board_id || 1}` });
});

server.listen(PORT, () => {
    console.log(`[CampusSync Real-Time Sidecar] Listening on port ${PORT}`);
    console.log(` - Socket.io endpoint: ws://localhost:${PORT}`);
    console.log(` - HTTP Webhook endpoint: http://localhost:${PORT}/webhook/notify`);
});

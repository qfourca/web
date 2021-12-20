const webSocket = require('ws');

module.exports = (server) => {
    const wss = new webSocket.Server({ server });

    wss.on('connection', (ws, req) => {
        const ip = req.headers['x-forwarded-for'] || req.ip;
        console.log('client 접속 : ', ip);

        ws.on('message', (message) => {
            console.log('수신 : ', message);

            if (ws.readyState === ws.OPEN) {
                ws.send('발신 : server to client');
            }
        });

        ws.on('close', () => {
            console.log('clenet 해제 : ', ip);
        });

        ws.on('error', (error) => {
            console.error(error);
        });
    });
};
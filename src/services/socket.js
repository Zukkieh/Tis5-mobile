import Ws from '@drayber/adonis-websocket-client';

export const connect = (token) => {
    let connected = false
    const ws = Ws('wss://tis5-backend.herokuapp.com'
    , {
        reconnection: false,
        reconnectionAttempts: 0
    }
    ).withApiToken(token).connect();

    ws.on('open', (open) => {
        connected = true;
    })

    ws.on('close', () => {
        connected = false;
    })

    return ws.subscribe('scheduling');
}


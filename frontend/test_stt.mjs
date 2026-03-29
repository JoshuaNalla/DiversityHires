import { Scribe, RealtimeEvents } from '@elevenlabs/client';
const connection = Scribe.connect({
    token: "a089f8dce52620edebfd60620c24636e9db9400a8528dbf274b26db9665135aa",
    modelId: "scribe_v1",
    sampleRate: 16000
    // microphone is mocked or we just don't pass audioFormat to see if it connects
});
connection.on(RealtimeEvents.ERROR, (err) => console.log('ERROR:', err));
connection.on(RealtimeEvents.SESSION_STARTED, () => console.log('SUCCESS scribe_v1!'));
connection.on(RealtimeEvents.CLOSE, () => console.log('CLOSED'));

const connection2 = Scribe.connect({
    token: "a089f8dce52620edebfd60620c24636e9db9400a8528dbf274b26db9665135aa",
    modelId: "scribe_v2_realtime",
    sampleRate: 16000
});
connection2.on(RealtimeEvents.ERROR, (err) => console.log('ERROR2:', err));
connection2.on(RealtimeEvents.SESSION_STARTED, () => console.log('SUCCESS scribe_v2_realtime!'));

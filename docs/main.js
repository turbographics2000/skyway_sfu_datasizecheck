const myId = (new MediaStream).id;
console.log(`myId:${myId}`);
let stream = null;
const skywayApiKey = 'bea1e09a-a7f9-41fb-8700-e6d18ba907bd';
const roomName = 'hoge_fuga_piyo_sfu';
function appendVideo(stream) {
    const video = document.createElement('video');
    video.srcObject = stream;
    document.body.appendChild(video);
    video.play();
}
const constraints = {
    video: true
};
navigator.mediaDevices.getUserMedia(constraints).then(stream => {
    console.log(`streamId:${stream.id}`);
    appendVideo(stream);
    const peer = new Peer(myId, {
        key: skywayApiKey 
    });
    peer.on('open', id => {
        myIdDisp.textContent = id;
        const room = peer.joinRoom(roomName, { mode: 'sfu', stream, videoBandwidth: 2048 });
        room.on('open', peerId => {
            const dummyPeer = new Peer({ key: skywayApiKey });
            dummyPeer.on('open', _ => {
                const dummyRoom = dummyPeer.joinRoom(roomName, { mode: 'sfu' });
                dummyRoom.on('open', _ => dummyRoom.close());
                dummyRoom.on('close', _ => dummyPeer.destroy());
            });
            dummyPeer.on('error', err => console.error(err));
        });
        room.on('stream', stream => {
            console.log(`room on stream peerId:${stream.peerId}`);
            appendVideo(stream);
        });
    });
}).catch(err => {
    console.error(err);
});

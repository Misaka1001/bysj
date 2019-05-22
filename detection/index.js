var socket = new WebSocket('ws://localhost:8081/msg');
socket.addEventListener('open', function () {
    console.log('websocket is open')
});
socket.addEventListener('close', function () {
    console.log('websocket is close')
});

//调用麦克风 获得频谱
window.AudioContext = window.AudioContext || window.webkitAudioContext;
var audioContext = new AudioContext();
var inputPoint = null, zeroGain = null, analyserNode;
var str = ""
var data = [];
function updateWave() {
    var freqByteData = new Uint8Array(analyserNode.frequencyBinCount);
    analyserNode.getByteFrequencyData(freqByteData);
    console.log(freqByteData)
    var multiplier = analyserNode.frequencyBinCount;
    var sum = freqByteData.reduce((prev, curr) => {
        return prev + curr * curr;
    }, 0)
    var A1 = Math.sqrt(sum / multiplier);
    if (A1 < 1) {
        A1 = 1;
    }
    var A0 = 1;
    var Lp = parseInt(20 * Math.log10(A1 / A0)) + 20    ;
    $('#arrlist span:nth-child(2)').html(Lp);
    data.push(Lp);
    if (data.length === 10) {
        Lp = Math.max(...data);
        console.log(Lp);
        socket.send(JSON.stringify({
            Lp,
            time: Date.now()
        }))
        data.length = 0;
    }
    //websocket发送数据
}

var handleSuccess = function (stream) {
    var audioContext = new AudioContext();
    inputPoint = audioContext.createGain();
    var realAudioInput = audioContext.createMediaStreamSource(stream);
    realAudioInput.connect(inputPoint);
    analyserNode = audioContext.createAnalyser();
    analyserNode.fftSize = 128;
    inputPoint.connect(analyserNode);
    setInterval(updateWave, 100)
};
navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then(handleSuccess);


var canvas = document.getElementById("canvas"),
    context = canvas.getContext("2d"),
    video = document.getElementById("video");

var constraints = { audio: false, video: { width: 720, height: 720 } }
navigator.mediaDevices.getUserMedia(constraints)
    .then(function (stream) {
        var video = document.querySelector('video');
        video.srcObject = stream;
        video.onloadedmetadata = function (e) {
            video.play();
        };
    })
    .catch(function (err) {
        console.log(err.name + ": " + err.message);
    });

var socket2 = new WebSocket('ws://localhost:8081/lux');
socket2.addEventListener('open', function () {
    console.log('websocket is open')
});
socket2.addEventListener('close', function () {
    console.log('websocket is close')
});
//获取亮度
function getLuminance() {
    context.drawImage(video, 0, 0, 50, 50);
    var data = [];
    var resultY = [];
    for (var i = 0; i < 50; i += 5) {
        for (var j = 0; j < 50; j += 5) {
            var imageData = [...context.getImageData(i, j, 1, 1).data];
            imageData.pop()
            data.push(imageData)
        }
    }
    // Y(亮度)=(0.299*R)+(0.587*G)+(0.114*B)
    data.map(item => {
        var Y = (0.299 * item[0]) + (0.587 * item[1]) + (0.114 * item[2]);
        resultY.push(Y)
    })
    var result = resultY.reduce((prev, curr) => {
        return prev + curr
    }, 0) / 100;
    socket2.send(JSON.stringify({
        luminance: parseInt(result),
        time: Date.now()
    }))
    $('#luminance span:nth-child(2)').html(parseInt(result))
}

setInterval(getLuminance, 1000)
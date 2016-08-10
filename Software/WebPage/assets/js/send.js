var sendback;

var checkdata = function() {
    sendback = "";
    if (data[0] > 1.3 * DB['avg'] || data[0] < 0.7 * DB['avg']) {
        sendback += '1'
    } else {
        sendback += '0'
    }
    if (true) {
        sendback += '1'
    } else {
        sendback += '0'
    }
    if (data[2] > 35 || | data[2] < 20) {
        sendback += '1'
    } else {
        sendback += '0'
    }
    if (data[3] > 350 || data[3] < 300) {
        sendback += '1'
    } else {
        sendback += '0'
    }
    senddata(sendback);
}




setInterval(function() {
    recdata()
}, 2000);

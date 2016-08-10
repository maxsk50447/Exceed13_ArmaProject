function rankHr(HR) {
//    console.log(HR);
    if (HR > DB['avg'] * 1.4) {
        $('#hrBlock').addClass('animated infinite flash');
        //$('#hrBlock').addClass('changeToRed');
        $('#hrBlock').css('color', '#fb6d6d');
    } else if (HR <= DB['avg'] * 1.4 && HR >= DB['avg'] * 0.65) {
        $('#hrBlock').removeClass('animated infinite flash');
        // $('#hrBlock').addClass('changeToYellow');
        $('#hrBlock').css('color', '#ffe98a');
    } else if (HR > 0) {
        $('#hrBlock').removeClass('animated infinite flash');
        // $('#hrBlock').addClass('changeToGreen');
        $('#hrBlock').css('color', '#96ec99');
    } else {
        $('#hrBlock').removeClass('animated infinite flash');
        $('#hrBlock').css('color', '#FFFFFF');
    }
}

function rankLpg(lpgR) {
    //  lpgR = 41;
    if (lpgR > 40) {
        $('#lpgBlock').addClass('animated infinite flash');
        $('#lpgBlock').css('color','#fb6d6d');
    } else if (lpgR <= 40 && lpgR >= 20) {
        $('#lpgBlock').removeClass('animated infinite flash');
        $('#lpgBlock').css('color','#ffe98a');
    } else if (lpgR > 0) {
        $('#lpgBlock').removeClass('animated infinite flash');
        $('#lpgBlock').css('color','#96ec99');
    }
}

function rankFall(falling) {
  if (falling > 335) {
    console.log(falling);
    $('#fallBlock').addClass('animated infinite flash');
    // $('#fallBlock').addClass('changeToRed');
    $('#fallBlock').css('color', '#fb6d6d');
  } else {
    $('#fallBlock').removeClass('animated infinite flash');
    // $('#fallBlock').addClass('changeToWhite');
    $('#fallBlock').css('color', '#FFFFFF');
  }

}


window.onload = function() {
    var chart = new CanvasJS.Chart("graph", {
        title: {
            text: "Heart Rate 15 Min",
            fontColor: "white",
            fontFamily: "Roboto"
        },
        zoomEnabled: true,
        backgroundColor: "rgba(0, 0, 0, 0.4)",
        color: "white",
        axisX: {
            labelFontColor: "white",
            labelFontSize: 10

        },
        axisY: {
            minimum: 30,
            maximum: 150
        },
        axisX: {
            minimum: new Date(new Date() - 1000 * 60 * 15),
            maximum: new Date()
        },

        data: data
    });
    chart.render()

    setInterval(function() {
        recdata()
        var d = new Date()
        rankLpg(data[1]);
        if (data[0] > 30&&data[0]<240) {
            ana.setHR(data[0])
            chart.options.data[0].dataPoints.push({
                x: new Date(),
                y: data[0]
            });
            chart.options.axisX = {
                minimum: new Date(d - 1000 * 60 * 15),
                maximum: d
            }
        }
        $('#heartRate').html(Math.floor(data[0]));
        $('#temperature').html(data[2])
        DB['avg'] = math.mean(DB['HHR'].map(getSecondItem));

        rankHr(data[0]);
        rankLpg(data[1]);
        rankFall(data[3]);




    }, 1000);

}

var y = 0;
var limit = 20;
var data = [];
var dataSeries = {
    type: "line"
};

function setToChartOptionFormat(item) {
    var dt;
    if (typeof item[0] == 'string') {
        dt = new Date(item[0]);
    } else dt = item[0]
    return {
        x: dt,
        y: item[1]
    }
}

function getSecondItem(item) {

    return item[1]

}
// nguangwoi = [DB['HWC'][0][0], math.mean(DB['HWC'].map(getSecondItem))]
// nguangsus = [DB['HHR'][0][0], math.mean(DB['HHR'].map(getSecondItem))]

dataSeries.dataPoints = DB['HHR'].map(setToChartOptionFormat)


data.push(dataSeries);
var hisGen = function() {
    console.log('hisgen');
    genHistory();
    $('#infobody').html('');

    function setToHTMLFormat(i) {
        return '<tr><td>'+i[0].getFullYear()+'-'+(i[0].getMonth()+1)+'-'+i[0].getDate()+'</td><td> ' +  i[0].getHours()+ ':00 </td><td> ' + Math.floor(i[1]) +' bpm</td><td>' + Math.floor(i[2]) + ' bpm</td><td>' + Math.floor(i[3]) + ' bpm</td></tr>'
    }
    $('#infobody').append(DB['HIS'].map(setToHTMLFormat).join(' '));
}
hisGen();
setInterval(hisGen, 60000);

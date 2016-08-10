var DB = (localStorage.getItem('DB') == null) ? {} : JSON.parse(localStorage.getItem('DB'));
console.log(DB);
var notEmpty = function(a) {
    for (j in a) {
        return true;
    }
    return false;
}
var getValue = function(a) {
    return a[1];
}

setInterval(function()
{
    localStorage.setItem('DB',JSON.stringify(DB));
},10000);

var HR = function() {
    this.setHWC = function(item) {

        if (DB['HWC'] == null) {
            DB['HWC'] = []
        } else if (notEmpty(DB['HWC'])) {

            try {
                while (item[0].getTime() - DB['HWC'][0][0].getTime() > 600000) {
                    var temp = new Date(DB['HWC'][0][0].getTime() + 300000)

                    function getSecond(e) {
                        return e[1]
                    }
                    DB['HLP'].push([temp, DB['avgHWC'], math.max(DB['HWC'].map(getSecond))])

                    DB['HWC'] = [];

                }
            } catch (e) {

            }
        }

        DB['HWC'].push(item);

        DB['avgHWC'] = math.mean(DB['HWC'].map(getValue));
    }
    this.setHHR = function(d, hr) {
        if (DB['HHR'] == null) {
            DB['HHR'] = []
        } else if (notEmpty(DB['HHR'])) {
              while (new Date(d) - new Date(DB['HHR'][0][0]) > 1000 * 60 ) {
                this.setHWC(DB['HHR'].shift());
            }
        }
        DB['HHR'].push([d, hr]);
    }
    this.setHDay = function(d, hr) {
        if (DB['HDay'] == null || typeof DB['HDay'] == 'undefined') {
            DB['HDay'] = []
        }
        DB['HDay'].push([d, hr]);
        if (typeof DB['HDay'][0][0] == 'string') {
            DB['HDay'][0][0] = new Date(DB['HDay'][0][0]);
        }
        if (DB['HDay'][0][0].getDate() != d.getDate()) {
            DB['HDay'] = []
            DB['HHR'].push([d, hr]);

        }

    }
    this.setHR = function(hr) {
        var d = new Date()
        this.setHDay(d, hr);
        this.setHHR(d, hr);
    }

}
var ana = new HR();
var dtn = new Date()
console.log(dtn);
var temphr = 100
var i = 0;
// for (i = 1470224008402 - 3600000; i < dtn; i += 1000) {
//     var ttr = new Date(i);
//     //console.log(i);
//     ana.setHHR(ttr, 60 + Math.random() * 80);
//     ana.setHDay(ttr, temphr);
//     i += 1
// }
//console.log(i);
var genHistory = function() {
    DB['HIS'] = [];
    var temp = [];
    var time = new Date(DB['HWC'][0][0]);
    console.log(DB['HWC']);
    for (item in DB['HWC']) {
        i = DB['HWC'][item]
        if (new Date(i[0]).getHours() != time.getHours()) {
            function getSecond(b) {
                return b[1]
            }

            function getThird(b) {  
                return b[2]
            }
            DB['HIS'].push([time, math.mean(temp.map(getSecond)), math.min(temp.map(getSecond)),math.max(temp.map(getSecond))]);
            time = new Date(i[0]);
            temp = []
        }
        temp.push(i);
    }
}

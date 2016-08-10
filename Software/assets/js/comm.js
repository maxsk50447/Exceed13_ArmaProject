var data;
var senddata = function(sdata) {
    $.ajax({
        url: 'http://10.32.176.4/exvariable/'+sdata
    }).done(function() {
    //    console.log("done");
    });
}
var recdata=function(){
    $.ajax({url:"http://10.32.176.4/exvariable"}).success(function(d){
        console.log(d);
        var temp=function(a)
        {
            return parseInt(a);
        }
        data=d.split('_').map(temp)
        //console.log(data[0]);

    })
}

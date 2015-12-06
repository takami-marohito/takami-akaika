/**
 * Created by vizlab on 2015/12/03.
 */
/**
 * Created by vizlab on 2015/12/03.
 */
function CalculatingData() {

    var loopcounter=0;
    var orgCPUEData = {name:new Array(),data:new Array()};
    LoadingFile();

    console.log(orgCPUEData);

    var CPUEData = new Array();
    for(var i=0;i<orgCPUEData.data.length;i++){
        var year = orgCPUEData.data[i][0];
        var month = ("0"+orgCPUEData.data[i][1]).slice(-2);
        var day = ("0"+orgCPUEData.data[i][2]).slice(-2);
        var dateText = year + "-" + month + "-" + day;
        var date = DateToArrayNum(dateText);
        CPUEData[i] = {cpue:orgCPUEData.data[i][5],year:year,month:orgCPUEData.data[i][1],day:orgCPUEData.data[i][2],
            datenum:date,lat:orgCPUEData.data[i][3],lon:orgCPUEData.data[i][4]};
    }
    var result = new Array();
    var retArray = new Array();

    var loopnum = orgCPUEData.data.length-30;
    // var loopnum = orgCPUEData.data.length-1;

    var ValString = "T";

    var ReturnArray = new Array();

    return loopfunction(loopnum);


    function loopfunction(number){
        if(number==-1){
            console.log(retArray);
            SaveAnArray(retArray,ValString + number);
            return CalcData;
        }
        if(number<loopnum-1) {
            //console.log(retArray);
            SaveAnArray(retArray, ValString + number);
        }
        var afn = [];
        //console.log(CPUEData[number]);
        afn.push(loadData(ValString,CPUEData[number]));
        return jQuery.when.apply(
            $, afn
        ).then(function (){
                retArray[loopnum-number] = arguments[0];
                //console.log(retArray);
                loopfunction(number-1);
            });
    }


/*
    var afn = [];
    for(var i=0;i<CPUEData.length-170;i++){
        afn.push(loadData("S",CPUEData[i]));
        //afn.push(loadData("T",CPUEData[i]));
        //afn.push(loadData("U",CPUEData[i]));
        //afn.push(loadData("V",CPUEData[i]));
        //afn.push(loadData("W",CPUEData[i]));
    }
    return jQuery.when.apply(
        $, afn
    ).then(function () {
            //console.log(arguments);
            console.log("save");
            SaveAnArray(arguments,"arg");
            return CalcData;
        });
*/
    function loadData(valname,DateLocation){
        var returnValue = new Array();
        var xy = {x:DateLocation.lon,y:DateLocation.lat};
        var fn = [];
        fn.push(loadDataLoop(valname,DateLocation,0));
        for(var i=0;i<21;i++) {
            //fn.push(loadMOVEdata(DateLocation.datenum, i, 0, 441, 0, 672, valname));
            //fn.push(loadMOVEdata(DateLocation.datenum, i, 0, 441, 0, 672, "T"));
            //fn.push(loadMOVEdata(DateLocation.datenum, i, 0, 441, 0, 672, "U"));
            //fn.push(loadMOVEdata(DateLocation.datenum, i, 0, 441, 0, 672, "V"));
            //fn.push(loadMOVEdata(DateLocation.datenum, i, 0, 441, 0, 672, "W"));
        }
        return jQuery.when.apply(
            $, fn
        ).then(function () {
                console.log("get Data "+loopcounter + "  " + DateLocation.lon + "  " + DateLocation.lat + "  " + DateLocation.datenum);
                loopcounter++;
                returnValue[0] = DateLocation.year;
                returnValue[1] = DateLocation.month;
                returnValue[2] = DateLocation.day;
                returnValue[3] = DateLocation.lat;
                returnValue[4] = DateLocation.lon;
                returnValue[5] = DateLocation.cpue;

                for(var i=0;i<21;i++){
                    //returnValue[i+6] = interpolateVariable(arguments[i],xy);
                    returnValue[i+6] = arguments[0][i];
                }
                return returnValue;
            });
    }


    function loadDataLoop(valname,DateLocation,nth){
        if(nth == 0){
            ReturnArray = new Array();
        }
        if(nth == 21){
            return(ReturnArray);
        }
        var fn = [];
        var xy = {x:DateLocation.lon,y:DateLocation.lat};
        fn.push(loadMOVEdata(DateLocation.datenum, nth, 0, 441, 0, 672, valname));
        //console.log(DateLocation.datenum + "   " + nth + "   " + valname);
        return jQuery.when.apply(
            $, fn
        ).then(function () {
                ReturnArray.push(interpolateVariable(arguments[0],xy));
                //console.log(arguments[0]);
                if(nth%2==0){
                    console.log(nth);
                }
                return(loadDataLoop(valname,DateLocation,nth+1));
            });
    }

    function LoadingFile() {
        fileurl = URL.createObjectURL(document.getElementById("Filename").files[0]);
        return jQuery.when( jQuery.ajax({
                url: fileurl,
                dataType: "text",
                async: false
            })
        ).then(function (data) {
                var LF = String.fromCharCode(10); //改行ｺｰﾄﾞ
                var lines = data.split(LF);

                var csvData = [];

                for(var i=0;i<lines.length;i++){
                    var cells = lines[i].split(",");
                    if(cells.length!=1){
                        csvData.push(cells);
                    }
                }

                orgCPUEData.name = new Array();
                for(var i=0;i<csvData[0].length;i++){
                    orgCPUEData.name.push(csvData[0][i]);
                }

                orgCPUEData.data = new Array(csvData.length-1);
                for(var i=0;i<csvData.length-1;i++){
                    orgCPUEData.data[i] = new Array(csvData[0].length);
                    for(var j=0;j<csvData[0].length;j++){
                        orgCPUEData.data[i][j] = Number(csvData[i+1][j]);
                    }
                }
                //console.log(orgCPUEData.data);
                return;
            });
    }
}
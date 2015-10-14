/**
 * Created by vizlab on 2015/07/03.
 */

var CPUE = new Array();

var DataForRungeKutta = new Array(2);
DataForRungeKutta[0] = {u:[],v:[],w:[],s:[],t:[]};
DataForRungeKutta[1] = {u:[],v:[],w:[],s:[],t:[]};

var afrom = 0;
var bto = 14;
var cdate = 22;

function OnClickFunction_RungeKutta() {
    var target = document.getElementById("button_tab2_exec");
    target.innerHTML = "loading&Calculating";

    var dateNum = DateToArrayNum(document.getElementById("CPUE_Date_input").value)-cdate;
    if (dateNum == -1) {
        console.log("cannot find date");
        target.innerHTML = "Exec";
        return;
    }

    /*
    var dap_line = "http://hyperinfo.viz.media.kyoto-u.ac.jp/~futami/dias/MOVE-RA2014.dods?";
    dap_line+="U";
    dap_line+="[1200]";
    dap_line+="[23]";
    dap_line+="[102:103]";
    dap_line+="[121:122]";

    return jqdap.loadData(dap_line,{withCredentials:true})
        .then(function(tmp_T)
        {
            console.log(tmp_T);

            console.log((tmp_T[0][0][0][0][0][0]+tmp_T[0][0][0][0][0][1]+tmp_T[0][0][0][0][1][0]+tmp_T[0][0][0][0][1][1])/4.0);

            return(tmp_T);
            var OutputString = new Array();
            for(var i=0;i<tmp_T[0].length;i++){
                OutputString += String(tmp_T[0][i]);
                if(i!=tmp_T[0].length-1) {
                    OutputString += "\n";
                }
            }
            var blob = new Blob([OutputString], {type: 'text/plain'});
            var link = document.createElement("a");
            link.download = "depth_ascii";
            link.href = URL.createObjectURL(blob);
            link.click();
            return(tmp_T);
        }
    );

    return 0;
    */

    var cpue_filename = document.getElementById("CPUE_FOR_RUNGEKUTTA").files[0];

    var cpue_backward = eval(document.getElementById("CPUEDay").value);

    var integral_number_per_day = eval(document.getElementById("IntegralPerDay").value);

    var dfds = [];

    var CPUE_same_day_from = new Array();
    var CPUE_same_day_to = new Array();

    var tmp_count = 0;

    for(var i=0;i<1;i++){
        for(var j=afrom;j<bto;j++){
            downloadData(i,j,1);
        }
    }



    function downloadData(argi,argj,count){
        var fn = [];
        fn.push(loadMOVEdata(dateNum - argi, argj, 0, 441, 0, 672, "U"));
        fn.push(loadMOVEdata(dateNum - argi, argj, 0, 441, 0, 672, "V"));
        fn.push(loadMOVEdata(dateNum - argi, argj, 0, 441, 0, 672, "W"));
        fn.push(loadMOVEdata(dateNum - argi, argj, 0, 441, 0, 672, "T"));
        fn.push(loadMOVEdata(dateNum - argi, argj, 0, 441, 0, 672, "S"));
        return jQuery.when.apply(
            $, fn
        ).then(function () {
                var OutputString;
                var blob;
                var link;
                var filenameString;
                for(var i=0;i<5;i++) {
                    OutputString = new Array();
                    for (var y = 0; y < arguments[0].data.length; y++) {
                        for (var x = 0; x < arguments[0].data[0].length; x++) {
                            OutputString += String(arguments[i].data[y][x]);
                            if (x == arguments[0].data[0].length - 1) {

                            } else {
                                OutputString += ",";
                            }
                        }
                        OutputString += "\n";
                    }
                    blob = new Blob([OutputString], {type: 'text/plain'});
                    link = document.createElement("a");
                    if(i==0){
                        filenameString = "U";
                    }
                    if(i==1){
                        filenameString = "V";
                    }
                    if(i==2){
                        filenameString = "W";
                    }
                    if(i==3){
                        filenameString = "T";
                    }
                    if(i==4){
                        filenameString = "S";
                    }
                    filenameString += "-";
                    filenameString += String(arguments[i].time);
                    filenameString += "-";
                    filenameString += String(argj);
                    link.download = filenameString;
                    link.href = URL.createObjectURL(blob);
                    link.click();
                }
                arguments = new Array();
                OutputString = new Array();
                blob = new Blob();
                link = 0;
                filenameString = 0;
                if(count <= 1){
                    return;
                }
                downloadData(argi+1,argj,count-1);
            });
    }

    function Loop_RungeKutta(count, from, to){
        if(count==0){
            return;
        }
        if(count!=0){
            for(var i=from;i<to;i++){
                DataForRungeKutta[0] = $.extend(true,{},DataForRungeKutta[1]);
                dfds = new Array();
                for(var j=0;j<54;j++){
                    dfds.push(loadMOVEdata(dateNum-1 , j, 0, 441, 0, 672, "U"));
                    dfds.push(loadMOVEdata(dateNum-1 , j, 0, 441, 0, 672, "V"));
                    dfds.push(loadMOVEdata(dateNum-1 , j, 0, 441, 0, 672, "W"));
                    dfds.push(loadMOVEdata(dateNum-1 , j, 0, 441, 0, 672, "T"));
                    dfds.push(loadMOVEdata(dateNum-1 , j, 0, 441, 0, 672, "S"));
                }
                return jQuery.when.apply(
                    $,dfds
                ).then(function(){
                        DataForRungeKutta[1].u = arguments[0];
                        DataForRungeKutta[1].v = arguments[1];
                        DataForRungeKutta[1].w = arguments[2];
                        DataForRungeKutta[1].t = arguments[3];
                        DataForRungeKutta[1].s = arguments[4];
                        CalcRungeKutta(count, from, to);
                        Loop_RungeKutta(count-1, from, to);
                    });
            }
        }
    }

    function CalcRungeKutta(count, from, to){
        var Nday = cpue_backward - count + 1;
        for(var i=from;i<to;i++){
            for(var j=0;j<54;j++){
                CPUE[i].data[Nday].u[j] = 0;
            }
        }
        var deltaT = 1.0 / integral_number_per_day;
        for(var i=0;i<integral_number_per_day;i++){

        }
    }

    function GetDataForRungeKutta(time){
        loadMOVEdata(time, Depth, 0, 441, 0, 672, "U");
    }

}


//この関数はFormControl.jsで使っている
function LoadingCPUEForRungeKutta(){
    fileurl = URL.createObjectURL(document.getElementById("CPUE_FOR_RUNGEKUTTA").files[0]);
    //fileurl = URL.createObjectURL("js/CPUE.csv");
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
            var csvNumData = {};
            csvNumData.data = new Array(csvData.length);
            for(var i=0;i<csvData.length;i++){
                csvNumData.data[i] = new Array(csvData[i].length);
                for(var j=0;j<csvData[0].length;j++) {
                    csvNumData.data[i][j] = Number(csvData[i][j]);
                }
            }

            var number_of_data_to_calc = lines.length-2;

            CPUE = new Array(number_of_data_to_calc);

            for(var i=0;i<number_of_data_to_calc;i++){
                CPUE[i] = {pos:[],val:[],year:[],month:[],day:[],data:[]};
            }

            //for(var i=1;i<csvNumData.data.length;i++){ 0 7
            var count = 0;
            for(var i=1;i<number_of_data_to_calc+1;i++){
                CPUE[count].pos[0] = new THREE.Vector3(csvNumData.data[i][4], csvNumData.data[i][3], 0);
                CPUE[count].val[0] = csvNumData.data[i][5];
                CPUE[count].year[0] = csvNumData.data[i][0];
                CPUE[count].month[0] = csvNumData.data[i][1];
                CPUE[count].day[0] = csvNumData.data[i][2];
                CPUE[count].data[0] = {u:[],v:[],w:[],s:[],t:[]};
                count++;
            }
            //console.log(CPUE);
            //CPUEの構造は、CPUE[点番号].data[何日前か].u[depth]
        });
}


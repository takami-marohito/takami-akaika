/**
 * Created by vizlab on 2015/12/11.
 */
/**
 * Created by vizlab on 2015/12/11.
 */

//流跡線計算
//手順
//for( 各点 )
//  初期位置のセット
//  for( 各深さ )
//    for( 各日 )
//      その日の位置計算
//      for( 各変数 )

//つまり、あるCPUE点のある深さで一日さかのぼった位置を計算する -> 計算した位置の各変数を求めて記録する -> さらに一日戻る -> 変数を記録する
//をまずする。　次に深さを1深くして、同じことをする。
//深さが全部終わったら次のCPUE点に移る。

//さかのぼった座標は計算しているので、日数を増やしたいときはその座標を0日目の座標にすればいい


//BackwardCPUEDataには、双見君の計算と同じ形で入っている
//BackwardCPUEPoint[i][j][k]はi番目の点のdepth = jから遡り始めて、k日遡った点がはいっている。
//点はlat,lon,depthで表している。

//RungeKuttaCPUEPointはルンゲクッタの途中で出てくる点を全て記録する。RungeKuttaCPUEPoint[i][j][k]はi番目の点depth j を計算中に出てくるk個目の座標

NUMBER_S = 0;
NUMBER_T = 1;
NUMBER_U = 2;
NUMBER_V = 3;
NUMBER_W = 4;

var backward_day = 60;   //0日目からn日目まで計算する(n+1のデータを作る
var maxdepth = 20;

function CalculatingPathLine(){



    var NumberOfRungeKuttaPerDay = 3;  //RungeKutta法をn-1回行う -> 一日をn区間に分ける

    var orgCPUEData = {name:new Array(),data:new Array()};

    LoadingFile();

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

    var calculatingStartPoint = document.getElementById("PathLineNumber").value;
    console.log(calculatingStartPoint);
    var calculatingEndPoint =   CPUEData.length;    //CPUEData.length;

    var BackwardCPUEData = new Array();
    var BackwardCPUEPoint = new Array();
    var RungeKuttaCPUEPoint = new Array();

    for(var i=0;i<calculatingEndPoint;i++){
        BackwardCPUEData[i] = new Array(6+maxdepth*(backward_day+1)*5);
        for(var j=0;j<BackwardCPUEData[i].length;j++){
            BackwardCPUEData[i][j] = 0;
        }
        BackwardCPUEData[i][0] = CPUEData[i].year;
        BackwardCPUEData[i][1] = CPUEData[i].month;
        BackwardCPUEData[i][2] = CPUEData[i].day;
        BackwardCPUEData[i][3] = CPUEData[i].lat;
        BackwardCPUEData[i][4] = CPUEData[i].lon;
        BackwardCPUEData[i][5] = CPUEData[i].cpue;
    }

    for(var i=0;i<calculatingEndPoint;i++){
        BackwardCPUEPoint[i] = new Array(maxdepth);
        RungeKuttaCPUEPoint[i] = new Array();
        for(var j=0;j<maxdepth;j++){
            BackwardCPUEPoint[i][j] = new Array(backward_day+1);
            for(var k=0;k<backward_day+1;k++){
                BackwardCPUEPoint[i][j][k] = {lat:0,lon:0,depth:0};
            }
            RungeKuttaCPUEPoint[i][j] = new Array();
            //for(var k=0;k<(backward_day)*NumberOfRungeKuttaPerDay;k++){
                //RungeKuttaCPUEPoint[i][j][k] = {lat:0,lon:0,depth:0};
            //}
        }
    }
    //console.log(BackwardCPUEData);

    var fn = [];
    fn.push(loopfunction_point(calculatingStartPoint));
    return jQuery.when.apply(
        $, fn
    ).then(function () {
            //console.log(BackwardCPUEData);
            //console.log(BackwardCPUEPoint);
            var saveArray = InitSaveArray();
            saveArray = setBackwardCPUEDataToSaveArray(saveArray);
            var pointarray = new Array(BackwardCPUEPoint.length);
            for(var i=0;i<BackwardCPUEPoint[0][0].length;i++) {
                pointarray[i] = new Array();
                pointarray[i].push(BackwardCPUEPoint[0][0][i].lat);
                pointarray[i].push(BackwardCPUEPoint[0][0][i].lon);
            }
            //console.log(pointarray);
            SaveAnArray(pointarray,"BackwardPointData");
            SaveAnArray(saveArray,"BackwardData");
            var retobject = {data:new Array(442),line:new Array()};
            for(var i=0;i<442;i++){
                retobject.data[i] = new Array(673);
                for(var j=0;j<673;j++){
                retobject.data[i][j] = SpecialColorValue;
                }
            }
            /*
            retobject.line[0] = new THREE.Geometry();
            for(var i=0;i<BackwardCPUEPoint[0][0].length;i++){
                retobject.line[0].vertices.push(LatLonToMapGrid_Vector3(BackwardCPUEPoint[0][0][i].lon, BackwardCPUEPoint[0][0][i].lat));
            }
            */
            return retobject;
        }
    );

    function loopfunction_point(pointnumber){
        console.log("point" + pointnumber);
        if(pointnumber == calculatingEndPoint){
            //console.log("finish");
            return CalcData;
        }
        var fn = [];
        fn.push(set0dayData(pointnumber,0));
        return jQuery.when.apply(
            $, fn
        ).then(function () {
                var fn2=[];
                fn2.push(loopfunction_depth(0,pointnumber));
                return jQuery.when.apply(
                    $, fn2
                ).then(function () {
                        if(pointnumber > calculatingStartPoint) {
                            var saveArray = InitSaveArray();
                            saveArray = setBackwardCPUEDataToSaveArray(saveArray);
                            var pointarray = new Array(pointnumber+1);
                            for (var i = 0; i < pointnumber+1; i++) {
                                pointarray[i] = new Array();
                                for(var j=0;j<backward_day+1;j++) {
                                    for(var k=0;k<maxdepth;k++) {
                                        pointarray[i].push(BackwardCPUEPoint[i][k][j].lat);
                                        pointarray[i].push(BackwardCPUEPoint[i][k][j].lon);
                                        pointarray[i].push(BackwardCPUEPoint[i][k][j].depth);
                                    }
                                }
                            }
                            //console.log(pointarray);
                            SaveAnArray(pointarray, "BackwardPointData" + pointnumber);
                            SaveAnArray(saveArray, "BackwardData" + pointnumber);
                        }
                        return loopfunction_point(pointnumber + 1);
                    }
                );
            },
            function () {
                return loopfunction_point(pointnumber);
            }
        );
    }

    function loopfunction_depth(depthnumber,pointnumber){
        //console.log("depth" + depthnumber);
        if(depthnumber == maxdepth){
            //console.log("depth = " + maxdepth + " end");
            return CalcData;
        }
        var fn = [];
        fn.push(loopfunction_date(0,depthnumber,pointnumber));
        return jQuery.when.apply(
            $, fn
        ).then(function () {
                return loopfunction_depth(depthnumber+1,pointnumber);
            },
            function () {
                return loopfunction_depth(depthnumber,pointnumber);
            }
        );
    }

    function loopfunction_date(datenumber,depthnumber,pointnumber){
        //console.log("date" + datenumber);
        //console.log(" day = " + datenumber + "start " + backward_day);
        if(datenumber == backward_day){
            //console.log("day = " + datenumber + " end ");
            return 0;
        }
        var input_point = BackwardCPUEPoint[pointnumber][depthnumber][datenumber];
        //console.log(input_point);
        var input_datenum = CPUEData[pointnumber].datenum-datenumber;

        var fn = [];
        fn.push(RungeKuttaMethod(BackwardCPUEData,RungeKuttaCPUEPoint,input_point,input_datenum,datenumber,depthnumber, pointnumber,NumberOfRungeKuttaPerDay));
        //fnでBackwardCPUEDataとRungeKuttaCPUEPointに値を入れる
        return jQuery.when.apply(
            $, fn
        ).then(function () {
                UpdateBackwardCPUEData(arguments[0],datenumber+1,depthnumber,pointnumber);
                var lastPoint = RungeKuttaCPUEPoint[pointnumber][depthnumber][RungeKuttaCPUEPoint[pointnumber][depthnumber].length-1];
                BackwardCPUEPoint[pointnumber][depthnumber][datenumber+1] = lastPoint;
                return loopfunction_date(datenumber+1,depthnumber,pointnumber);
            },
            function () {
                return loopfunction_date(depthnumber,pointnumber);
            }
        );
    }

    function UpdateBackwardCPUEData(arg,datenumber,depthnumber,pointnumber){
        var datanumber = returnNumberOfData("S",depthnumber,datenumber);
        BackwardCPUEData[pointnumber][datanumber] = arg.s;
        datanumber = returnNumberOfData("T",depthnumber,datenumber);
        BackwardCPUEData[pointnumber][datanumber] = arg.t;
        datanumber = returnNumberOfData("U",depthnumber,datenumber);
        BackwardCPUEData[pointnumber][datanumber] = arg.u;
        datanumber = returnNumberOfData("V",depthnumber,datenumber);
        BackwardCPUEData[pointnumber][datanumber] = arg.v;
        datanumber = returnNumberOfData("W",depthnumber,datenumber);
        BackwardCPUEData[pointnumber][datanumber] = arg.w;
        //console.log(arg);
        return 0;
    }

    function calcLocation(input_location){
        var returnLocation = {lat:0,lon:0,depth:0};

        return returnLocation;
    }


    function InitSaveArray(){
        var input = new Array(BackwardCPUEData.length+1);
        for(var i=0;i<BackwardCPUEData.length+1;i++){
            input[i] = new Array(BackwardCPUEData[0].length);
        }
        for(var i=0;i<6;i++){
            if(i==0){
                input[0][i] = "YEAR";
            }
            if(i==1){
                input[0][i] = "MONTH";
            }
            if(i==2){
                input[0][i] = "DAY";
            }
            if(i==3){
                input[0][i] = "LAT";
            }
            if(i==4){
                input[0][i] = "LON";
            }
            if(i==5){
                input[0][i] = "CPUE";
            }
        }
        for(var i=6;i<BackwardCPUEData[0].length;i++){
            var n = maxdepth*(backward_day+1);
            var str;
            if(Math.floor((i-6)/n) == NUMBER_S){
                str="S";
            }
            if(Math.floor((i-6)/n) == NUMBER_T){
                str="T";
            }
            if(Math.floor((i-6)/n) == NUMBER_U){
                str="U";
            }
            if(Math.floor((i-6)/n) == NUMBER_V){
                str="V";
            }
            if(Math.floor((i-6)/n) == NUMBER_W){
                str="W";
            }
            var dep = (((i-6)%n)%maxdepth);
            str += String(("0"+dep).slice(-2));
            var day = (Math.floor(((i-6)%n)/maxdepth));
            str += String(("0"+day).slice(-2));
            input[0][i] = str;
        }
        //console.log(input);
        return input;
    }

    function setBackwardCPUEDataToSaveArray(input){
        for(var i=0;i<BackwardCPUEData.length;i++){
            for(var j=0;j<BackwardCPUEData[0].length;j++){
                input[i+1][j] = BackwardCPUEData[i][j];
            }
        }
        //console.log(input);
        return input;
    }

    //0日目のデータをBackwardCPUEDataに入れて、座標をBackwardCPUEPointに入れる。
    function set0dayData(pointnumber,depth){       //pointnumberはcalculatingStartPointを入れる, depthは0
        if(depth == maxdepth){
            return 0;
        }
        BackwardCPUEPoint[pointnumber][depth][0].lat = CPUEData[pointnumber].lat;
        BackwardCPUEPoint[pointnumber][depth][0].lon = CPUEData[pointnumber].lon;
        BackwardCPUEPoint[pointnumber][depth][0].depth = returnNumberOfDepthFromDepthIntNumber(depth);
        var year = orgCPUEData.data[pointnumber][0];
        var month = ("0"+orgCPUEData.data[pointnumber][1]).slice(-2);
        var day = ("0"+orgCPUEData.data[pointnumber][2]).slice(-2);
        var dateText = year + "-" + month + "-" + day;
        var date = DateToArrayNum(dateText);
/*
        if(depth%5==0){
            console.log("calc first day depth " + depth);
        }
        */
        var lon_number = returnNumberOfLonUsingLonU(BackwardCPUEPoint[pointnumber][depth][0].lon);
        var lat_number = returnNumberOfLatUsingLatU(BackwardCPUEPoint[pointnumber][depth][0].lat);

        var fn = [];
        fn.push(loadMOVEdataReduced(date,depth,lat_number-2,lat_number+2,lon_number-2,lon_number+2,"S"));
        fn.push(loadMOVEdataReduced(date,depth,lat_number-2,lat_number+2,lon_number-2,lon_number+2,"T"));
        fn.push(loadMOVEdataReduced(date,depth,lat_number-2,lat_number+2,lon_number-2,lon_number+2,"U"));
        fn.push(loadMOVEdataReduced(date,depth,lat_number-2,lat_number+2,lon_number-2,lon_number+2,"V"));
        fn.push(loadMOVEdataReduced(date,depth,lat_number-2,lat_number+2,lon_number-2,lon_number+2,"W"));
        return jQuery.when.apply(
            $, fn
        ).then(function(){
                set0dayDataToBackwardCPUEData(arguments,pointnumber,depth);
                return set0dayData(pointnumber,depth+1);
            },function(){
                return set0dayData(pointnumber,depth);
            }
        );
    }

    function set0dayDataToBackwardCPUEData(input,pointnumber,depth){
        var xy = {x:CPUEData[pointnumber].lon,y:CPUEData[pointnumber].lat};
        var datanumber = returnNumberOfData("S",depth,0);
        BackwardCPUEData[pointnumber][datanumber] = interpolateVariable(input[0],xy);
        datanumber = returnNumberOfData("T",depth,0);
        BackwardCPUEData[pointnumber][datanumber] = interpolateVariable(input[1],xy);
        datanumber = returnNumberOfData("U",depth,0);
        BackwardCPUEData[pointnumber][datanumber] = interpolateVariable(input[2],xy);
        datanumber = returnNumberOfData("V",depth,0);
        BackwardCPUEData[pointnumber][datanumber] = interpolateVariable(input[3],xy);
        datanumber = returnNumberOfData("W",depth,0);
        BackwardCPUEData[pointnumber][datanumber] = interpolateVariable(input[4],xy);
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
                    orgCPUEData.name.push(String(csvData[0][i]));
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

function returnNumberOfData(valname,depth,day){
    var number = 6;
    if(valname == "S"){
    }else if(valname == "T"){
        number += maxdepth*(backward_day+1);
    }else if(valname == "U"){
        number += 2*(maxdepth*(backward_day+1));
    }else if(valname == "V"){
        number += 3*(maxdepth*(backward_day+1));
    }else if(valname == "W"){
        number += 4*(maxdepth*(backward_day+1));
    }
    number += depth;
    number += maxdepth*day;
    return(number);
}
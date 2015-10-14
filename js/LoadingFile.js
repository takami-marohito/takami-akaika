/**
 * Created by vizlab on 2015/04/21.
 */

var CPUE_Position;
var CPUE_Value;
var CPUE_Date = {year:new Array(),month:new Array(),day:new Array()};

function LoadingCPUEFile(){
    fileurl = URL.createObjectURL(document.getElementById("CPUEFileName").files[0]);
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
            CPUE_Position = new Array();
            CPUE_Value = new Array();
            //for(var i=1;i<csvNumData.data.length;i++){ 0 7
            var count = 0;
            for(var i=1;i<156;i++){
                CPUE_Position[count] = new THREE.Vector3(csvNumData.data[i][4], csvNumData.data[i][3], 0.1);
                CPUE_Value[count] = csvNumData.data[i][5];
                CPUE_Date.year[count] = csvNumData.data[i][0];
                CPUE_Date.month[count] = csvNumData.data[i][1];
                CPUE_Date.day[count] = csvNumData.data[i][2];
                count++;
            }
        });
}

function LoadingFile() {
    fileurl = URL.createObjectURL(document.getElementById("Filename").files[0]);
    //console.log(fileurl);

    var csvNumData = {};

    jQuery.when( jQuery.ajax({
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
            csvNumData.data = new Array(csvData.length);
            for(var i=0;i<csvData.length;i++){
                csvNumData.data[i] = new Array(csvData[i].length);
                for(var j=0;j<csvData[0].length;j++) {
                    csvNumData.data[i][j] = Number(csvData[i][j]);
                }
            }

            //console.log(csvNumData);

        });

    fileurl2 = URL.createObjectURL(document.getElementById("LineFilename").files[0]);
    if(fileurl2==null){
        return csvNumData;
    }
    console.log("load line data");

    csvNumData.line = new Array(1);
    for(var i=0;i<csvNumData.line.length;i++){
        csvNumData.line[i] = new THREE.Geometry();
    }

    var csvLineNumData = [] ;
    jQuery.when( jQuery.ajax({
            url: fileurl2,
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
            csvLineNumData = new Array(csvData.length);
            for(var i=0;i<csvData.length;i++){
                csvLineNumData[i] = new Array(csvData[i].length);
                for(var j=0;j<csvData[0].length;j++) {
                    csvLineNumData[i][j] = Number(csvData[i][j]);
                }
            }
            var spline_vertex = [];
            for(var i=0;i<csvLineNumData.length;i++){
                spline_vertex.push(LatLonToMapGrid_Vector3(csvLineNumData[i][0],csvLineNumData[i][1]) );
            }

            spline = new THREE.SplineCurve3(spline_vertex);
            var spline_num = csvLineNumData.length*5;
            var splinePoints = spline.getPoints(spline_num);
            console.log(splinePoints.length);
            console.log(spline_num);
            for(var i=0;i<splinePoints.length;i++){
                csvNumData.line[0].vertices.push(splinePoints[i]);
            }
            //console.log(csvNumData);

        });
    return csvNumData;
    /*
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

        //console.log(csvNumData);
        return csvNumData;
    });
    */
}
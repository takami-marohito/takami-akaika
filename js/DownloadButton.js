/**
 * Created by vizlab on 2015/04/10.
 */

function DownloadDataButtonOnClickFunction() {
    var OutputString = new Array();
    console.log(CalcData);
    for(var i=0;i<CalcData.data.length;i++){
        for(var j=0;j<CalcData.data[0].length;j++){
            OutputString += String(CalcData.data[i][j]);
            if(j != CalcData.data[0].length-1) {
                OutputString += ",";
            }
            if(j == CalcData.data[0].length-1){
                OutputString += '\n';
            }
        }
    }
    var blob = new Blob([OutputString], {type: 'text/plain'});
    var link = document.createElement("a");
    filenameString = "input" ;
    link.download = filenameString;
    link.href = URL.createObjectURL(blob);
    link.click();
}

function SaveAnArray(arr,name)
{
    var OutputString = new Array();
    //console.log(arr[0].length);
    if(arr[0].length!==undefined) {
        for (var i = 0; i < arr.length; i++) {
            for (var j = 0; j < arr[0].length; j++) {
                OutputString += String(arr[i][j]);
                if (j != arr[0].length - 1) {
                    OutputString += ",";
                }
                if (j == arr[0].length - 1) {
                    OutputString += '\n';
                }
            }
        }
    }
    if(arr[0].length===undefined){
        for (var i = 0; i < arr.length; i++) {
            OutputString += String(arr[i]);
            if(i != arr.length-1){
                OutputString += ",";
            }
        }
    }
    var blob = new Blob([OutputString], {type: 'text/plain'});
    var link = document.createElement("a");
    filenameString = name ;
    link.download = filenameString;
    link.href = URL.createObjectURL(blob);
    link.click();
}


function DownloadButtonOnClickFunction() {
    var imgData = map_renderer.domElement.toDataURL();
    imgNode = document.createElement("img");
    imgNode.src = imgData;
    var link = document.createElement("a");
    link.download = 'test.png';
    link.href = imgData;
    link.click();

/*
    for(var i=0;i<30;i++) {
        var OutputString = new Array();
        OutputString += VortexRotation_matrix[i].u.time_string;
        OutputString += "\n";
        for (var y = 0; y < VortexRotation_matrix[i].u.data.length; y++) {
            for (var x = 0; x < VortexRotation_matrix[i].u.data[0].length; x++) {
                OutputString += String(VortexRotation_matrix[i].u.data[y][x]);
                if(x == VortexRotation_matrix[i].u.data[0].length-1){

                }else {
                    OutputString += ",";
                }
            }
            OutputString += "\n";
        }
        var blob = new Blob([OutputString],{type:'text/plain'});
        var link = document.createElement("a");
        var filenameString = "u_";
        filenameString += String(i);
        link.download = filenameString;
        link.href = URL.createObjectURL(blob);
        link.click();

        OutputString = new Array();
        OutputString += VortexRotation_matrix[i].v.time_string;
        OutputString += "\n";
        for (var y = 0; y < VortexRotation_matrix[i].v.data.length; y++) {
            for (var x = 0; x < VortexRotation_matrix[i].v.data[0].length; x++) {
                OutputString += String(VortexRotation_matrix[i].v.data[y][x]);
                if(x == VortexRotation_matrix[i].v.data[0].length-1){

                }else {
                    OutputString += ",";
                }
            }
            OutputString += "\n";
        }
        blob = new Blob([OutputString],{type:'text/plain'});
        link = document.createElement("a");
        filenameString = "v_";
        filenameString += String(i);
        link.download = filenameString;
        link.href = URL.createObjectURL(blob);
        link.click();

        OutputString = new Array();
        OutputString += VortexRotation_matrix[i].w.time_string;
        OutputString += "\n";
        for (var y = 0; y < VortexRotation_matrix[i].w.data.length; y++) {
            for (var x = 0; x < VortexRotation_matrix[i].w.data[0].length; x++) {
                OutputString += String(VortexRotation_matrix[i].w.data[y][x]);
                if(x == VortexRotation_matrix[i].w.data[0].length-1){

                }else {
                    OutputString += ",";
                }
            }
            OutputString += "\n";
        }
        blob = new Blob([OutputString],{type:'text/plain'});
        link = document.createElement("a");
        filenameString = "w_";
        filenameString += String(i);
        link.download = filenameString;
        link.href = URL.createObjectURL(blob);
        link.click();
    }
*/



}
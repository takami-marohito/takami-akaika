/**
 * Created by vizlab on 2015/04/10.
 */

function DownloadButtonOnClickFunction() {
    var imgData = map_renderer.domElement.toDataURL();
    imgNode = document.createElement("img");
    imgNode.src = imgData;
    var link = document.createElement("a");
    link.download = 'test.png';
    link.href = imgData;
    link.click();


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


    /*
    var OutputString = new Array();
    for(var x=0;x<VortexRotation_matrix[0].u.data.length;x++){
        OutputString += String(VortexRotation_matrix[0].u.data[100][x]);
        OutputString += ",";
    }

    var blob = new Blob([OutputString],{type:'text/plain'});
    var link = document.createElement("a");
    link.download = 'test';
    link.href = URL.createObjectURL(blob);
    link.click();
    */
}
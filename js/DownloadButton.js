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

/*
    var OutputString = new Array();
    for(var x=0;x<DataCalculating.latitude.length;x++){
        OutputString += String(DataCalculating.latitude[x]);
        OutputString += ",";
    }

    var blob = new Blob([OutputString],{type:'text/plain'});
    var link = document.createElement("a");
    link.download = 'test';
    link.href = URL.createObjectURL(blob);
    link.click();
    */
}



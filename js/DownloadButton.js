/**
 * Created by vizlab on 2015/04/10.
 */

function DownloadButtonOnClickFunction() {

    jQuery(function() {
        //var test = jQuery('#button_download').attr("href", window.webkitURL.createObjectURL(blob));
        //console.log(window.webkitURL.createObjectURL(blob));
        //console.log(test);
    });

    /*
    var imgData = map_renderer.domElement.toDataURL();
    imgNode = document.createElement("img");
    imgNode.src = imgData;
    var link = document.createElement("a");
    link.download = 'test.png';
    link.href = imgData;
    link.click();
*/

    var OutputString = new Array();
    for(var x=0;x<DataCalculating.latitude.length;x++){
        OutputString += String(DataCalculating.latitude[x]);
        OutputString += ",";
    }
    var OutputString2 = new Array();
    for(var y=0;y<DataCalculating.longitude.length;y++){
        OutputString2 += String(DataCalculating.longitude[y]);
        OutputString2 += ",";
}

    var blob = new Blob([OutputString],{type:'text/plain'});
    var link = document.createElement("a");
    link.download = 'test';
    link.href = URL.createObjectURL(blob);
    link.click();

    var blob2 = new Blob([OutputString2],{type:'text/plain'});
    var link2 = document.createElement("a");
    link2.download = 'test2';
    link2.href = URL.createObjectURL(blob2);
    link2.click();

}



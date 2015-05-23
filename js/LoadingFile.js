/**
 * Created by vizlab on 2015/04/21.
 */

function LoadingFile() {
    fileurl = URL.createObjectURL(document.getElementById("Filename").files[0]);
    //console.log(fileurl);

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
}
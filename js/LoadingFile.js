/**
 * Created by vizlab on 2015/04/21.
 */

function LoadingFile() {
    var returnObject = {};
    returnObject.data = new Array();

    fileurl = URL.createObjectURL(document.getElementById("Filename").files[0]);
    //console.log(fileurl);

    jQuery.ajax({
        url: fileurl,
        dataType: "text",
        async: false
    }).done(function (data) {
        console.log(data);
        return data;
    });
}
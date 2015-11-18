/**
 * Created by vizlab on 2015/11/18.
 */
/**
 * Created by vizlab on 2015/05/10.
 */

//http://hyperinfo.viz.media.kyoto-u.ac.jp/~futami/dias/MOVE-RA2014.dods?LatuでLatの配列を取得できるが、ここではローカルに保存したデータを使っている
//http://hyperinfo.viz.media.kyoto-u.ac.jp/~futami/dias/MOVE-RA2014.dods?Lattもある。違いはhttp://hyperinfo.viz.media.kyoto-u.ac.jp/~futami/dias/MOVE-RA2014.ddsに書いてある

var LatLon = new setLatLon_func();

loadLatandLonData();

function loadLatandLonData()
{
    var csvData = new Array();
    var data = new XMLHttpRequest();
    data.open("GET","./js/data/LatitudeU_ascii", false);  //true:非同期, false:同期
    data.send(null);
    var LF = String.fromCharCode(10); //改行ｺｰﾄﾞ
    var lines = data.responseText.split(LF);
    for(var i=0;i<lines.length;i++){
        var cells = lines[i].split(",");
        if(cells.length!=1){
            csvData.push(cells);
        }
    }
    var dataLat = new Array(csvData[0].length);
    for(var i=0;i<csvData[0].length;i++){
        dataLat[i] = Number(csvData[0][i]);
    }
    LatLon.setLatitude(dataLat);

    var csvData2 = new Array();
    var data2 = new XMLHttpRequest();
    data2.open("GET","./js/data/LongitudeU_ascii", false);  //true:非同期, false:同期
    data2.send(null);
    var lines2 = data2.responseText.split(LF);
    for(var i=0;i<lines2.length;i++){
        var cells2 = lines2[i].split(",");
        if(cells2.length!=1){
            csvData2.push(cells2);
        }
    }
    var dataLon = new Array(csvData2[0].length);
    for(var i=0;i<csvData2[0].length;i++){
        dataLon[i] = Number(csvData2[0][i]);
    }
    LatLon.setLongitude(dataLon);
}

function setLatLon_func(Lat,Lon,which)
{
    this.Latitude = {};
    this.Latitude.data = new Array();
    this.Longitude = {};
    this.Longitude.data = new Array();
    this.Latitude.max = 0;
    this.Latitude.min = 0;
    this.Longitude.max = 0;
    this.Longitude.min = 0;
    this.User = {};
    this.User.Longitude = {min:0,max:0};
    this.User.Latitude = {min:0,max:0};
    this.setLatitude = function(lat){
        this.Latitude.data = new Array(lat.length);
        this.Latitude.data = lat;
        this.Latitude.min = lat[0];
        this.Latitude.max = lat[lat.length-1];
    };
    this.setLongitude = function(lon){
        this.Longitude.data = new Array(lon.length);
        this.Longitude.data = lon;
        this.Longitude.min = lon[0];
        this.Longitude.max = lon[lon.length-1];
    };
}
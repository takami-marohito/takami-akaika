/**
 * Created by vizlab on 2015/05/08.
 */
/**
 * Created by vizlab on 2015/05/08.
 */
var LatLon = new setLatLon_func();

loadLatandLonData();

function loadLatandLonData()
{
    var csvData = new Array();
    var data = new XMLHttpRequest();
    data.open("GET","./js/data/Latitude_ascii", false);  //true:非同期, false:同期
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
    data2.open("GET","./js/data/Longitude_ascii", false);  //true:非同期, false:同期
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
    LatLon.exec();
}

function setLatLon_func(Lat,Lon)
{
    this.Latitude = {};
    this.Latitude.data = new Array();
    this.Longitude = {};
    this.Longitude.data = new Array();
    this.Latitude.range = {min:0,max:0};
    this.Longitude.range = {min:0,max:0};
    this.setLatitude = function(lat){
        this.Latitude.data = new Array(lat.length);
        this.Latitude.data = lat;
    };
    this.setLongitude = function(lon){
        this.Longitude.data = new Array(lon.length);
        this.Longitude.data = lon;
    };
    this.exec = function(){
        if(Longitude.min <= this.Longitude.data[0]){
            this.Longitude.min = 0;
        }
        if(Longitude.max >= this.Longitude.data[this.Longitude.data.length-1]){
            this.Longitude.range.max = this.Longitude.data.length-1;
        }
        if(Latitude.min <= this.Latitude.data[0]){
            this.Latitude.range.min = 0;
        }
        if(Latitude.max >= this.Latitude.data[this.Latitude.data.length-1]){
            this.Latitude.range.max = this.Latitude.data.length-1;
        }
        for(var x=0;x<this.Longitude.data.length-1;x++){
            //console.log(x);
            //console.log(this.Longitude.data[x]);
            //console.log(Longitude.max);
            if(this.Longitude.data[x] < Longitude.min && this.Longitude.data[x+1] > Longitude.min){
                this.Longitude.range.min = x+1;
            }
            if(this.Longitude.data[x] < Longitude.max && this.Longitude.data[x+1] > Longitude.max){
                this.Longitude.range.max = x;
            }
        }
        for(var y=0;y<this.Latitude.data.length-1;y++){
            if(this.Latitude.data[y] < Latitude.min && this.Latitude.data[y+1] > Latitude.min){
                this.Latitude.range.min = y+1;
            }
            if(this.Latitude.data[y] < Latitude.max && this.Latitude.data[y+1] > Latitude.max){
                this.Latitude.range.max = y;
            }
        }
    }
}
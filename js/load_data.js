/**
 * Created by vizlab on 15/03/25.
 */

//ユーザの入力は緯度、経度だけどopendapへのアクセスは0,1,2...で行う
//この変換を行う関数を作る

var LatLon = new setLatLon_func();

var TimeArray = new Array();

function loadTimeArray()
{
    var data = new XMLHttpRequest();
    data.open("GET","./js/data/time_ascii", false);  //true:非同期, false:同期
    data.send(null);
    var LF = String.fromCharCode(10); //改行ｺｰﾄﾞ
    var lines = data.responseText.split(LF);
    for(var i=0;i<lines.length;i++){
        TimeArray.push(lines[i]);
    }
    return 0;
}

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

//opendapURLに0,441と指定すると0から441まで合計442の数取ってくる
//だからデータを入れるときはarg_x_end-arg_x_start+1にしないといけない

function loadMOVEdata(arg_time, arg_depth, arg_y_start, arg_y_end, arg_x_start, arg_x_end, arg_string)
{
    var MOVEdata={};
    if(DEBUG==1) {
        console.log("load_data start\n");
    }
    var dap_line = "http://hyperinfo.viz.media.kyoto-u.ac.jp/~futami/dias/MOVE-RA2014.dods?";
    dap_line+=arg_string;
    dap_line+="[" + arg_time + "]";
    dap_line+="[" + arg_depth + "]";
    dap_line+="[" + arg_y_start + ":" + arg_y_end + "]";
    dap_line+="[" + arg_x_start + ":" + arg_x_end + "]";
    if(DEBUG == 1) {
        console.log(dap_line);
    }
    return jqdap.loadData(dap_line,{withCredentials:true})
        .then(function(tmp_T)
        {
            //loadしたデータは扱いづらいので並び替える
            //MOVEdata.dataの初期化
            if(DEBUG==1) {
                console.log(tmp_T);
            }
            MOVEdata.time = arg_time;
            MOVEdata.time_string = tmp_T[0][1];
            MOVEdata.depth = arg_depth;
            MOVEdata.type = arg_string;
            MOVEdata.data = new Array(arg_y_end-arg_y_start+1);
            for(var i=0;i<arg_y_end-arg_y_start+1;i++){
                MOVEdata.data[i] = new Array(arg_x_end-arg_x_start+1);
            }

            for(y=0;y<arg_y_end-arg_y_start+1;y++){
                for(x=0;x<arg_x_end-arg_x_start+1;x++){
                    MOVEdata.data[y][x] = tmp_T[0][0][0][0][y][x];
                }
            }
            return(MOVEdata);
        }
    );
}

//jqdapからロードしたデータ
//MOVEデータなので入っているのは日本全体
//data[5]になっている
//data[0],data[1],data[2]はlength=1
//data[0][1]には時刻が入っているけれど、必ず"2000-09-03T00:00:00Z"
//data[0][2]は何かわからないけど数字がひとつ入る

//data[0][3]には緯度
//data[0][4]には経度

//data[0][0][0][y][x]はデータ

//T_data[0][0][0][y][x]の場合、陸地は負になっている

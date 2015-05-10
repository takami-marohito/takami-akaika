/**
 * Created by vizlab on 15/03/25.
 */

//ユーザの入力は緯度、経度だけどopendapへのアクセスは0,1,2...で行う
//この変換を行う関数を作る


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

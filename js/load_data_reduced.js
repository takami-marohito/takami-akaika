/**
 * Created by vizlab on 2015/12/16.
 */

//ユーザの入力は緯度、経度だけどopendapへのアクセスは0,1,2...で行う
//この変換を行う関数を作る

//http://hyperinfo.viz.media.kyoto-u.ac.jp/~futami/dias/MOVE-RA2014.dasとddsにいろいろ書いてある。

//http://hyperinfo.viz.media.kyoto-u.ac.jp/~futami/dias/MOVE-RA2014.dods?time のデータを2006年3月までローカルに保存した

//opendapURLに0,441と指定すると0から441まで合計442の数取ってくる
//だからデータを入れるときはarg_x_end-arg_x_start+1にしないといけない

//MOVEデータを取得する時に値が0になる時がある
//エラーが返ってきてるか確認してないから、とりあえず動かすために
//返ってきた配列がある程度以上0で埋まってる場合はエラーとみなした

function loadMOVEdataReduced(arg_time, arg_depth, arg_y_start, arg_y_end, arg_x_start, arg_x_end, arg_string)
{
    var checkMiss = 0;
    var MOVEdata={};
    if(DEBUG==1) {
        //console.log("load_data start\n");
    }
    //var dap_line = "http://dias-tb2.tkl.iis.u-tokyo.ac.jp:10080/dods/secret/MOVE-RA2014.dods?";
    var dap_line = "http://hyperinfo.viz.media.kyoto-u.ac.jp/~futami/dias/MOVE-RA2014.dods?";
    //var dap_line = "http://dias-tb2.tkl.iis.u-tokyo.ac.jp:10080/thredds/dodsC/DIAS/MOVE-RA2014.dods?";
    dap_line+=arg_string;
    dap_line+="[" + arg_time + "]";
    dap_line+="[" + arg_depth + "]";
    dap_line+="[" + arg_y_start + ":" + arg_y_end + "]";
    dap_line+="[" + arg_x_start + ":" + arg_x_end + "]";
    if(DEBUG == 1) {
        //console.log(dap_line);
    }
    return jqdap.loadData(dap_line,{withCredentials:true})
        .then(function(tmp_T)
        {
            //loadしたデータは扱いづらいので並び替える
            //MOVEdata.dataの初期化
            if(DEBUG==1) {
                //console.log(tmp_T);
            }
            MOVEdata.time = arg_time;
            MOVEdata.time_string = tmp_T[0][1];
            MOVEdata.depth = arg_depth;
            MOVEdata.type = arg_string;
            MOVEdata.data = new Array(442);
            for(var i=0;i<442;i++){
                MOVEdata.data[i] = new Array(673);
                for(var j=0;j<673;j++){
                    MOVEdata.data[i][j] = 0;
                }
            }

            for(y=arg_y_start;y<arg_y_end+1;y++){
                for(x=arg_x_start;x<arg_x_end+1;x++){
                    MOVEdata.data[y][x] = tmp_T[0][0][0][0][y-arg_y_start][x-arg_x_start];
                    if(MOVEdata.data[y][x] == 0) {
                        checkMiss++;
                    }
                }
            }
            if(checkMiss > (arg_y_end-arg_y_start)*(arg_x_end-arg_x_start)){
                console.log("0 error");
                return(loadMOVEdataReduced(arg_time, arg_depth, arg_y_start, arg_y_end, arg_x_start, arg_x_end, arg_string));
            }
            return(MOVEdata);
        },
        function(er){
            return(loadMOVEdataReduced(arg_time, arg_depth, arg_y_start, arg_y_end, arg_x_start, arg_x_end, arg_string));
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

/**
 * Created by vizlab on 2015/04/13.
 */

var VortexRotation_matrix = new Array();
const EARTH_RADIUS = 6378150; //meter

function VortexRotation(Time, Depth, Range)
{
    var Time_backward=Range;

    //var VortexRotation_matrix = new Array();

    for(var i=0;i<Time_backward;i++){
        VortexRotation_matrix[i] = {};
        VortexRotation_matrix[i].data = new Array();
        VortexRotation_matrix[i].u = {};
        VortexRotation_matrix[i].v = {};
        VortexRotation_matrix[i].w = {};
        VortexRotation_matrix[i].vortex_type = new Array();
    }

    var dfds = [];

    for(var i=0;i<Time_backward;i++){
        if(Time-i==0){
            break;
        }
        dfds.push(loadMOVEdata(Time-i, Depth, 0, 441, 0, 672, "U"));
        dfds.push(loadMOVEdata(Time-i, Depth, 0, 441, 0, 672, "V"));
        dfds.push(loadMOVEdata(Time-i, Depth, 0, 441, 0, 672, "W"));
    }

    return jQuery.when.apply(
        $,dfds
    ).then(function () {
            /*
            var m=moment('2000/02/28', "YYYY/MM/DD");
            m.add( 2,'days').format();
            console.log(m);*/

            for(var i=0;i<Time_backward;i++) {
                VortexRotation_matrix[i].u = arguments[i*3+0];
                VortexRotation_matrix[i].v = arguments[i*3+1];
                VortexRotation_matrix[i].w = arguments[i*3+2];
                VortexRotation_matrix[i].time = Time-i;
                VortexRotation_matrix[i].depth = Depth;
                VortexRotation_matrix[i].width = arguments[i*3+0].data[0].length;
                VortexRotation_matrix[i].height = arguments[i*3+0].data.length;
                VortexRotation_matrix[i].data = new Array(VortexRotation_matrix.height);
            }
            //returnObject Init
            var returnObject = {};
            returnObject.data = new Array(VortexRotation_matrix[0].u.data.length);
            for(var i=0;i<returnObject.data.length;i++){
                returnObject.data[i] = new Array(VortexRotation_matrix[0].u.data[0].length);
            }

            for(var j=0;j<returnObject.data.length;j++){
                for(var i=0;i<returnObject.data[0].length;i++){
                    returnObject.data[j][i] = 0;
                }
            }

            //init PathLine, PathLine starts from Grid Point.
            var PathLine = [];
            var PathLine_InitPosition = new Array(VortexRotation_matrix[0].u.data.length);
            for(var i=0;i<PathLine_InitPosition.length;i++){
                PathLine_InitPosition[i] = new Array(VortexRotation_matrix[0].u.data[0].length);
            }
            for(var i=0;i<VortexRotation_matrix[0].u.data.length;i++) {
                for (var j = 0; j < VortexRotation_matrix[0].u.data[0].length; j++) {
                    var pos = {};
                    pos.x = LatLon.Longitude.data[j];
                    pos.y = LatLon.Latitude.data[i];
                    PathLine_InitPosition[i][j] = new THREE.Vector3(pos.x,pos.y,0);
                }
            }
            PathLine[0] = PathLine_InitPosition;
            //console.log(PathLine);

            if(Time_backward < 2) {
                console.log("Time Range is too narrow to calc turning angle.");
            }else {

                for (var t = 0; t < Time_backward-2; t++) {
                    returnObject.data = CalcTurningAngle(returnObject.data,PathLine,t);
                }
            }


            //lineの配列を用意  配列の要素数は引きたい線の数（折れ線も一本で書ける）
            var lineNum = 1;
            returnObject.line = new Array(lineNum);
            for(var i=0;i<lineNum;i++) {
                returnObject.line[i] = new THREE.Geometry();
            }

            //lineの座標を設定
            for(var i=0;i<lineNum;i++){
                returnObject.line[i].vertices.push(LatLonToMapGrid_Vector3( 116.9, 14.9 ));
                returnObject.line[i].vertices.push(LatLonToMapGrid_Vector3( 156.94, 51.12 ));
                returnObject.line[i].vertices.push(LatLonToMapGrid_Vector3( 200.25, 65.08 ));
            }
            return returnObject;
        });
}

//calc turning angle from lat lon.
//この関数は時間方向にループさせるので、出力は+=されていく
//time は0からtime_backward-2まで
function CalcTurningAngle(beforeTurningAngle,pathline,time)
{
    //Javascriptはすべてポインタだった気がする->同じオブジェクトを上書きしていくと計算途中でtではなくt+1のデータになりそう->DeepCopyした
    var TurningAngle = new Array(beforeTurningAngle.length);
    for(var i=0;i<TurningAngle.length;i++){
        TurningAngle[i] = new Array(beforeTurningAngle[0].length);
    }
    for(var i=0;i<beforeTurningAngle.length;i++){
        for(var j=0;j<beforeTurningAngle[0].length;j++){
            TurningAngle[i][j] = beforeTurningAngle[i][j];
        }
    }

    var PathLine_UpdatePosition = new Array(VortexRotation_matrix[0].u.data.length);
    for(var i=0;i<PathLine_UpdatePosition.length;i++){
        PathLine_UpdatePosition[i] = new Array(VortexRotation_matrix[0].u.data[0].length);
    }

    for(var i=0;i<VortexRotation_matrix[0].u.data.length;i++){
        for(var j=0;j<VortexRotation_matrix[0].u.data[0].length;j++){
            if(VortexRotation_matrix[0].u.data[i][j] < -1e+32) {
                TurningAngle[i][j] += 0;  //陸地
            }else {
                var position = new Array(3);
                var velocity = new Array(3);

                position[0] = new THREE.Vector3(pathline[time][i][j].x, pathline[time][i][j].y,0);
                velocity[0] = interpolateVelocity(position[0], time);
                position[1] = beforePosition(position[0], velocity[0]);
                velocity[1] = interpolateVelocity(position[1], time + 1);
                position[2] = beforePosition(position[1], velocity[1]);

                var vec1 = new THREE.Vector3();
                var vec2 = new THREE.Vector3();
                vec1.subVectors(position[1],position[0]);
                vec2.subVectors(position[2],position[1]);
                var crossed = new THREE.Vector3();

                //vec1.angleTo(vec2)は必ず正で0から3.14までとる
                if(vec1.length() != 0 && vec2.length() != 0){
                    crossed.crossVectors(vec1,vec2);
                    if(crossed.z>0){
                        TurningAngle[i][j] += vec1.angleTo(vec2);
                    }
                    if(crossed.z<0){
                        TurningAngle[i][j] -=vec1.angleTo(vec2);
                    }
                }
                //rad -> 回転数にする
                TurningAngle[i][j] = TurningAngle[i][j] / (2*Math.PI);

                PathLine_UpdatePosition[i][j] = new THREE.Vector3(position[1].x, position[1].y,0);
                //TurningAngle[i][j] += VortexRotation_matrix[0].u.data[i][j];
            }
            if(LatLon.Latitude.data[i] == 48.650001525747906){
                //console.log(TurningAngle[i][j]);
            }
        }
       // console.log(TurningAngle[i][400]);
    }
    pathline.push(PathLine_UpdatePosition);
    return(TurningAngle);
}

//入力:緯度経度、速度cm/s
//オイラー法
function beforePosition(position, velocity)
{
    u_back = velocity.u * (-1);  //時間をさかのぼるので-1をかける
    u_back_day = u_back * 60.0 * 60.0 * 24.0 / 100.0; //u_back はcm/s これを m/dayにする
    MeterCircumferenceLon = EARTH_RADIUS*Math.cos(position.y)*2*Math.PI;  //circumference of earth at the longitude of the position.
    MeterPerDegLon = MeterCircumferenceLon / 360.0; //meter per degree of longitude at the position.
    lon_velocity_deg = u_back_day / MeterPerDegLon;
    var x = position.x + lon_velocity_deg * 1.0;  // position(t-1) = position(t) + deg/day * 1.0

    v_back = velocity.v * (-1);
    v_back_day = v_back * 60.0 * 60.0 * 24.0 / 100.0;
    MeterCircumferenceLat = EARTH_RADIUS*2*Math.PI;
    MeterPerDegLat = MeterCircumferenceLat / 360.0;
    lat_velocity_deg = v_back_day / MeterPerDegLat;
    var y = position.y + lat_velocity_deg * 1.0;

    return(new THREE.Vector3(x,y,0));
}

function interpolateVelocity(position,time)
{
    if(LatLon.Latitude.data[LatLon.Latitude.data.length-1] < position.y || LatLon.Latitude.data[0] > position.y){
        //console.log("this latitude is out of range.");
        var u = -9.989999710577421e+33;
        var v = -9.989999710577421e+33;
        return({u:u,v:v})
    }
    if(LatLon.Longitude.data[LatLon.Longitude.data.length-1] < position.x || LatLon.Longitude.data[0] > position.x){
        //console.log("this longitude is out of MOVE data range.");
        var u = -9.989999710577421e+33;
        var v = -9.989999710577421e+33;
        return({u:u,v:v})
    }
    //陸地は速度が -9.9e+33になる->速度0にする

    //Gridは等間隔でないのでひとつずつ見ていく必要があるはず
    var array_x;
    for(var x=0;x<LatLon.Longitude.data.length-1;x++){
        if(LatLon.Longitude.data[x] <= position.x && LatLon.Longitude.data[x+1] > position.x ){
            array_x = x;
        }
    }
    if(position.x == LatLon.Longitude.data[LatLon.Longitude.data.length-1]){
        array_x = LatLon.Longitude.data.length-1;
    }

    var array_y;
    for(var y=0;y<LatLon.Latitude.data.length-1;y++){
        if(LatLon.Latitude.data[y] <= position.y && LatLon.Latitude.data[y+1] > position.y){
            array_y = y;
        }
    }
    if(position.y == LatLon.Latitude.data[LatLon.Latitude.data.length-1]){
        array_y = LatLon.Latitude.data.length-1;
    }

    //格子点上の場合
    if(LatLon.Longitude.data[array_x] == position.x && LatLon.Latitude.data[array_y] == position.y){
        var u = VortexRotation_matrix[time].u.data[array_y][array_x];
        var v = VortexRotation_matrix[time].v.data[array_y][array_x];
        return({u:u,v:v});
    }

    var u_00 = VortexRotation_matrix[time].u.data[array_y+1][array_x];
    var u_01 = VortexRotation_matrix[time].u.data[array_y+1][array_x+1];
    var u_10 = VortexRotation_matrix[time].u.data[array_y][array_x];
    var u_11 = VortexRotation_matrix[time].u.data[array_y][array_x+1];

    var u_00_position = new THREE.Vector2(LatLon.Longitude.data[array_x], LatLon.Latitude.data[array_y+1]);
    var u_01_position = new THREE.Vector2(LatLon.Longitude.data[array_x+1], LatLon.Latitude.data[array_y+1]);
    var u_10_position = new THREE.Vector2(LatLon.Longitude.data[array_x], LatLon.Latitude.data[array_y]);
    var u_11_position = new THREE.Vector2(LatLon.Longitude.data[array_x+1], LatLon.Latitude.data[array_y]);

    var u_numerator = u_00/u_00_position.distanceTo(position) + u_01/u_01_position.distanceTo(position) + u_10/u_10_position.distanceTo(position) + u_11/u_11_position.distanceTo(position);
    var u_denominator = 1.0/u_00_position.distanceTo(position) + 1.0/u_01_position.distanceTo(position) + 1.0/u_10_position.distanceTo(position) + 1.0/u_11_position.distanceTo(position);

    var u = u_numerator/u_denominator;

    var v_00 = VortexRotation_matrix[time].v.data[array_y+1][array_x];
    var v_01 = VortexRotation_matrix[time].v.data[array_y+1][array_x+1];
    var v_10 = VortexRotation_matrix[time].v.data[array_y][array_x];
    var v_11 = VortexRotation_matrix[time].v.data[array_y][array_x+1];

    var v_00_position = new THREE.Vector2(LatLon.Longitude.data[array_x], LatLon.Latitude.data[array_y+1]);
    var v_01_position = new THREE.Vector2(LatLon.Longitude.data[array_x+1], LatLon.Latitude.data[array_y+1]);
    var v_10_position = new THREE.Vector2(LatLon.Longitude.data[array_x], LatLon.Latitude.data[array_y]);
    var v_11_position = new THREE.Vector2(LatLon.Longitude.data[array_x+1], LatLon.Latitude.data[array_y]);

    var v_numerator = v_00/v_00_position.distanceTo(position) + v_01/v_01_position.distanceTo(position) + v_10/v_10_position.distanceTo(position) + v_11/v_11_position.distanceTo(position);
    var v_denominator = 1.0/v_00_position.distanceTo(position) + 1.0/v_01_position.distanceTo(position) + 1.0/v_10_position.distanceTo(position) + 1.0/v_11_position.distanceTo(position);

    var v = v_numerator/v_denominator;

    return({u:u,v:v});
}

//latは緯度で南北方向、lonは経度で東西方向
function LatLonToMapGrid_Vector3(lon,lat)
{
    var vector = new THREE.Vector3();
    if(LatLon.Latitude.data[LatLon.Latitude.data.length-1] < lat || LatLon.Latitude.data[0] > lat){
        console.log("line vertex has latitude that is out of range.");
        return vector;
    }
    if(LatLon.Longitude.data[LatLon.Longitude.data.length-1] < lon || LatLon.Longitude.data[0] > lon){
        console.log("line vertex has Longitude that is out of range.");
        return vector;
    }
    vector = new THREE.Vector3(lon*10.0,lat*10.0, 50);
    return vector;
}
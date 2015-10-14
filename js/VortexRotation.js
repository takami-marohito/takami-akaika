/**
 * Created by vizlab on 2015/04/13.
 */

var VortexRotation_matrix = {};

VortexRotation_matrix.data = new Array();
VortexRotation_matrix.u = {};
VortexRotation_matrix.v = {};
VortexRotation_matrix.w = {};
VortexRotation_matrix.vortex_type = new Array();

var returnObject = {};
const EARTH_RADIUS = 6378150; //meter
const VELOCITY_NAN =-9.989999710577421e+33;
//const VELOCITY_NAN =0;
var position =[];
var velocity = [];

var loop_counter=0;

var lineNum = 10;

function GetPointData()
{
    var dfds = [];
    var dep = 10;

    if(CPUE_Position == undefined){
        console.log("At first, loding cpue data");
        return;
    }

return;



    console.log(CPUE_Position);

    var t =  DateToArrayNum(document.getElementById("SecondInvariantDate_input").value);
    for(var i=0;i<dep;i++) {
        dfds.push(loadMOVEdata(t , i, 0, 441, 0, 672, "U"));
        dfds.push(loadMOVEdata(t , i, 0, 441, 0, 672, "V"));
        dfds.push(loadMOVEdata(t , i, 0, 441, 0, 672, "W"));
        dfds.push(loadMOVEdata(t , i, 0, 441, 0, 672, "T"));
        dfds.push(loadMOVEdata(t , i, 0, 441, 0, 672, "S"));
    }
    return jQuery.when.apply(
        $,dfds
    ).then(function () {
            var retObject = new Array(CPUE_Value.length);
            for(var i=0;i<CPUE_Value.length;i++){
                retObject[i] = new Array(dep*5);
            }

            for(var i=0;i<CPUE_Value.length;i++) {
                var pos = {x: CPUE_Position[i].x, y: CPUE_Position[i].y};
                for (var j = 0; j < dep; j++) {
                    for (var k = 0; k < 5; k++) {
                        retObject[i][j*5+k] = interpolateVariable(arguments[5 * j + k], pos);
                    }

                }
            }

            var OutputString = new Array();
            for(var i=0;i<CPUE_Value.length;i++){
                for(var j=0;j<retObject[0].length;j++){
                    OutputString += String(retObject[i][j]);
                    if(j != retObject[0].length-1) {
                        OutputString += ",";
                    }
                    if(j == retObject[0].length-1){
                        OutputString += '\n';
                    }
                }
            }

            var blob = new Blob([OutputString], {type: 'text/plain'});
            var link = document.createElement("a");
            filenameString = "input" ;
            link.download = filenameString;
            link.href = URL.createObjectURL(blob);
            link.click();

            OutputString = new Array();
            for(var i=0;i<CPUE_Value.length;i++){
                OutputString += String(CPUE_Value[i]);
                if(i!=CPUE_Value.length-1){
                    OutputString += '\n';
                }
            }
            blob = new Blob([OutputString], {type: 'text/plain'});
            link = document.createElement("a");
            filenameString = "y" ;
            link.download = filenameString;
            link.href = URL.createObjectURL(blob);
            link.click();

        });
}


function interpolateVariable(arg,position)
{
    if(LatLon.Latitude.data[LatLon.Latitude.data.length-1] < position.y || LatLon.Latitude.data[0] > position.y){
        //console.log("this latitude is out of range.");
        return(0)
    }
    if(LatLon.Longitude.data[LatLon.Longitude.data.length-1] < position.x || LatLon.Longitude.data[0] > position.x){
        //console.log("this longitude is out of MOVE data range.");
        return(0);
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
        var u = arg.data[array_y][array_x];

        return(u);
    }

    function mix( x, y, a )
    {
        return( (1-a)*x + a*y);
    }

    var p0 = new THREE.Vector2(LatLon.Longitude.data[array_x], LatLon.Latitude.data[array_y]);
    var p1 = new THREE.Vector2(LatLon.Longitude.data[array_x+1], LatLon.Latitude.data[array_y+1]);

    var x = position.x;
    var y = position.y;
    var x0 = p0.x;
    var x1 = p1.x;
    var y0 = p0.y;
    var y1 = p1.y;
    var s = ( x - x0 ) / ( x1 - x0 );
    var t = ( y - y0 ) / ( y1 - y0 );

    var u_00 = arg.data[array_y][array_x];
    var u_01 = arg.data[array_y][array_x+1];
    var u_10 = arg.data[array_y+1][array_x];
    var u_11 = arg.data[array_y+1][array_x+1];
    if(u_00 < -1.0e+10){
        u_00 = 0;
    }
    if(u_01 < -1.0e+10){
        u_01 = 0;
    }
    if(u_10 < -1.0e+10){
        u_10 = 0;
    }
    if(u_11 < -1.0e+10){
        u_11 = 0;
    }
    var u0 = mix( u_00, u_10, t );
    var u1 = mix( u_01, u_11, t );
    var u = mix( u0, u1, s );

    return(u);
}

function VortexRotation(Time, Depth, Range)
{
    loop_counter++;
    var target = document.getElementById("button_exec");
    target.innerHTML = loop_counter;

    var dfds = [];

    dfds.push(loadMOVEdata(Time-1, Depth, 0, 441, 0, 672, "U"));
    dfds.push(loadMOVEdata(Time-1, Depth, 0, 441, 0, 672, "V"));
    dfds.push(loadMOVEdata(Time-1, Depth, 0, 441, 0, 672, "W"));
    if(loop_counter==1){
        dfds.push(loadMOVEdata(Time, Depth, 0, 441, 0, 672, "U"));
        dfds.push(loadMOVEdata(Time, Depth, 0, 441, 0, 672, "V"));
        dfds.push(loadMOVEdata(Time, Depth, 0, 441, 0, 672, "W"));
    }

    return jQuery.when.apply(
        $,dfds
    ).then(function () {
            VortexRotation_matrix.u = arguments[0];
            VortexRotation_matrix.v = arguments[1];
            VortexRotation_matrix.w = arguments[2];
            VortexRotation_matrix.time = Time;
            VortexRotation_matrix.depth = Depth;
            VortexRotation_matrix.width = arguments[0].data[0].length;
            VortexRotation_matrix.height = arguments[0].data.length;
            VortexRotation_matrix.data = new Array(VortexRotation_matrix.height);

            if(loop_counter==1){
                InitObjects(arguments);
            }

            returnObject.data = CalcTurningAngle();

            //CPUEが設定されているなら、遡って計算する
            if(CPUE_Position!=null) {
                //lineの座標を設定
                for (var i = 0; i < lineNum; i++) {
                    var cpue_velocity = interpolateVelocity(CPUE_Position[i]);
                    CPUE_Position[i] = beforePosition(CPUE_Position[i], cpue_velocity);
                    returnObject.line[i].vertices.push(LatLonToMapGrid_Vector3(CPUE_Position[i].x, CPUE_Position[i].y));
                }
            }

            var inputlonlat = new Array();
            inputlonlat.push(new THREE.Vector2(142.37, 37.67));
            var array_x,array_y;
            var inputxy = new Array();

            for (var i = 0; i < inputlonlat.length; i++) {
                //Gridは等間隔でないのでひとつずつ見ていく必要があるはず
                for (var x = 0; x < LatLon.Longitude.data.length - 1; x++) {
                    if (LatLon.Longitude.data[x] <= inputlonlat[i].x && LatLon.Longitude.data[x + 1] > inputlonlat[i].x) {
                        array_x = x;
                    }
                }
                if (inputlonlat[i].x == LatLon.Longitude.data[LatLon.Longitude.data.length - 1]) {
                    array_x = LatLon.Longitude.data.length - 1;
                }

                for (var y = 0; y < LatLon.Latitude.data.length - 1; y++) {
                    if (LatLon.Latitude.data[y] <= inputlonlat[i].y && LatLon.Latitude.data[y + 1] > inputlonlat[i].y) {
                        array_y = y;
                    }
                }
                if (inputlonlat[i].y == LatLon.Latitude.data[LatLon.Latitude.data.length - 1]) {
                    array_y = LatLon.Latitude.data.length - 1;
                }
                //console.log("("+inputlonlat[i].x+","+inputlonlat[i].y+") = "+returnObject.data[array_y][array_x]);
            }
            if (Range > 1)  {
                return VortexRotation(Time-1,Depth,Range-1);
            } else {
                postProcessing();
                loop_counter =0;
                return returnObject;
            }
        });
}

//calc turning angle from lat lon.
//この関数は時間方向にループさせるので、出力は+=されていく
//time は0からtime_backward-2まで
function CalcTurningAngle()
{
    //Javascriptはすべてポインタだった気がする->同じオブジェクトを上書きしていくと計算途中でtではなくt+1のデータになりそう->DeepCopyした
    var TurningAngle = new Array(returnObject.data.length);
    for(var i=0;i<TurningAngle.length;i++){
        TurningAngle[i] = new Array(returnObject.data[0].length);
    }
    for(var i=0;i<returnObject.data.length;i++){
        for(var j=0;j<returnObject.data[0].length;j++){
            TurningAngle[i][j] = returnObject.data[i][j];
        }
    }

    for(var i=0;i<VortexRotation_matrix.height;i++) {
        for (var j = 0; j < VortexRotation_matrix.width; j++) {
            position[0][i][j].copy(position[1][i][j]);
            velocity[0][i][j].copy(velocity[1][i][j]);
            position[1][i][j].copy(position[2][i][j]);
            velocity[1][i][j].copy(velocity[2][i][j]);
            velocity[2][i][j] = velocity[3][i][j];
        }
    }


    for(var i=0;i<VortexRotation_matrix.height;i++){
        for(var j=0;j<VortexRotation_matrix.width;j++) {

            if (VortexRotation_matrix.u.data[i][j] < -1e+32) {
                TurningAngle[i][j] += 0;  //陸地
            }else {
                position[2][i][j] = beforePosition(position[1][i][j],velocity[1][i][j]);
                velocity[3][i][j] = interpolateVelocity(position[2][i][j]);

                if (position[0][i][j].x > 360 || position[0][i][j].y > 360) {
                    continue;
                }

                var vec1 = new THREE.Vector3();
                var vec2 = new THREE.Vector3();
                vec1.subVectors(position[1][i][j],position[0][i][j]);
                vec2.subVectors(position[2][i][j],position[1][i][j]);
                var crossed = new THREE.Vector3();

                //vec1.angleTo(vec2)は必ず正で0から3.14までとる
                if(vec1.length() != 0 && vec2.length() != 0){
                    crossed.crossVectors(vec1,vec2);
                    if(crossed.z>0){
                        TurningAngle[i][j] += vec1.angleTo(vec2) / (2*Math.PI);
                    }
                    if(crossed.z<0){
                        TurningAngle[i][j] -=vec1.angleTo(vec2) / (2*Math.PI);
                    }
                }
            }
        }
    }
    return(TurningAngle);
}

//入力:緯度経度、速度cm/s
//オイラー法
function beforePosition(position, velocity)
{
    u_back = velocity.x * (-1);  //時間をさかのぼるので-1をかける
    u_back_day = u_back * 60.0 * 60.0 * 24.0 / 100.0; //u_back はcm/s これを m/dayにする
    MeterCircumferenceLon = EARTH_RADIUS*Math.cos(position.y/180*Math.PI)*2*Math.PI;  //circumference of earth at the longitude of the position.
    MeterPerDegLon = MeterCircumferenceLon / 360.0; //meter per degree of longitude at the position.
    lon_velocity_deg = u_back_day / MeterPerDegLon;
    var x = position.x + lon_velocity_deg * 1.0;  // position(t-1) = position(t) + deg/day * 1.0

    v_back = velocity.y * (-1);
    v_back_day = v_back * 60.0 * 60.0 * 24.0 / 100.0;
    MeterCircumferenceLat = EARTH_RADIUS*2*Math.PI;
    MeterPerDegLat = MeterCircumferenceLat / 360.0;
    lat_velocity_deg = v_back_day / MeterPerDegLat;
    var y = position.y + lat_velocity_deg * 1.0;

    return(new THREE.Vector3(x,y,0));
}

function interpolateVelocity(position)
{
    if(LatLon.Latitude.data[LatLon.Latitude.data.length-1] < position.y || LatLon.Latitude.data[0] > position.y){
        //console.log("this latitude is out of range.");
        var u = 0;
        var v = 0;
        return({x:u,y:v})
    }
    if(LatLon.Longitude.data[LatLon.Longitude.data.length-1] < position.x || LatLon.Longitude.data[0] > position.x){
        //console.log("this longitude is out of MOVE data range.");
        var u = 0;
        var v = 0;
        return({x:u,y:v})
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
        var u = VortexRotation_matrix.u.data[array_y][array_x];
        var v = VortexRotation_matrix.v.data[array_y][array_x];
        return({x:u,y:v});
    }

    function mix( x, y, a )
    {
        return( (1-a)*x + a*y);
    }

    var p0 = new THREE.Vector2(LatLon.Longitude.data[array_x], LatLon.Latitude.data[array_y]);
    var p1 = new THREE.Vector2(LatLon.Longitude.data[array_x+1], LatLon.Latitude.data[array_y+1]);

    var x = position.x;
    var y = position.y;
    var x0 = p0.x;
    var x1 = p1.x;
    var y0 = p0.y;
    var y1 = p1.y;
    var s = ( x - x0 ) / ( x1 - x0 );
    var t = ( y - y0 ) / ( y1 - y0 );

    var u_00 = VortexRotation_matrix.u.data[array_y][array_x];
    var u_01 = VortexRotation_matrix.u.data[array_y][array_x+1];
    var u_10 = VortexRotation_matrix.u.data[array_y+1][array_x];
    var u_11 = VortexRotation_matrix.u.data[array_y+1][array_x+1];
    if(u_00 < -1.0e+10){
        u_00 = 0;
    }
    if(u_01 < -1.0e+10){
        u_01 = 0;
    }
    if(u_10 < -1.0e+10){
        u_10 = 0;
    }
    if(u_11 < -1.0e+10){
        u_11 = 0;
    }
    var u0 = mix( u_00, u_10, t );
    var u1 = mix( u_01, u_11, t );
    var u = mix( u0, u1, s );

    var v_00 = VortexRotation_matrix.v.data[array_y][array_x];
    var v_01 = VortexRotation_matrix.v.data[array_y][array_x+1];
    var v_10 = VortexRotation_matrix.v.data[array_y+1][array_x];
    var v_11 = VortexRotation_matrix.v.data[array_y+1][array_x+1];
    if(v_00 < -1.0e+10){
        v_00 = 0;
    }
    if(v_01 < -1.0e+10){
        v_01 = 0;
    }
    if(v_10 < -1.0e+10){
        v_10 = 0;
    }
    if(v_11 < -1.0e+10){
        v_11 = 0;
    }
    var v0 = mix( v_00, v_10, t );
    var v1 = mix( v_01, v_11, t );
    var v = mix( v0, v1, s );

    return({x:u,y:v});
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
    var map_lat = Latitude.min * 10.0;
    map_lat += FromLatToMapGrid(lat) - FromLatToMapGrid(Latitude.min);
    vector = new THREE.Vector3(lon*10.0, map_lat, ocean_z);
    return vector;
}

//渦の回転方向で正負が決まっていた->渦の強いところは青と赤の領域->わかりにくい->絶対値にする
function postProcessing()
{
    for(var i=0;i<returnObject.data.length;i++){
        for(var j=0;j<returnObject.data[0].length;j++){
            returnObject.data[i][j] = Math.abs(returnObject.data[i][j]);
        }
    }
}

function InitObjects(arguments)
{
    if(CPUE_Position!=null){
        lineNum = CPUE_Position.length;
    }
    InitPositionVelocity(arguments);
    InitReturnObject();
    if(CPUE_Position!=null){
        setInitCPUEPositionToLineObject();
    }
}

//ルンゲクッタ法を使うためには位置がn、速度がn+1必要
function InitPositionVelocity(arguments)
{
    for(var t=0;t<3;t++) {
        position[t] = new Array(VortexRotation_matrix.height);
        for (var i = 0; i <  position[t].length; i++) {
            position[t][i] = new Array(VortexRotation_matrix.width);
        }
        for (var i = 0; i < VortexRotation_matrix.height; i++) {
            for (var j = 0; j < VortexRotation_matrix.width; j++) {
                position[t][i][j] = new THREE.Vector3(500, 500, 0);  //CalcTurningAngle で(500,500)を使っているから、変えるときは気をつける
            }
        }
    }
    for(var t=0;t<4;t++) {
        velocity[t] = new Array(VortexRotation_matrix.height);
        for (var i = 0; i <  position[0].length; i++) {
            velocity[t][i] = new Array(VortexRotation_matrix.width);
        }
        for (var i = 0; i < VortexRotation_matrix.height; i++) {
            for (var j = 0; j < VortexRotation_matrix.width; j++) {
                velocity[t][i][j] = new THREE.Vector3(VELOCITY_NAN, VELOCITY_NAN, 0);
            }
        }
    }
    for (var i = 0; i < VortexRotation_matrix.height; i++) {
        for (var j = 0; j < VortexRotation_matrix.width; j++) {
            var pos = {};
            pos.x = LatLon.Longitude.data[j];
            pos.y = LatLon.Latitude.data[i];
            position[2][i][j] = new THREE.Vector3(pos.x, pos.y, 0);
            velocity[3][i][j] = new THREE.Vector3(VortexRotation_matrix.u.data[i][j], VortexRotation_matrix.v.data[i][j], 0);
            velocity[2][i][j] = new THREE.Vector3(arguments[3].data[i][j], arguments[4].data[i][j], 0);
        }
    }
}

function InitReturnObject()
{
    returnObject.data = new Array(VortexRotation_matrix.height);
    for (var i = 0; i < returnObject.data.length; i++) {
        returnObject.data[i] = new Array(VortexRotation_matrix.width);
    }

    for (var j = 0; j < returnObject.data.length; j++) {
        for (var i = 0; i < returnObject.data[0].length; i++) {
            returnObject.data[j][i] = 0;
        }
    }

    //lineの配列を用意  配列の要素数は引きたい線の数（折れ線も一本で書ける）
    returnObject.line = new Array(lineNum);
    for (var i = 0; i < lineNum; i++) {
        returnObject.line[i] = new THREE.Geometry();
    }

}

function setInitCPUEPositionToLineObject()
{
    for (var i = 0; i < lineNum; i++) {
        returnObject.line[i].vertices.push(LatLonToMapGrid_Vector3(CPUE_Position[i].x, CPUE_Position[i].y));
    }
}
/**
 * Created by vizlab on 2015/11/18.
 */

//引数のargはloadMOVEDataのreturnをそのまま入れる
//positionは.xと.yに緯度経度を入れる

function interpolateVariable(arg,position)
{
    var SelectedLat;
    var SelectedLon;
    if(arg.type == "U" || arg.type == "V" || arg.type == "W"){
        SelectedLat = LatLon.LatitudeU;
        SelectedLon = LatLon.LongitudeU;
    }
    if(arg.type == "S" || arg.type == "T"){
        SelectedLat = LatLon.LatitudeT;
        SelectedLon = LatLon.LongitudeT;
    }
    if(SelectedLat.data[SelectedLat.data.length-1] < position.y || SelectedLat.data[0] > position.y){
        //console.log("this latitude is out of range.");
        return(0)
    }
    if(SelectedLon.data[SelectedLon.data.length-1] < position.x || SelectedLon.data[0] > position.x){
        //console.log("this longitude is out of MOVE data range.");
        return(0);
    }
    //陸地は速度が -9.9e+33になる->速度0にする

    //Gridは等間隔でないのでひとつずつ見ていく必要があるはず
    var array_x;
    for(var x=0;x<SelectedLon.data.length-1;x++){
        if(SelectedLon.data[x] <= position.x && SelectedLon.data[x+1] > position.x ){
            array_x = x;
            //console.log(x);
        }
    }
    if(position.x == SelectedLon.data[SelectedLon.data.length-1]){
        array_x = SelectedLon.data.length-1;
    }

    var array_y;
    for(var y=0;y<SelectedLat.data.length-1;y++){
        if(SelectedLat.data[y] <= position.y && SelectedLat.data[y+1] > position.y){
            array_y = y;
            //console.log(y);
        }
    }
    if(position.y == SelectedLat.data[SelectedLat.data.length-1]){
        array_y = SelectedLat.data.length-1;
    }

    //格子点上の場合
    if(SelectedLon.data[array_x] == position.x && SelectedLat.data[array_y] == position.y){
        var u = arg.data[array_y][array_x];

        return(u);
    }

    function mix( x, y, a )
    {
        return( (1-a)*x + a*y);
    }

    var p0 = new THREE.Vector2(SelectedLon.data[array_x], SelectedLat.data[array_y]);
    var p1 = new THREE.Vector2(SelectedLon.data[array_x+1], SelectedLat.data[array_y+1]);

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
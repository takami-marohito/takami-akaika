/**
 * Created by vizlab on 2015/11/18.
 */
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
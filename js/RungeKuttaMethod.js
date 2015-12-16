/**
 * Created by vizlab on 2015/12/11.
 */


//RungeKutta法をRungeKuttaNumber-1回行う
//PointDataはpushをRungeKuttaNumber-1回行う

//東西と南北と深さ方向の流速はすべて、m/sの1/100スケール -> cm/s
// http://hyperinfo.viz.media.kyoto-u.ac.jp/~futami/dias/MOVE-RA2014.das
//に書いてある

//V {
//    String standard_name "northward_sea_water_velocity";
//    String long_name "meridional velocity";
//    String units "m s-1";
//    Float32 _FillValue -9.99E33;
//    Float32 scale_factor 0.01;
//}


//ここでは点の3次元位置と日付から一日前の5変数を求めて、returnする
//途中でRungeKuttaPointDataを更新する。

//CalculatingPathLine.jsは完成
//この関数ではRungeKuttaPointDataを更新
//RungeKuttaPointData[i][j][k] はi番目の点の深さjでk番目に計算された点の座標
//CalculatingPathLine.jsのBackwardCPUEPointはRungeKutta[i][k]の末尾の点を追加する

//アルゴリズムはhttp://hooktail.org/computer/index.php?Runge-Kutta%CB%A1を参考にした


//とりあえずRungeKuttaNumber = 1で計算する
//いまのところ、どのように指定しても一日に一回だけ計算する

var rungekutta_counter = 0;

function RungeKuttaMethod(CPUEDataArray,RungeKuttaPointData,input_point,input_datenum, datenumber, depthnumber, pointnumber,RungeKuttaNumber){
    //console.log("runge");
    if(rungekutta_counter == RungeKuttaNumber){
        return {s:10,t:11,u:12,v:13,w:14};
    }

    var k1u = returnNumberOfData("U",depthnumber,datenumber);
    var k1v = returnNumberOfData("V",depthnumber,datenumber);
    var k1w = returnNumberOfData("W",depthnumber,datenumber);

    var k1 = {u:CPUEDataArray[pointnumber][k1u],v:CPUEDataArray[pointnumber][k1v],w:CPUEDataArray[pointnumber][k1w]};

    var k1_location = input_point;
    var k2_location = calck2locationFromk1velocity(k1_location,k1);

    //console.log(k1_location);
    var d = returnNumberOfDepthFromDepth(k1_location.depth);

    var fn = [];
    fn.push(loadMOVEdata(input_datenum,d,0,441,0,672,"U"));
    fn.push(loadMOVEdata(input_datenum,d+1,0,441,0,672,"U"));
    fn.push(loadMOVEdata(input_datenum-1,d,0,441,0,672,"U"));
    fn.push(loadMOVEdata(input_datenum-1,d+1,0,441,0,672,"U"));
    fn.push(loadMOVEdata(input_datenum,d,0,441,0,672,"V"));
    fn.push(loadMOVEdata(input_datenum,d+1,0,441,0,672,"V"));
    fn.push(loadMOVEdata(input_datenum-1,d,0,441,0,672,"V"));
    fn.push(loadMOVEdata(input_datenum-1,d+1,0,441,0,672,"V"));
    fn.push(loadMOVEdata(input_datenum,d,0,441,0,672,"W"));
    fn.push(loadMOVEdata(input_datenum,d+1,0,441,0,672,"W"));
    fn.push(loadMOVEdata(input_datenum-1,d,0,441,0,672,"W"));
    fn.push(loadMOVEdata(input_datenum-1,d+1,0,441,0,672,"W"));

    return jQuery.when.apply(
        $, fn
    ).then(function () {
            //RungeKuttaPointData[pointnumber][depthnumber].push({lat:50,lon:60,depth:70});
            //return {s:10,t:11,u:12,v:13,w:14};
            //console.log(interpolateVariable(arguments[0],input_point));
            //console.log(interpolateVariable(arguments[4],input_point));
            var k2 = calck2(arguments,k2_location,d);
            var k3_location = calck2locationFromk1velocity(k1_location,k2);
            var k3 = calck2(arguments,k3_location,d);
            var k4_location = calck2locationFromk1velocity(k1_location,k3);
            k4_location = calck2locationFromk1velocity(k4_location,k3);  //二回やるとf(t+1)がつくれる
            var k4 = calck4(arguments,k4_location,d);
            var sum_k = {
                u:k1.u/6.0+k2.u/3.0+k3.u/3.0+k4.u/6.0,
                v:k1.v/6.0+k2.v/3.0+k3.v/3.0+k4.v/6.0,
                w:k1.w/6.0+k2.w/3.0+k3.w/3.0+k4.w/6.0
            };
            var return_location = calck2locationFromk1velocity(input_point,sum_k);
            return_location = calck2locationFromk1velocity(return_location,sum_k);
            //console.log(return_location);
            RungeKuttaPointData[pointnumber][depthnumber].push(return_location);
            var retobject = {s:0,t:0,u:0,v:0,w:0};
            var retdepthnumber = returnNumberOfDepthFromDepth(return_location.depth);
            var fn2 =[];
            fn2.push(loadMOVEdata(input_datenum-1,retdepthnumber,0,441,0,672,"S"));
            fn2.push(loadMOVEdata(input_datenum-1,retdepthnumber+1,0,441,0,672,"S"));
            fn2.push(loadMOVEdata(input_datenum-1,retdepthnumber,0,441,0,672,"T"));
            fn2.push(loadMOVEdata(input_datenum-1,retdepthnumber+1,0,441,0,672,"T"));
            fn2.push(loadMOVEdata(input_datenum-1,retdepthnumber,0,441,0,672,"U"));
            fn2.push(loadMOVEdata(input_datenum-1,retdepthnumber+1,0,441,0,672,"U"));
            fn2.push(loadMOVEdata(input_datenum-1,retdepthnumber,0,441,0,672,"V"));
            fn2.push(loadMOVEdata(input_datenum-1,retdepthnumber+1,0,441,0,672,"V"));
            fn2.push(loadMOVEdata(input_datenum-1,retdepthnumber,0,441,0,672,"W"));
            fn2.push(loadMOVEdata(input_datenum-1,retdepthnumber+1,0,441,0,672,"W"));
            return jQuery.when.apply(
                $, fn2
            ).then(function () {
                    var depth0 = returnNumberOfDepthFromDepthIntNumber(retdepthnumber);
                    var depth1 = returnNumberOfDepthFromDepthIntNumber(retdepthnumber+1);
                    var s10 = interpolateVariable(arguments[0],return_location);
                    var s11 = interpolateVariable(arguments[1],return_location);
                    var s1 = s10 + (return_location.depth - depth0) / (depth1-depth0) * (s11-s10);
                    var t10 = interpolateVariable(arguments[2],return_location);
                    var t11 = interpolateVariable(arguments[3],return_location);
                    var t1 = t10 + (return_location.depth - depth0) / (depth1-depth0) * (t11-t10);
                    var u10 = interpolateVariable(arguments[4],return_location);
                    var u11 = interpolateVariable(arguments[5],return_location);
                    var u1 = u10 + (return_location.depth - depth0) / (depth1-depth0) * (u11-u10);
                    var v10 = interpolateVariable(arguments[6],return_location);
                    var v11 = interpolateVariable(arguments[7],return_location);
                    var v1 = v10 + (return_location.depth - depth0) / (depth1-depth0) * (v11-v10);
                    var w10 = interpolateVariable(arguments[8],return_location);
                    var w11 = interpolateVariable(arguments[9],return_location);
                    var w1 = w10 + (return_location.depth - depth0) / (depth1-depth0) * (w11-w10);
                    retobject = {s:s1,t:t1,u:u1,v:v1,w:w1};
                    return retobject;
                },
                function(){
                    rungekutta_counter = 0;
                    console.log("timeout miss");
                    return RungeKuttaMethod(CPUEDataArray,RungeKuttaPointData,input_point,input_datenum, datenumber, depthnumber, pointnumber,RungeKuttaNumber);
                }
            );
        },
        function(){
            rungekutta_counter = 0;
            console.log("timeout miss");
            return RungeKuttaMethod(CPUEDataArray,RungeKuttaPointData,input_point,input_datenum, datenumber, depthnumber, pointnumber,RungeKuttaNumber);
            //失敗したら同じ関数をもう一度回す
        }
    );

    function calck4(arg,location,d){
        var depth0 = returnNumberOfDepthFromDepthIntNumber(d);
        var depth1 = returnNumberOfDepthFromDepthIntNumber(d+1);
        var u10 = interpolateVariable(arg[2],location);
        var u11 = interpolateVariable(arg[3],location);
        var u1 = u10 + (location.depth - depth0) / (depth1-depth0) * (u11-u10);
        var v10 = interpolateVariable(arg[6],location);
        var v11 = interpolateVariable(arg[7],location);
        var v1 = v10 + (location.depth - depth0) / (depth1-depth0) * (v11-v10);
        var w10 = interpolateVariable(arg[10],location);
        var w11 = interpolateVariable(arg[11],location);
        var w1 = w10 + (location.depth - depth0) / (depth1-depth0) * (w11-w10);
        ret = {u:u1,v:v1,w:w1};
        return ret;
    }

    function calck2(arg,location,d){
        var depth0 = returnNumberOfDepthFromDepthIntNumber(d);
        var depth1 = returnNumberOfDepthFromDepthIntNumber(d+1);
        var u00 = interpolateVariable(arg[0],location);
        var u01 = interpolateVariable(arg[1],location);
        var u0 = u00 + (location.depth - depth0) / (depth1-depth0) * (u01-u00);
        var u10 = interpolateVariable(arg[2],location);
        var u11 = interpolateVariable(arg[3],location);
        var u1 = u10 + (location.depth - depth0) / (depth1-depth0) * (u11-u10);
        var u = (u1+u0)/2.0;

        var v00 = interpolateVariable(arg[4],location);
        var v01 = interpolateVariable(arg[5],location);
        var v0 = v00 + (location.depth - depth0) / (depth1-depth0) * (v01-v00);
        var v10 = interpolateVariable(arg[6],location);
        var v11 = interpolateVariable(arg[7],location);
        var v1 = v10 + (location.depth - depth0) / (depth1-depth0) * (v11-v10);
        var v = (v1+v0)/2.0;

        var w00 = interpolateVariable(arg[8],location);
        var w01 = interpolateVariable(arg[9],location);
        var w0 = w00 + (location.depth - depth0) / (depth1-depth0) * (w01-w00);
        var w10 = interpolateVariable(arg[10],location);
        var w11 = interpolateVariable(arg[11],location);
        var w1 = w10 + (location.depth - depth0) / (depth1-depth0) * (w11-w10);
        var w = (w1+w0)/2.0;
        ret = {u:u,v:v,w:w};
        return ret;
    }

    //遡るので流速はマイナスになおして計算している
    function calck2locationFromk1velocity(location,velocity){
        var umeterperday = velocity.u * 60.0*60.0*24.0 /100.0;
        var vmeterperday = velocity.v * 60.0*60.0*24.0 /100.0;
        var wmeterperday = velocity.w * 60.0*60.0*24.0 /100.0;

        var MeterCircumferenceLon = EARTH_RADIUS*Math.cos(location.lat/180*Math.PI)*2*Math.PI;
        var MeterPerDegLon = MeterCircumferenceLon / 360.0;
        var udegperday = umeterperday / MeterPerDegLon;

        var MeterCircumferenceLat = EARTH_RADIUS*2*Math.PI;
        var MeterPerDegLat = MeterCircumferenceLat / 360.0;
        var vdegperday = vmeterperday / MeterPerDegLat;

        var ret = {lat:0,lon:0,depth:0};
        ret.lat = location.lat - 0.5*vdegperday;
        ret.lon = location.lon - 0.5*udegperday;
        ret.depth = location.depth - 0.5*wmeterperday ;
        return ret;
    }

    function calcMidVaribleMap(arg1,arg2){
        var ret = arg1;
        for(var i=0;i<arg1.data.length;i++){
            for(var j=0;j<arg1.data[0].length;j++){
                ret.data[i][j] = ret.data[i][j] + arg2.data[i][j];
                ret.data[i][j] = ret.data[i][j] / 2.0;
            }
        }
        return ret;
    }

    function MeterPerDay(arg,location){
        return interpolateVariable(arg,location);
    }

    function LatFromMeter(meter){
        return meter;
    }

    function LonFromMeter(meter){
        return meter;
    }

    function UpdateLatLonFromVelocity(RungeKuttaPointData,u,v,w,datenumber,depthnumber,pointnumber,nth){
        RungeKuttaPointData[pointnumber][depthnumber][datenumber*RungeKuttaNumber+nth] = {lat:0,lon:0,depth:0};
    }
}
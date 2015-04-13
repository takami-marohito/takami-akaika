/**
 * Created by vizlab on 2015/04/13.
 */

function VortexRotation(Time, Depth)
{
    console.log(LatLon.Latitude.data[LatLon.Latitude.data.length-1] - LatLon.Latitude.data[0]);
    console.log(LatLon.Longitude.data[LatLon.Longitude.data.length-1] - LatLon.Longitude.data[0]);
    var VortexRotation = {};
    VortexRotation.data = new Array();
    VortexRotation.u = {};
    VortexRotation.v = {};
    VortexRotation.w = {};
    VortexRotation.vortex_type = new Array();


    return jQuery.when(
        loadMOVEdata(Time, Depth, 0, 441, 0, 672, "U"),
        loadMOVEdata(Time, Depth, 0, 441, 0, 672, "V"),
        loadMOVEdata(Time, Depth, 0, 441, 0, 672, "W")
    ).then(function (data_u, data_v, data_w) {
            VortexRotation.u = data_u;
            VortexRotation.v = data_v;
            VortexRotation.w = data_w;
            VortexRotation.time = Time;
            VortexRotation.depth = Depth;
            VortexRotation.width = data_u.data[0].length;
            VortexRotation.height = data_u.data.length;
            VortexRotation.data = new Array(VortexRotation.height);
            VortexRotation.vortex_type = new Array(VortexRotation.height);

            var Tensor = {};
            for(var i=0;i<VortexRotation.height;i++){
                VortexRotation.data[i] = new Array(VortexRotation.width);
                VortexRotation.vortex_type[i] = new Array(VortexRotation.width);
            }
            for(var x=0;x<VortexRotation.width;x++){
                for(var y=0;y<VortexRotation.height;y++){
                    if(x<=vortex_size-1||x>=VortexRotation.width-vortex_size||y<=vortex_size-1||y>=VortexRotation.height-vortex_size){
                        Tensor = [[undefined,undefined],[undefined,undefined]];
                        VortexRotation.data[y][x] = -50;             //this process pretermits edge calculation.
                    }else{
                        Tensor = Calc_Tensor(x,y,VortexRotation);
                        VortexRotation.data[y][x] = Tensor[0][1]*Tensor[1][0] - Tensor[0][0]*Tensor[1][1];
                        //this.vortex[y][x] = vortex_type(Tensor);
                    }
                    VortexRotation.vortex_type[y][x] = vortex_type(Tensor);
                }
            }
            return VortexRotation;
        });
}
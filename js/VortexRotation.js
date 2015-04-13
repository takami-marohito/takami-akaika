/**
 * Created by vizlab on 2015/04/13.
 */

function VortexRotation(Time, Depth)
{
    var Time_backward=5;

    var VortexRotation = new Array();

    for(var i=0;i<Time_backward;i++){
        VortexRotation[i] = {};
        VortexRotation[i].data = new Array();
        VortexRotation[i].u = {};
        VortexRotation[i].v = {};
        VortexRotation[i].w = {};
        VortexRotation[i].vortex_type = new Array();
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
            for(var i=0;i<Time_backward*3;i++) {
                VortexRotation[i].u = arguments[i*3+0];
                VortexRotation[i].v = arguments[i*3+1];
                VortexRotation[i].w = arguments[i*3+2];
                VortexRotation[i].time = Time-i;
                VortexRotation[i].depth = Depth;
                VortexRotation[i].width = arguments[i*3+0].data[0].length;
                VortexRotation[i].height = arguments[i*3+0].data.length;
                VortexRotation[i].data = new Array(VortexRotation.height);
            }
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
                }
            }
            return VortexRotation;
        });
}
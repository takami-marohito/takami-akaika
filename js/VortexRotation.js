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
            for(var i=0;i<Time_backward;i++) {
                VortexRotation[i].u = arguments[i*3+0];
                VortexRotation[i].v = arguments[i*3+1];
                VortexRotation[i].w = arguments[i*3+2];
                VortexRotation[i].time = Time-i;
                VortexRotation[i].depth = Depth;
                VortexRotation[i].width = arguments[i*3+0].data[0].length;
                VortexRotation[i].height = arguments[i*3+0].data.length;
                VortexRotation[i].data = new Array(VortexRotation.height);
            }
            var returnObject = {};
            returnObject.data = new Array(VortexRotation[0].u.data.length);
            for(var i=0;i<returnObject.data.length;i++){
                returnObject.data[i] = new Array(VortexRotation[0].u.data[0].length);
            }
            for(var j=0;j<returnObject.data.length;j++){
                for(var i=0;i<returnObject.data[0].length;i++){
                    returnObject.data[j][i] = VortexRotation[0].u.data[j][i];
                }
            }
            return returnObject;
        });
}
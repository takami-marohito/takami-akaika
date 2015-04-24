/**
 * Created by vizlab on 2015/04/13.
 */

var VortexRotation_matrix = new Array();

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
            var returnObject = {};
            returnObject.data = new Array(VortexRotation_matrix[0].u.data.length);
            for(var i=0;i<returnObject.data.length;i++){
                returnObject.data[i] = new Array(VortexRotation_matrix[0].u.data[0].length);
            }
            for(var j=0;j<returnObject.data.length;j++){
                for(var i=0;i<returnObject.data[0].length;i++){
                    returnObject.data[j][i] = VortexRotation_matrix[0].v.data[j][i];
                }
            }

            //lineの配列を用意  配列の要素数は引きたい線の数（折れ線も一本で書ける）
            var lineNum = 5;
            returnObject.line = new Array(lineNum);
            for(var i=0;i<lineNum;i++) {
                returnObject.line[i] = new THREE.Geometry();
            }

            //lineの座標を設定
            for(var i=0;i<lineNum;i++){
                returnObject.line[i].vertices.push(new THREE.Vector3(10,i*50+10, 50));
                returnObject.line[i].vertices.push(new THREE.Vector3(300,i*50+60, 50));
                returnObject.line[i].vertices.push(new THREE.Vector3(500,400-i*30, 50));
                returnObject.line[i].vertices.push(new THREE.Vector3(700,400-i*60, 50));
            }

            return returnObject;
        });
}

function VortexRotation_matrix_exec(VortexRotation_matrix)
{

}
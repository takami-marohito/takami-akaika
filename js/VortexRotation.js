/**
 * Created by vizlab on 2015/04/13.
 */

var VortexRotation_matrix = new Array();

function VortexRotation(Time, Depth)
{
    var Time_backward=Time+1;

    //var VortexRotation_matrix = new Array();

    for(var i=0;i<Time_backward;i++){
        VortexRotation_matrix[i]={};
    }

    var dfds = [];

    for(var i=0;i<Time_backward;i++){
        dfds.push(loadMOVEdata(i, Depth, 0, 5, 0, 5, "U"));
    }

    return jQuery.when.apply(
        $,dfds
    ).then(function () {
            /*
            var m=moment('2000/02/28', "YYYY/MM/DD");
            m.add( 2,'days').format();
            console.log(m);*/
            for(var i=0;i<Time_backward;i++) {
                VortexRotation_matrix[i].time = arguments[i].time;
                VortexRotation_matrix[i].time_string = arguments[i].time_string;
            }
            var returnObject = {};
            console.log(VortexRotation_matrix[3]);
            /*
            returnObject.data = new Array(VortexRotation_matrix[0].u.data.length);
            for(var i=0;i<returnObject.data.length;i++){
                returnObject.data[i] = new Array(VortexRotation_matrix[0].u.data[0].length);
            }
            for(var j=0;j<returnObject.data.length;j++){
                for(var i=0;i<returnObject.data[0].length;i++){
                    returnObject.data[j][i] = VortexRotation_matrix[0].v.data[j][i];
                }
            }
            */
            var OutputString = new Array();
            for(var i=0;i<Time_backward;i++) {
                OutputString += VortexRotation_matrix[i].time_string;
                OutputString += ",";
            }
            var blob = new Blob([OutputString],{type:'text/plain'});
            var link = document.createElement("a");
            var filenameString = "time";
            link.download = filenameString;
            link.href = URL.createObjectURL(blob);
            link.click();
            //return VortexRotation_matrix;
            return returnObject;
        });
}

function VortexRotation_matrix_exec(VortexRotation_matrix)
{

}
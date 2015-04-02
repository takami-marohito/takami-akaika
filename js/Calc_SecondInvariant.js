/**
 * Created by vizlab on 201time/04/02.
 */

//#include "load_data.js"

var SecondInvariant = {};



function Calc_SecondInvariant(time, depth) {
    return jQuery.when(
        loadMOVEdata(time, depth, 0, 441, 0, 672, "U"),
        loadMOVEdata(time, depth, 0, 441, 0, 672, "V"),
        loadMOVEdata(time, depth, 0, 441, 0, 672, "W")
    ).then(function (data_u, data_v, data_w) {
            var m_object = {
                u: data_u,
                v: data_v,
                w: data_w
            };
            Calc_SecondInvariant_exec(m_object);
            return m_object;
        });
}

//m_object has three object u,v,w
//m_object.u.time, m_object.u.depth, m_object.u.type, m_object.u.data[y][x]

function Calc_SecondInvariant_exec(object) {
    var y_length = object.u.data.length;
    var x_length = object.u.data[0].length;
    if (DEBUG == 1) {
        console.log("y_length " + y_length);
        console.log("x_length " + x_length);
    }

    for(var i=0;i<y_length;i++){
        SecondInvariant[i] = new Array(x_length);
    }

    for(var x=0;x<x_length;x++){
        for(var y=0;y<y_length;y++){
            if(x==0||x==x_length-1||y==0||y==y_length-1){
                SecondInvariant[y][x] = -50;             //this process pretermits edge calculation.
            }else{
                var Tensor = Calc_Tensor(x,y,object);
                SecondInvariant[y][x] = Tensor[0][1]*Tensor[1][0] - Tensor[0][0]*Tensor[1][1];
            }
        }
    }
    if(DEBUG==1) {
        console.log(SecondInvariant);
    }

    return object;
}


function Calc_Tensor(x,y,object)
{
    var Tensor = [
        [0,0],
        [0,0]
    ];
    Tensor[0][0] = (object.u.data[y][x+1] - object.u.data[y][x-1]) / 2.0;
    Tensor[0][1] = (object.u.data[y+1][x] - object.u.data[y-1][x]) / 2.0;
    Tensor[1][0] = (object.v.data[y][x+1] - object.v.data[y][x-1]) / 2.0;
    Tensor[1][1] = (object.v.data[y+1][x] - object.v.data[y-1][x]) / 2.0;
    return Tensor;
}

//In matrix iXj, tensor = dVi/dVj

//if second invariant is over 0, this area has vortex.
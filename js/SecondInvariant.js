/**
 * Created by vizlab on 201time/04/02.
 */

//#include "load_data.js"


var vortex_size = 1;

function SecondInvariant(Time, Depth)
{
    var SecondInvariant = {};
    SecondInvariant.data = new Array();
    SecondInvariant.u = {};
    SecondInvariant.v = {};
    SecondInvariant.w = {};
    SecondInvariant.vortex_type = new Array();


    return jQuery.when(
        loadMOVEdata(Time, Depth, 0, 441, 0, 672, "U"),
        loadMOVEdata(Time, Depth, 0, 441, 0, 672, "V"),
        loadMOVEdata(Time, Depth, 0, 441, 0, 672, "W")
    ).then(function (data_u, data_v, data_w) {
            SecondInvariant.u = data_u;
            SecondInvariant.v = data_v;
            SecondInvariant.w = data_w;
            SecondInvariant.time = Time;
            SecondInvariant.depth = Depth;
            SecondInvariant.width = data_u.data[0].length;
            SecondInvariant.height = data_u.data.length;
            SecondInvariant.data = new Array(SecondInvariant.height);
            SecondInvariant.vortex_type = new Array(SecondInvariant.height);

            var Tensor = {};
            for(var i=0;i<SecondInvariant.height;i++){
                SecondInvariant.data[i] = new Array(SecondInvariant.width);
                SecondInvariant.vortex_type[i] = new Array(SecondInvariant.width);
            }
            for(var x=0;x<SecondInvariant.width;x++){
                for(var y=0;y<SecondInvariant.height;y++){
                    if(x<=vortex_size-1||x>=SecondInvariant.width-vortex_size||y<=vortex_size-1||y>=SecondInvariant.height-vortex_size){
                        Tensor = [[undefined,undefined],[undefined,undefined]];
                        SecondInvariant.data[y][x] = -50;             //this process pretermits edge calculation.
                    }else{
                        Tensor = Calc_Tensor(x,y,SecondInvariant);
                        SecondInvariant.data[y][x] = Tensor[0][1]*Tensor[1][0] - Tensor[0][0]*Tensor[1][1];
                        //this.vortex[y][x] = vortex_type(Tensor);
                    }
                    SecondInvariant.vortex_type[y][x] = vortex_type(Tensor);
                }
            }
            return SecondInvariant;
        });
}

//m_object has three object u,v,w
//m_object.u.time, m_object.u.depth, m_object.u.type, m_object.u.data[y][x]

function Calc_Tensor(x,y,object) {
    var Tensor = [
        [0, 0],
        [0, 0]
    ];
    if (object.u.data[y][x + vortex_size] < -100 || object.u.data[y][x - vortex_size] < -100 || object.u.data[y + vortex_size][x] < -100 || object.u.data[y - vortex_size][x] < -100) {
        Tensor = [[1000, 0], [0, 1000]];
    } else {
        Tensor[0][0] = (object.u.data[y][x + vortex_size] - object.u.data[y][x - vortex_size]) / (2.0 * vortex_size);
        Tensor[0][1] = (object.u.data[y + vortex_size][x] - object.u.data[y - vortex_size][x]) / (2.0 * vortex_size);
        Tensor[1][0] = (object.v.data[y][x + vortex_size] - object.v.data[y][x - vortex_size]) / (2.0 * vortex_size);
        Tensor[1][1] = (object.v.data[y + vortex_size][x] - object.v.data[y - vortex_size][x]) / (2.0 * vortex_size);
    }
    return Tensor;
}
//In matrix iXj, tensor = dVi/dVj

//if second invariant is over 0, this area has vortex.

function vortex_type(Tensor) {
    var a = Tensor[0][0];
    var b = Tensor[0][1];
    var c = Tensor[1][0];
    var d = Tensor[1][1];

    if( (a+d)*(a+d)-4*(a*d-b*c) >= 0){
        return 0;
    }
    if( (a+d)>=0){
        return("stable");
    }
    if( (a+d)<0){
        return("unstable");
    }
    return -1;
}
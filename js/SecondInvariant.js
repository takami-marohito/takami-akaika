/**
 * Created by vizlab on 201time/04/02.
 */

//#include "load_data.js"


function SecondInvariant(Time, Depth)
{
    this.data = {};
    this.u = {};
    this.v = {};
    this.w = {};

    return jQuery.when(
        loadMOVEdata(Time, Depth, 0, 441, 0, 672, "U"),
        loadMOVEdata(Time, Depth, 0, 441, 0, 672, "V"),
        loadMOVEdata(Time, Depth, 0, 441, 0, 672, "W")
    ).then(function (data_u, data_v, data_w) {
            this.u = data_u;
            this.v = data_v;
            this.w = data_w;
            this.time = Time;
            this.depth = Depth;
            this.width = data_u.data[0].length;
            this.height = data_u.data.length;
            this.data = new Array(this.height);
            for(var i=0;i<this.height;i++){
                this.data[i] = new Array(this.width);
            }
            for(var x=0;x<this.width;x++){
                for(var y=0;y<this.height;y++){
                    if(x==0||x==this.width-1||y==0||y==this.height-1){
                        this.data[y][x] = -50;             //this process pretermits edge calculation.
                    }else{
                        var Tensor = Calc_Tensor(x,y,this);
                        this.data[y][x] = Tensor[0][1]*Tensor[1][0] - Tensor[0][0]*Tensor[1][1];
                    }
                }
            }
            return this;
        });
}



//m_object has three object u,v,w
//m_object.u.time, m_object.u.depth, m_object.u.type, m_object.u.data[y][x]

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
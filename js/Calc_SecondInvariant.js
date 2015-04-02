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
            SecondInvariant = Calc_SecondInvariant_exec(m_object);
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

    return object;
}
/*

        SecondInvariant.time = time;
        SecondInvariant.depth = depth;
        SecondInvariant.data = new Array(672);

        console.log(MOVE_U);


        for (var i = 0; i < 441; i++) {
            SecondInvariant.data[i] = new Array(441);
        }
        for (y = 0; y < 441; y++) {
            for (x = 0; x < 672; x++) {
                SecondInvariant.data[y][x] = MOVE_U.data[y][x];
            }
        }
    }
        */

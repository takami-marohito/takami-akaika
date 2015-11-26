/**
 * Created by vizlab on 2015/11/19.
 */
/**
 * Created by vizlab on 2015/09/25.
 */
function KonishiMethodTime(dateNum) {
    fileurl = URL.createObjectURL(document.getElementById("KonishiFilename").files[0]);
    //console.log(fileurl);

    var csvNumData = {};

    var testfunction = [];
    testfunction.push(
        jQuery.ajax({
            url: fileurl,
            dataType: "text",
            async: false
        })
    );

    return jQuery.when.apply(
        $, testfunction
    ).then(function () {
            var LF = String.fromCharCode(10); //改行ｺｰﾄﾞ
            var lines = arguments[0].split(LF);

            var csvData = [];

            for (var i = 0; i < lines.length; i++) {
                var cells = lines[i].split(",");
                if (cells.length != 1) {
                    csvData.push(cells);
                }
            }

            var exec_function = [];

            exec_function.push(Konishi_CreateArray(csvData, dateNum));

            return jQuery.when.apply(
                $, exec_function
            ).then(function () {
                    if (DEBUG == 1) {
                        //console.log(arguments[0]);
                    }
                    return arguments[0];
                });

        });


    var Konishi_CreateArray_ReturnObject = {};
    var Konishi_PartObject = new Array();

    function Konishi_CreateArray(input_array, dateNum) {
        //console.log(input_array.length);
        var exec_function = [];
        var namelengtharray = new Array(1);
        namelengtharray[0] = 0;

        if (input_array.length == 1) {
            namelengtharray[0] = 1;
        }

        var counter = 0;
        for (var i = 1; i < input_array.length; i++) {
            if (input_array[i][0] == input_array[i - 1][0]) {
                namelengtharray[counter]++;
            }
            if (input_array[i][0] != input_array[i - 1][0]) {
                namelengtharray[counter]++;
                counter++;
                namelengtharray[counter] = 0;
            }
            if (i == input_array.length - 1) {
                namelengtharray[counter]++;
            }
        }
        console.log(namelengtharray);

        for (var i = 0; i < input_array.length; i++) {
            var name = input_array[i][0];
            var depth = Number(input_array[i][1]);
            var date = dateNum - Number(input_array[i][3]);
            exec_function.push(loadMOVEdata(date, depth, 0, 441, 0, 672, name));
        }

        return jQuery.when.apply(
            $, exec_function
        ).then(function () {
                InitKonishi_ReturnObject(arguments[0].data.length, arguments[0].data[0].length, namelengtharray.length);

                var nth = 0;
                for (var i = 0; i < namelengtharray.length; i++) {
                    for (var j = 0; j < namelengtharray[i]; j++) {
                        Konishi_OneVariableOneStepFunction(Konishi_PartObject[i], arguments[nth].data, input_array[i][2]);
                        nth++;
                    }
                }
                for (var i = 0; i < namelengtharray.length; i++) {
                    for (var j = 0; j < Konishi_PartObject[0].data.length; j++) {
                        for (var k = 0; k < Konishi_PartObject[0].data[0].length; k++) {
                            if (Konishi_PartObject[i].data[j][k] < 0) {
                                //0以下なら相乗平均に加えない
                            } else {
                                Konishi_CreateArray_ReturnObject.data[j][k] = Konishi_CreateArray_ReturnObject.data[j][k] * Konishi_PartObject[i].data[j][k];
                            }
                        }
                    }
                }
                var avg = 0;
                for (var j = 0; j < Konishi_PartObject[0].data.length; j++) {
                    for (var k = 0; k < Konishi_PartObject[0].data[0].length; k++) {
                        if (Konishi_CreateArray_ReturnObject.data[j][k] > 0) {
                            Konishi_CreateArray_ReturnObject.data[j][k] = Math.sqrt(Konishi_CreateArray_ReturnObject.data[j][k]);
                        } else {
                            Konishi_CreateArray_ReturnObject.data[j][k] = -1;
                        }
                        if (Konishi_CreateArray_ReturnObject.data[j][k] == 1) {//初期値と変わらない場合、すべてのPartObjectが負とする
                            Konishi_CreateArray_ReturnObject.data[j][k] = -1;
                        }
                        if (Konishi_CreateArray_ReturnObject.data[j][k] > 0) {
                            avg += Konishi_CreateArray_ReturnObject.data[j][k];
                        }
                    }
                }
                avg = avg / (j * k);
                console.log("avg=" + avg);
                console.log(Konishi_CreateArray_ReturnObject.data[80][159]);
                console.log(Konishi_CreateArray_ReturnObject.data[80]);
                return Konishi_CreateArray_ReturnObject;
            });
    }

//再帰的にCreateArray関数を回すかもしれない→無駄な関数を入れると消費メモリが増える→Init関数やoneStep関数をCreateArray関数の外に出した

    function InitKonishi_ReturnObject(row, col, part) {  //行=row, 列=col
        Konishi_CreateArray_ReturnObject = {};
        Konishi_CreateArray_ReturnObject.data = new Array(row);
        for (var i = 0; i < row; i++) {
            Konishi_CreateArray_ReturnObject.data[i] = new Array(col);
            for (var j = 0; j < col; j++) {
                Konishi_CreateArray_ReturnObject.data[i][j] = 1.0;
            }
        }
        Konishi_PartObject = new Array(part);
        for (var i = 0; i < part; i++) {
            Konishi_PartObject[i] = {};
            Konishi_PartObject[i].data = new Array(row);
            for (var j = 0; j < row; j++) {
                Konishi_PartObject[i].data[j] = new Array(col);
                for (var k = 0; k < col; k++) {
                    Konishi_PartObject[i].data[j][k] = 0.0;
                }
            }
        }

    }

    function Konishi_OneVariableOneStepFunction(object, array, coef) {
        for (var i = 0; i < array.length; i++) {
            for (var j = 0; j < array[0].length; j++) {
                if (Math.abs(array[i][j]) > 1.0e+10) {
                    //データが取得できない場合は +0する
                } else if (Math.abs(array[i][j]) > 0.00001) {
                    object.data[i][j] += coef * Math.log(Math.abs(array[i][j]));
                } else {
                    object.data[i][j] += coef * (-5);
                }
                if (i == 80 && j == 159) {
                    console.log(array[i][j]);
                    console.log(coef * Math.log(Math.abs(array[i][j])));
                }
            }
        }
        return;
    }

}
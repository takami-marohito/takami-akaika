/**
 * Created by vizlab on 2016/01/31.
 */

//matlabで計算したSIモデルをHSIモデルにして正答率を計算する
//または直接HSIモデルを求める手法の正答率を計算する
//1/31の時点で地図は出さない
//追加予定
//matlabの出力ファイルは必ず各海洋環境変数が一つ以上入っていると仮定している。
//(namelengtharrayがそういうつくり）

var evenodd = 'odd';



function KonishiMethodAccuracy(dateNum) {
    fileurl = URL.createObjectURL(document.getElementById("KonishiFilename").files[0]);
    fileurlS = URL.createObjectURL(document.getElementById("SFilename").files[0]);
    fileurlT = URL.createObjectURL(document.getElementById("TFilename").files[0]);
    fileurlU = URL.createObjectURL(document.getElementById("UFilename").files[0]);
    fileurlV = URL.createObjectURL(document.getElementById("VFilename").files[0]);
    fileurlW = URL.createObjectURL(document.getElementById("WFilename").files[0]);
    fileurlCPUE = URL.createObjectURL(document.getElementById("CheckCorrectCPUEFilename").files[0]);
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

    testfunction.push(
        jQuery.ajax({
            url: fileurlS,
            dataType: "text",
            async: false
        })
    );

    testfunction.push(
        jQuery.ajax({
            url: fileurlT,
            dataType: "text",
            async: false
        })
    );
    testfunction.push(
        jQuery.ajax({
            url: fileurlU,
            dataType: "text",
            async: false
        })
    );
    testfunction.push(
        jQuery.ajax({
            url: fileurlV,
            dataType: "text",
            async: false
        })
    );
    testfunction.push(
        jQuery.ajax({
            url: fileurlW,
            dataType: "text",
            async: false
        })
    );

    testfunction.push(
        jQuery.ajax({
            url: fileurlCPUE,
            dataType: "text",
            async: false
        })
    );

    var Konishi_CreateArray_ReturnObject = {};
    var Konishi_PartObject = new Array();

    return jQuery.when.apply(
        $, testfunction
    ).then(function () {
            var LF = String.fromCharCode(10); //改行ｺｰﾄﾞ
            var lines = arguments[0][0].split(LF);

            var csvData = [];

            for (var i = 0; i < lines.length; i++) {
                var cells = lines[i].split(",");
                if (cells.length != 1) {
                    csvData.push(cells);
                }
            }

            varArray = new Array(5);

            for(var j=1;j<6;j++){
                var retData = [];
                var lines = arguments[j][0].split(LF);
                for (var i = 0; i < lines.length; i++) {
                    var cells = lines[i].split(",");
                    if (cells.length != 1) {
                        retData.push(cells);
                    }
                }
                varArray[j-1] = retData;
            }

            lines = arguments[6][0].split(LF);
            var cpueData = [];
            for (var i = 0; i < lines.length; i++) {
                var cells = lines[i].split(",");
                if (cells.length != 1) {
                    cpueData.push(cells);
                }
            }

            var exec_function = [];
            exec_function.push(Accuracy_CreateArray(csvData, dateNum,varArray,cpueData));



            return jQuery.when.apply(
                $, exec_function
            ).then(function () {
                    if (DEBUG == 1) {
                        //console.log(arguments[0]);
                    }
                    return arguments[0];
                });

        });


    var ValidMap;

    function Accuracy_CreateArray(input_array, dateNum,arg,cpueData) {
        console.log(arg);
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
        //console.log(namelengtharray);
        //valueArrayに変数値を入れる
        //valueArray[i][j][k]はi種類目の変数のj番目の係数がかかるk番目の漁獲点の変数値が入る
        var valueArray = new Array(5);
        var coefArray = new Array(5);
        counter = 0;
        for(var i=0;i<5;i++){
            valueArray[i] = new Array(namelengtharray[i]);
            for(var j=0;j<namelengtharray[i];j++) {
                valueArray[i][j] = new Array(arg[0].length - 1);
            }
            coefArray[i] = new Array(namelengtharray[i]);
            for(var j=0;j<namelengtharray[i];j++){
                coefArray[i][j] = Number(input_array[counter][2]);
                counter++;
            }
        }
        counter = 0;
        for(var i=0;i<5;i++){
            for(var j=0;j<namelengtharray[i];j++){
                var valuenum = Number(input_array[counter][1]);
                valuenum = valuenum + 6;        //yearとかmonthなどの除外
                counter++;
                //console.log(i + "  " + valuenum);
                for(var k=0;k<arg[0].length-1;k++){
                    valueArray[i][j][k] = Math.log(Math.abs(Number(arg[i][k+1][valuenum])));
                }
            }
        }

        //console.log(valueArray);
        //console.log(coefArray);

        //calcPredictedCPUE
        var PredictedHSI = new Array(arg[0].length-1);

        for(var i=0;i<arg[0].length-1;i++){
            var cross = 1;
            counter = 0;
            partCPUE = new Array(5);
            for(var j=0;j<5;j++){
                partCPUE[j] = 0;
                for(var k=0;k<namelengtharray[j];k++){
                    partCPUE[j] += coefArray[j][k] * valueArray[j][k][i];
                }
                if(partCPUE[j]>0) {
                    cross = cross * partCPUE[j];
                    counter++;
                }
            }
            PredictedHSI[i] = Math.pow(cross,1.0/counter);
        }
        //HSIの予測値自体は1.5中心
        //だから1.5以下の時はCPUEは学習データのCPUEの最小値と学習データのCPUEの平均値の間で線形
        //1.5以上の時は学習データの最大値と平均値の間で線形

        //console.log(PredictedCPUE);

        //calcAccuracy
        var evenoddnum = 0;
        if(evenodd == 'odd'){
            evenoddnum = 1;
        }
        //console.log("evenodd =" + evenoddnum);
        //matlab計算でevenとoddが逆だったからこっちも逆にしている
        //上で指定するときはmatlabと同じ設定で良い

        avg_learning_data_cpue = 0;
        total_test_data_num = 0;
        total_learning_data_num = 0;
        UpperPrecisionU = 0;
        UpperPrecisionL = 0;
        LowerPrecisionU = 0;
        LowerPrecisionL = 0;
        UpperRecallU = 0;
        UpperRecallL = 0;
        LowerRecallU = 0;
        LowerRecallL = 0;

        for(var i=0;i<arg[0].length-1;i++){
            if(i%2==evenoddnum){
                total_test_data_num++;
            }else{
                total_learning_data_num++;
                avg_learning_data_cpue = avg_learning_data_cpue+Number(cpueData[i+1][5]);
            }
        }
        avg_learning_data_cpue = avg_learning_data_cpue/total_learning_data_num;

        //Precision
        for(var i=0;i<arg[0].length-1;i++){
            if(i%2==evenoddnum){
                if(1.5 < PredictedHSI[i]){
                    UpperPrecisionL++;
                    if(avg_learning_data_cpue < Number(cpueData[i+1][5])){
                        UpperPrecisionU++;
                    }
                }else{
                    LowerPrecisionL++;
                    if(avg_learning_data_cpue > Number(cpueData[i+1][5])){
                        LowerPrecisionU++;
                    }
                }
            }
        }
        console.log("Accuracy = " + (LowerPrecisionU+UpperPrecisionU)/total_test_data_num);
        console.log("UpperPrecision = " + (UpperPrecisionU/UpperPrecisionL));
        console.log("UpperPrecision = " + UpperPrecisionU + "/" + UpperPrecisionL);
        console.log("LowerPrecision = " + (LowerPrecisionU/LowerPrecisionL));
        console.log("LowerPrecision = " + LowerPrecisionU + "/" + LowerPrecisionL);

        for(var i=0;i<arg[0].length-1;i++){
            if(i%2==evenoddnum){
                if(avg_learning_data_cpue < Number(cpueData[i+1][5])){
                    UpperRecallL++;
                    if(1.5 < PredictedHSI[i]){
                        UpperRecallU++;
                    }
                }else{
                    LowerRecallL++;
                    if(1.5 > PredictedHSI[i]){
                        LowerRecallU++;
                    }
                }
            }
        }
        console.log("UpperRecall = " + (UpperRecallU/UpperRecallL));
        console.log("UpperRecall = " + UpperRecallU + "/" + UpperRecallL);
        console.log("LowerRecall = " + (LowerRecallU/LowerRecallL));
        console.log("LowerRecall = " + LowerRecallU + "/" + LowerRecallL);

        console.log("Avg = " + avg_learning_data_cpue);
        console.log("PredictedHSI");
        console.log(PredictedHSI);

        return 0;

        for (var i = 0; i < input_array.length; i++) {
            var name = input_array[i][0];
            var depth = Number(input_array[i][1]);
            exec_function.push(loadMOVEdata(dateNum, depth, 0, 441, 0, 672, name));
        }

        return jQuery.when.apply(
            $, exec_function
        ).then(function () {
                //var loc = {x:142.02,y:38.35};
                //console.log(interpolateVariable(arguments[0],loc));
                InitKonishi_ReturnObject(arguments[0].data.length, arguments[0].data[0].length, namelengtharray.length);
                var PowNumber = new Array(Konishi_PartObject[0].data.length);
                for(var i=0;i<Konishi_PartObject[0].data.length;i++){
                    PowNumber[i] = new Array(Konishi_PartObject[0].data[0].length);
                    for(var j=0;j<Konishi_PartObject[0].data[0].length;j++){
                        PowNumber[i][j] = 0;
                    }
                }
                ValidMap = new Array(Konishi_PartObject[0].data.length);
                for(var i=0;i<Konishi_PartObject[0].data.length;i++){
                    ValidMap[i] = new Array(Konishi_PartObject[0].data[0].length);
                    for(var j=0;j<Konishi_PartObject[0].data[0].length;j++){
                        ValidMap[i][j] = 0;
                    }
                }


                var nth = 0;
                for (var i = 0; i < namelengtharray.length; i++) {
                    for (var j = 0; j < namelengtharray[i]; j++) {
                        //console.log("namelengtharray " + i + " , " + "input_array " + input_array[nth][2]);
                        Konishi_OneVariableOneStepFunction(Konishi_PartObject[i], arguments[nth].data, input_array[nth][2]);
                        nth++;
                    }
                }
                for (var i = 0; i < namelengtharray.length; i++) {
                    for (var j = 0; j < Konishi_PartObject[0].data.length; j++) {
                        for (var k = 0; k < Konishi_PartObject[0].data[0].length; k++) {
                            if (Konishi_PartObject[i].data[j][k] < 0) {
                                //0以下なら相乗平均に加えない
                            } else {
                                PowNumber[j][k] = PowNumber[j][k] + 1;
                                Konishi_CreateArray_ReturnObject.data[j][k] = Konishi_CreateArray_ReturnObject.data[j][k] * Konishi_PartObject[i].data[j][k];
                            }
                        }
                    }
                }
                var avg = 0;
                for (var j = 0; j < Konishi_PartObject[0].data.length; j++) {
                    for (var k = 0; k < Konishi_PartObject[0].data[0].length; k++) {
                        if (Konishi_CreateArray_ReturnObject.data[j][k] > 0) {
                            Konishi_CreateArray_ReturnObject.data[j][k] = Math.pow(Konishi_CreateArray_ReturnObject.data[j][k],1.0/PowNumber[j][k]);
                        } else {
                            Konishi_CreateArray_ReturnObject.data[j][k] = -1;
                        }
                        if (Konishi_CreateArray_ReturnObject.data[j][k] == 1) {//初期値と変わらない場合、すべてのPartObjectが負とする
                            Konishi_CreateArray_ReturnObject.data[j][k] = -1;
                        }
                        if (Konishi_CreateArray_ReturnObject.data[j][k] > 0) {
                            avg += Konishi_CreateArray_ReturnObject.data[j][k];
                        }
                        if(ValidMap[j][k] == 1){
                            Konishi_CreateArray_ReturnObject.data[j][k] = -1;
                        }
                    }
                }
                avg = avg / (j * k);
                console.log("avg=" + avg);
                //console.log(Konishi_CreateArray_ReturnObject.data[80][159]);
                //console.log(Konishi_CreateArray_ReturnObject.data[80]);
                return Konishi_CreateArray_ReturnObject;
            },
            function(){
                console.log("time out retry");
                return Konishi_CreateArray(input_array, dateNum);
            }
        );
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
                if (Math.abs(array[i][j]) > 10000) {
                    ValidMap[i][j] = 1;
                    //データが取得できない場合は +0する
                } else if (Math.abs(array[i][j]) > 0.00001) {
                    object.data[i][j] += coef * Math.log(Math.abs(array[i][j]));
                } else {
                    object.data[i][j] += coef * (-5);
                }
            }
        }
        return;
    }

}
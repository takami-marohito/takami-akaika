/**
 * Created by vizlab on 2015/11/09.
 */


//year month day lat lon cpue hm hg s00-s53 t00-t53 ... のファイルを読み込む

var PreCPUE = {};

function LoadingCPUEfilePreviousMethod()
{
    jQuery('#PreviousMethodFile').on('change', function () {
        //console.log("start");
        loadprecpue();
        //console.log(PreCPUE);
    });
}

function loadprecpue()
{
    fileurl = URL.createObjectURL(document.getElementById("PreviousMethodFile").files[0]);
    return jQuery.when( jQuery.ajax({
            url: fileurl,
            dataType: "text",
            async: false
        })
    ).then(function (data) {
            var LF = String.fromCharCode(10); //改行ｺｰﾄﾞ
            var lines = data.split(LF);

            var csvData = [];

            for(var i=0;i<lines.length;i++){
                var cells = lines[i].split(",");
                if(cells.length!=1){
                    csvData.push(cells);
                }
            }

            PreCPUE = {};
            PreCPUE.name = new Array();
            for(var i=0;i<csvData[0].length;i++){
                PreCPUE.name.push(csvData[0][i]);
            }

            PreCPUE.data = new Array(csvData.length-1);
            for(var i=0;i<csvData.length-1;i++){
                PreCPUE.data[i] = new Array(csvData[0].length);
                for(var j=0;j<csvData[0].length;j++){
                    PreCPUE.data[i][j] = Number(csvData[i+1][j]);
                }
            }
            //console.log(PreCPUE.data);
            return(PreCPUE);
        });
}

function PreviousMethod(datenum)
{
    var learningData = {name:new Array(),data:new Array()};
    var testData = {name:new Array(),data:new Array()};

    //setLearningData(PreCPUE);
    splitData(PreCPUE);
    //console.log(learningData);
    //console.log(testData);

    var AvgLearningDataCPUE = 0;
    var cpuenum;
    for(var i=0;i<PreCPUE.name.length;i++){
        if(PreCPUE.name[i] == "CPUE"){
            cpuenum = i;
            break;
        }
    }
    for(var i=0;i<PreCPUE.data.length;i++){
        AvgLearningDataCPUE += PreCPUE.data[i][cpuenum] / PreCPUE.data.length;
    }

    //console.log(AvgLearningDataCPUE);

    var SplineParam = [];
    SplineParam.push(makeBestSpline(learningData,"S"));
    SplineParam.push(makeBestSpline(learningData,"T"));
    SplineParam.push(makeBestSpline(learningData,"U"));
    SplineParam.push(makeBestSpline(learningData,"V"));
    SplineParam.push(makeBestSpline(learningData,"W"));

    var fn = [];
    fn.push(loadMOVEdata(datenum, 0, 0, 441, 0, 672, "S"));

    var position = {x:143.5,y:38.28};

    return jQuery.when.apply(
        $, fn
    ).then(function () {
            console.log(interpolateVariable(arguments[0],position));
            //SaveAnArray(arguments[0].data);
            console.log(arguments[0]);
        });


    function splitData(input)
    {
        testData.name = input.name;
        learningData.name = input.name;
        for(var i=0;i<input.data.length;i++){
            if(i%2==0){
                learningData.data[i/2] = input.data[i];
            }else{
                testData.data[(i-1)/2] = input.data[i];
            }
        }
    }
    function setLearningData(input)
    {
        learningData.name = input.name;
        for(var i=0;i<input.data.length;i++){
            learningData.data[i] = input.data[i];
        }
    }
    function makeBestSpline(data,name)
    {
        var bestparam;
        var correctrate = 0;
        for(var i=0.1;i<0.9;i=i+0.1){
            for(var depth=0;depth<30;depth++){
                var param = makeSpline(data, name, i, depth);
                //console.log(param);
                //console.log(correctrate);
                var ComparedRate = checkCorrectRate(param,testData);
                if(correctrate < ComparedRate){
                    correctrate = ComparedRate;
                    bestparam = param;
                }
            }
        }
        console.log("variable : " + name);
        console.log("correct rate : " + correctrate);
        console.log(bestparam);
        return bestparam;
    }

    function checkCorrectRate(parameter,testData)   //推定したCPUEがAvgLearningDataCPUEより大きいか小さいか、実際のCPUEがAvgLearningDataCPUEより大きいか小さいかでCorrectRateを求める
    {
        var count = 0;
        for(var i=0;i<testData.data.length;i++){
            var val = testData.data[i][parameter.valnum];
            var PredictCPUE = calcCPUEFromSplineParams(parameter, val);
            //console.log(PredictCPUE);
            //console.log(testData.data[i][cpuenum]);
            //console.log(AvgLearningDataCPUE);
            if(PredictCPUE > AvgLearningDataCPUE){
                if(testData.data[i][cpuenum] > AvgLearningDataCPUE){
                    count++;
                }
            }
            if(PredictCPUE < AvgLearningDataCPUE){
                if(testData.data[i][cpuenum] < AvgLearningDataCPUE){
                    count++;
                }
            }
        }
        //console.log(count);
        //console.log(testData.data.length);
        //console.log(count/testData.data.length);
        return( count / testData.data.length );
    }

    function calcCPUEFromSplineParams(params,v)
    {
        var i = d3.bisectRight(params.x, v) - 1;
        if (i < 0) {
            return params.params[0][3];
        }
        if (i >= params.x.length-1) {
            return params.y[params.y.length-1];
        }
        var a = params.params[i][0],
            b = params.params[i][1],
            c = params.params[i][2],
            d = params.params[i][3];
        v = v - params.x[i];
        return a * v * v * v + b * v * v + c * v + d;
    }

    function makeSpline(input,name,lambda, depth)
    {
        SplinePoints = new Array(input.data.length);
        for(var i=0;i<input.data.length;i++){
            SplinePoints[i] = {x:0,y:0};
        }
        pickupdata = new Array(input.data.length);
        for(var i=0;i<input.data.length;i++){
            pickupdata[i] = {cpue:0,val:0};
        }

        cpuenum = 0;
        valname = name + String(("0"+depth).slice(-2));
        valnum = 0;

        for(var i=0;i<input.name.length;i++){
            if(input.name[i] == "CPUE"){
                cpuenum = i;
            }
            if(input.name[i] == valname){
                valnum = i;
            }
        }
        for(var i=0;i<input.data.length;i++){
            pickupdata[i].cpue = input.data[i][cpuenum];
            pickupdata[i].val = input.data[i][valnum];
        }
        //console.log(pickupdata);
        pickupdata.sort(function(a,b){
            var x = a.val;
            var y = b.val;
            if (x > y) return 1;
            if (x < y) return -1;
            return 0;
        });
        //pickupdataはcpueと変数(たとえばS00)が変数の順でソートされて入っている
        //これをスプライン近似する

        var pickupval = [];
        var pickupcpue = [];
        for(var i=0;i<pickupdata.length;i++){
            pickupval.push(pickupdata[i].val);
            pickupcpue.push(pickupdata[i].cpue);
        }
        //console.log(pickupval);
        var sigma = pickupcpue.map(function(){
            return 1;
        });
        var params = smoothingSpline(pickupval,pickupcpue,sigma,lambda);
        //paramsはスプライン近似の結果
        //pickupval[i] < v < pickupval[i+1]の補間は
        //params[i][0]*v^3 + params[i][1]*v^2 + params[i][2]*v + params[i][3]となる
        //console.log(params);
        /*
        var ar = new Array(300);
        for(var i=0;i<300;i++){
            var m = (pickupval[pickupval.length-1]-pickupval[0])/300*i + pickupval[0];
            var j = d3.bisectRight(pickupval,m)-1;
            if(j<0){
                ar[i] = pickupcpue[0];
            }else if(j>=pickupval.length){
                ar[i] = pickupcpue[pickupval.length-1];
            }else{
                //console.log(j);
                var a = params[j][0],
                    b = params[j][1],
                    c = params[j][2],
                    d = params[j][3];
                v = m-pickupval[j];
                ar[i] =a * v * v * v + b * v * v + c * v + d;
            }
        }
        var text = "";
        for(var i=0;i<300;i++){
            text += String(ar[i]);
            text += ",";
        }
        console.log(text);
        */
        var returnParam = {params:params,x:pickupval,y:pickupcpue,valnum:valnum,lambda:lambda,depth:depth};
        return returnParam;
    }

    function smoothingSpline(x,y,sigma,lambda)
    {
        var n = x.length - 1;
        var h = new Array(n + 1);
        var r = new Array(n + 1);
        var f = new Array(n + 1);
        var p = new Array(n + 1);
        var q = new Array(n + 1);
        var u = new Array(n + 1);
        var v = new Array(n + 1);
        var w = new Array(n + 1);
        var params = x.map(function() {
            return [0, 0, 0, 0];
        });
        var i;

        var mu = 2 * (1 - lambda) / (3 * lambda);
        for (i = 0; i < n; ++i) {
            h[i] = x[i + 1] - x[i];
            r[i] = 3 / h[i];
        }
        q[0] = 0;
        for (i = 1; i < n; ++i) {
            f[i] = -(r[i - 1] + r[i]);
            p[i] = 2 * (x[i + 1] - x[i - 1]);
            q[i] = 3 * (y[i + 1] - y[i]) / h[i] - 3 * (y[i] - y[i - 1]) / h[i - 1];
        }
        q[n] = 0;

        for (i = 1; i < n; ++i) {
            u[i] = r[i - 1] * r[i - 1] * sigma[i - 1] + f[i] * f[i] * sigma[i] + r[i] * r[i] * sigma[i + 1];
            u[i] = mu * u[i] + p[i];
        }
        for (i = 1; i < n - 1; ++i) {
            v[i] = f[i] * r[i] * sigma[i] + r[i] * f[i + 1] * sigma[i + 1];
            v[i] = mu * v[i] + h[i];
        }
        for (i = 1; i < n - 2; ++i) {
            w[i] = mu * r[i] * r[i + 1] * sigma[i + 1];
        }

        quincunx(u, v, w, q);

        params[0][3] = y[0] - mu * r[0] * q[1] * sigma[0];
        params[1][3] = y[1] - mu * (f[1] * q[1] + r[1] * q[2]) * sigma[0];
        params[0][0] = q[1] / (3 * h[0]);
        params[0][1] = 0;
        params[0][2] = (params[1][3] - params[0][3]) / h[0] - q[1] * h[0] / 3;
        r[0] = 0;
        for (i = 1; i < n; ++i) {
            params[i][0] = (q[i + 1] - q[i]) / (3 * h[i]);
            params[i][1] = q[i];
            params[i][2] = (q[i] + q[i - 1]) * h[i - 1] + params[i - 1][2];
            params[i][3] = r[i - 1] * q[i - 1] + f[i] * q[i] + r[i] * q[i + 1];
            params[i][3] = y[i] - mu * params[i][3] * sigma[i];
        }
        return params;
    }
    function quincunx(u, v, w, q) {
        var n = u.length - 1;
        var i;

        u[0] = 0;
        v[0] = 0;
        w[0] = 0;
        v[1] = v[1] / u[1];
        w[1] = w[1] / u[1];
        for (i = 2; i < n; ++i) {
            u[i] = u[i] - u[i - 2] * w[i - 2] * w[i - 2] - u[i - 1] * v[i - 1] * v[i - 1];
            v[i] = (v[i] - u[i - 1] * v[i - 1] * w[i - 1]) / u[i];
            w[i] = w[i] / u[i];
        }

        for (i = 2; i < n; ++i) {
            q[i] = q[i] - v[i - 1] * q[i - 1] - w[i - 2] * q[i - 2]
        }
        for (i = 1; i < n; ++i) {
            q[i] = q[i] / u[i];
        }

        q[n - 2] = q[n - 2] - v[n - 2] * q[n- 1];
        for (i = n - 3; i > 0; --i) {
            q[i] = q[i] - v[i] * q[i + 1] - w[i] * q[i + 2];
        }
    }
}
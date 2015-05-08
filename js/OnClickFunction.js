/**
 * Created by vizlab on 2015/04/02.
 */

//#include "SecondInvariant.js"
//#include "draw_land.js"
//#include "load_data.js"

//クリックすると
//1.ユーザの設定した緯度経度を配列番号にする関数をつくる
//2.データをロード、計算
//3.描画
function OnClickFunction() {
    jQuery.when(
        setVariable(),
        loadTimeArray(),
        button_loading_text(),
        CalcVariable()
    ).then(function (retvalue0,retvalue1,retvalue3, m_secondinvariant) {
            if (DEBUG == 1) {
                //console.log(m_secondinvariant);
            }
            draw_map(m_secondinvariant);
            draw_land();
            addColorLegend_Horizontal();
            button_calculating_finish();
            return m_secondinvariant;
        });
}

function button_loading_text()
{
    var target = document.getElementById("button_exec");
    target.innerHTML = "loading&Calculating";
    return 0;
}

function button_calculating_finish()
{
    var target = document.getElementById("button_exec");
    target.innerHTML = "Update";
    return 0;
}

function setVariable()
{
    Latitude.min = eval(document.getElementById("LatitudeMinInt").value);
    Latitude.min += eval(document.getElementById("LatitudeMinDec").value/60.0);
    Latitude.max = eval(document.getElementById("LatitudeMaxInt").value);
    Latitude.max += eval(document.getElementById("LatitudeMaxDec").value/60.0);

    Longitude.min = eval(document.getElementById("LongitudeMinInt").value);
    Longitude.min += eval(document.getElementById("LongitudeMinDec").value/60.0);
    Longitude.max = eval(document.getElementById("LongitudeMaxInt").value);
    Longitude.max += eval(document.getElementById("LongitudeMaxDec").value/60.0);

    if(Latitude.min > Latitude.max){
        console.log("Latitude min max error");
    }
    if(Longitude.min > Longitude.max){
        console.log("Longitude min max error");
    }
    return 0;
}

function CalcVariable()
{
    var target = document.getElementById("VariableMode");
    var exec_function = [];
    if(target.value == "SecondInvariant") {
        var dateNum = DateToArrayNum(document.getElementById("SecondInvariantDate_input").value);
        if(dateNum == -1){
            console.log("cannot find date");
            return(function(){
               var date = {miss:true};
                return date;
            });
        }
        exec_function.push(SecondInvariant(dateNum, 0));
    }
    if(target.value == "VortexRotation"){
        var dateNum = DateToArrayNum(document.getElementById("SecondInvariantDate_input").value);
        if(dateNum == -1){
            console.log("cannot find date");
            return(function(){
                var date = {miss:true};
                return date;
            });
        }
        var range = Number(document.getElementById("DownloadDateRangeInput").value);
        exec_function.push(VortexRotation(dateNum,0,range));
    }
    if(target.value == "LoadingCalculatedVariable"){
        exec_function.push(LoadingFile());
    }
    //console.log(exec_function);
    return jQuery.when.apply(
        $,exec_function
    ).then(function(){
            //console.log(arguments[0]);
            return arguments[0];
        });
}

function DateToArrayNum(date)
{
    for(var i=0;i<TimeArray.length;i++){
        if(TimeArray[i] == date){
            console.log("find date " + TimeArray[i] );
            return i;
        }
    }
    return -1;
}
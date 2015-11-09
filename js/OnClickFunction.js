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

PointData = new Array();

CalcData = new Array();

function OnClickFunctionAutoRange(){
    if(CalcData.length == 0){
        console.log("This button can be used after drawing map");
        return;
    }
    leg = {min:0,max:0};
    leg = autodetectingMinMax(260,290,220,240);//だいたいこの範囲が目的の範囲
    document.forms.ColorLegendRange.Min.value = leg.min;
    document.forms.ColorLegendRange.Max.value = leg.max;
    changeColorRangeMinMax(leg.min,leg.max);
    draw_map(CalcData);
    addColorLegend_Horizontal();
    return CalcData;
}

function OnClickFunctionApply(){
   if(CalcData.length == 0){
       console.log("This button can be used after drawing map");
       return;
   }
    min = eval(document.forms.ColorLegendRange.Min.value);
    max = eval(document.forms.ColorLegendRange.Max.value);
    changeButtonText("button_change_value","changing");
    changeColorRangeMinMax(min,max);
    draw_map(CalcData);
    addColorLegend_Horizontal();
    changeButtonText("button_change_value","ApplyNewRange");
    return CalcData;
}

function OnClickFunction() {
    min = eval(document.forms.ColorLegendRange.Min.value);
    max = eval(document.forms.ColorLegendRange.Max.value);
    jQuery.when(
        setVariable(),
        changeButtonText("button_exec","Loading&Calculating"),
        CalcVariable(),
        GetPointData()
    ).then(function (retvalue0,retvalue3, m_secondinvariant, m_PointData) {
            if (DEBUG == 1) {
                //console.log(m_secondinvariant);
            }
            CalcData = m_secondinvariant;
            changeColorRangeMinMax(min,max);
            draw_map(m_secondinvariant);
            draw_land(m_secondinvariant);
            addColorLegend_Horizontal();
            changeButtonText("button_exec","Exec");
            PointData = m_PointData;
            return m_secondinvariant;
        });
}

function changeButtonText(buttonID,text){
    var target = document.getElementById(buttonID);
    target.innerHTML = text;
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

    if(target.value == "KonishiMethod"){
        var dateNum = DateToArrayNum(document.getElementById("SecondInvariantDate_input").value);
        if(dateNum == -1){
            console.log("cannot find date");
            return(function(){
                var date = {miss:true};
                return date;
            });
        }
        exec_function.push(KonishiMethod(dateNum));
    }

    //console.log(exec_function);
    return jQuery.when.apply(
        $,exec_function
    ).then(function(){
            if(DEBUG==1) {
                //console.log(arguments[0]);
            }
            return arguments[0];
        });
}

function DateToArrayNum(date)
{
    for(var i=0;i<TimeArray.length;i++){
        if(TimeArray[i] == date){
            //console.log("find date " + TimeArray[i] );
            return i;
        }
    }
    return -1;
}
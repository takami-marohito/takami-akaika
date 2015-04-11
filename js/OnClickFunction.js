/**
 * Created by vizlab on 2015/04/02.
 */

//#include "SecondInvariant.js"
//#include "draw_land.js"

//クリックすると
//1.ユーザの設定した緯度経度を配列番号にする関数をつくる
//2.データをロード、計算
//3.描画
function OnClickFunction() {
    jQuery.when(
        setVariable(),
        loadLatandLonData(),
        button_loading_text(),
        new SecondInvariant(300, 0)
    ).then(function (retvalue0,retvalue2,retvalue2, m_secondinvariant) {
            if (DEBUG == 1) {
                console.log(m_secondinvariant);
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


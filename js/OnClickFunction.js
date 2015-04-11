/**
 * Created by vizlab on 2015/04/02.
 */

//#include "SecondInvariant.js"
//#include "draw_land.js"

var DataCalculating;

function OnClickFunction() {
    jQuery.when(
        setVariable(),
        button_loading_text(),
        new SecondInvariant(300, 0)
    ).then(function (retvalue1,retvalue2,m_secondinvariant) {
            if(DEBUG==1){
                console.log(m_secondinvariant);
            }
            draw_map(m_secondinvariant);
            draw_land();
            addColorLegend_Horizontal();
            button_calculating_finish();
            DataCalculating = m_secondinvariant;
            return m_secondinvariant;
        });
}

function button_loading_text()
{
    var target = document.getElementById("button_exec");
    target.innerHTML = "loading";
    return 0;
}

function button_loading_finish()
{
    var target = document.getElementById("button_exec");
    target.innerHTML = "Calculating";
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

    return 0;
}


/**
 * Created by vizlab on 2015/04/02.
 */

//#include "SecondInvariant.js"
//#include "draw_land.js"

function OnClickFunction() {
    jQuery.when(
        button_loading_text(),
        new SecondInvariant(2, 0)
    ).then(function (retvalue,m_secondinvariant) {
            if(DEBUG==1){
                console.log(m_secondinvariant);
            }
            draw_map(m_secondinvariant);
            draw_land();
            addColorLegend_Horizontal();
            button_loading_finish();
            return m_secondinvariant;
        });
}

function button_loading_text()
{
    var target = document.getElementById("button_exec");
    target.innerHTML = "loading&Calculating";
    return 0;
}

function button_loading_finish()
{
    var target = document.getElementById("button_exec");
    target.innerHTML = "update";
    return 0;
}
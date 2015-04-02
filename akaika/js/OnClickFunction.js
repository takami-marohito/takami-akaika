/**
 * Created by vizlab on 2015/04/02.
 */

//#include "Calc_SecondInvariant.js"
//#include "draw_land.js"

function OnClickFunction()
{

    Calc_SecondInvariant(2, 0)
        .then(function(m_secondinvariant) {
            console.log(m_secondinvariant);
            draw_land(m_secondinvariant);
        });
}
/**
 * Created by vizlab on 2015/04/02.
 */

//#include "SecondInvariant.js"
//#include "draw_land.js"

function OnClickFunction() {
    jQuery.when(
        new SecondInvariant(2, 0)
    ).then(function (m_secondinvariant) {
            draw_map(m_secondinvariant);
            draw_land(m_secondinvariant);
            return m_secondinvariant;
        });
}
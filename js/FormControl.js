/**
 * Created by vizlab on 2015/04/09.
 */

function SelectVariable()
{
    jQuery(function() {
        jQuery('#VariableMode').on('change', function(){
            var target2 = document.getElementById("VariableMode");
            console.log(target2.value + " selected");
            if(target2.value == "SecondInvariant"){
                document.getElementById("SecondInvariant").style.display="inline";
            }
            if(target2.value == "VortexCore"){
                document.getElementById("SecondInvariant").style.display="none";
            }
        });
    });
}
/**
 * Created by vizlab on 2015/04/09.
 */


function SelectVariableEvent()
{
    jQuery(function() {
        jQuery('#VariableMode').on('change', function(){
            var target2 = document.getElementById("VariableMode");
            console.log(target2.value + " selected");
            if(target2.value == "SecondInvariant"){
                document.getElementById("SecondInvariant").style.display="";
                document.getElementById("Filename").style.display="none";
            }
            if(target2.value == "VortexRotation"){
                document.getElementById("SecondInvariant").style.display="none";
                document.getElementById("Filename").style.display="none";
            }
            if(target2.value == "LoadingCalculatedVariable"){
                document.getElementById("SecondInvariant").style.display="none";
                document.getElementById("Filename").style.display="";
            }
        });
    });
}
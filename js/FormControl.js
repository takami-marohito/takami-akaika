/**
 * Created by vizlab on 2015/04/09.
 */


function SelectVariableEvent()
{
    jQuery('#VariableMode').on('change', function(){
        var target2 = document.getElementById("VariableMode");
        console.log(target2.value + " selected");
        if(target2.value == "SecondInvariant"){
            document.getElementById("ColorLegendRange").style.display="";
            document.getElementById("Filename").style.display="none";
            document.getElementById("SecondInvariantDate").style.display="";
            document.getElementById("DownloadDateRange").style.display="none";
            document.getElementById("DrawLine").style.display="none";
        }
        if(target2.value == "VortexRotation"){
            document.getElementById("ColorLegendRange").style.display="";
            document.getElementById("Filename").style.display="none";
            document.getElementById("SecondInvariantDate").style.display="";
            document.getElementById("DownloadDateRange").style.display="";
            document.getElementById("DrawLine").style.display="";
        }
        if(target2.value == "LoadingCalculatedVariable"){
            document.getElementById("ColorLegendRange").style.display="";
            document.getElementById("Filename").style.display="";
            document.getElementById("SecondInvariantDate").style.display="none";
            document.getElementById("DownloadDateRange").style.display="none";
            document.getElementById("DrawLine").style.display="none";
        }
    });
}

function CPUEDataEvent() {
    jQuery('#CPUEFileName').on('change', function () {
        LoadingCPUEFile();
    });
}
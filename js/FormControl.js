/**
 * Created by vizlab on 2015/04/09.
 */


function SelectVariableEvent()
{
    jQuery('#VariableMode').on('change', function(){
        var target2 = document.getElementById("VariableMode");
        console.log(target2.value + " selected");
        if(target2.value == "SecondInvariant"){
            document.getElementById("CalculatedMapData").innerHTML="";
            document.getElementById("Filename").style.display="none";
            document.getElementById("CalculatedLineData").innerHTML="";
            document.getElementById("LineFilename").style.display="none";
            document.getElementById("SecondInvariantDate").style.display="";
            document.getElementById("DownloadDateRange").style.display="none";
            document.getElementById("DrawLine").style.display="none";
            document.getElementById("KonishiFilename").style.display="none";
            document.getElementById("KonishiFilenametext").innerHTML="";
        }
        if(target2.value == "VortexRotation"){
            document.getElementById("CalculatedMapData").innerHTML="";
            document.getElementById("Filename").style.display="none";
            document.getElementById("CalculatedLineData").innerHTML="";
            document.getElementById("LineFilename").style.display="none";
            document.getElementById("SecondInvariantDate").style.display="";
            document.getElementById("DownloadDateRange").style.display="";
            document.getElementById("DrawLine").style.display="";
            document.getElementById("KonishiFilename").style.display="none";
            document.getElementById("KonishiFilenametext").innerHTML="";
        }
        if(target2.value == "LoadingCalculatedVariable"){
            input = new Array(13);
            input[0] = "MapData";
            input[1] = "";
            input[2] = "LineData";
            input[3] = "";
            input[4] = "none";
            input[5] = "none";
            input[6] = "none";
            input[7] = "none";
            input[8] = "";
            input[9] = "none";
            input[10] = "none";
            input[11] = "";
            input[12] = "none";
            input[13] = "none";
            input[14] = "none";
            DisplayParameter(input);
        }
        if(target2.value == "KonishiMethod"){
            input = new Array(13);
            input[0] = "";
            input[1] = "none";
            input[2] = "";
            input[3] = "none";
            input[4] = "";
            input[5] = "none";
            input[6] = "none";
            input[7] = "";
            input[8] = "ResultFile";
            input[9] = "none";
            input[10] = "none";
            input[11] = "";
            input[12] = "none";
            input[13] = "none";
            input[14] = "none";
            DisplayParameter(input);
        }
        if(target2.value == "PreviousMethod"){
            input = new Array(13);
            input[0] = "";
            input[1] = "none";
            input[2] = "";
            input[3] = "none";
            input[4] = "";
            input[5] = "none";
            input[6] = "none";
            input[7] = "none";
            input[8] = "";
            input[9] = "";
            input[10] = "";
            input[11] = "CPUEFile";
            input[12] = "";
            input[13] = "none";
            input[14] = "none";
            DisplayParameter(input);
        }
        if(target2.value == "CalcData"){
            input = new Array(13);
            input[0] = "CPUEFile";
            input[1] = "";
            input[2] = "";
            input[3] = "none";
            input[4] = "none";
            input[5] = "none";
            input[6] = "none";
            input[7] = "none";
            input[8] = "";
            input[9] = "none";
            input[10] = "none";
            input[11] = "";
            input[12] = "none";
            input[13] = "";
            input[14] = "";

            input[15] = "none";
            input[16] = "";
            input[17] = "none";
            input[18] = "";
            input[19] = "none";
            input[20] = "";
            input[21] = "none";
            input[22] = "";
            input[23] = "none";
            input[24] = "";
            input[25] = "none";
            input[26] = "";
            DisplayParameter(input);
        }
        if(target2.value == "CalcAccuracy"){
            input = new Array(13);
            input[0] = "";
            input[1] = "none";
            input[2] = "";
            input[3] = "none";
            input[4] = "none";
            input[5] = "none";
            input[6] = "none";
            input[7] = "";
            input[8] = "ResultFile";
            input[9] = "none";
            input[10] = "none";
            input[11] = "";
            input[12] = "none";
            input[13] = "none";
            input[14] = "none";

            input[15] = "";
            input[16] = "SFile";
            input[17] = "";
            input[18] = "TFile";
            input[19] = "";
            input[20] = "UFile";
            input[21] = "";
            input[22] = "VFile";
            input[23] = "";
            input[24] = "WFile";
            input[25] = "";
            input[26] = "CPUEFile";
            DisplayParameter(input);
        }
    });
}

function CPUEDataEvent() {
    jQuery('#CPUEFileName').on('change', function () {
        LoadingCPUEFile();
    });
}

function CPUEDataEventForRungeKutta() {
    jQuery('#CPUE_FOR_RUNGEKUTTA').on('change', function () {
        LoadingCPUEForRungeKutta();
    });
}

function DisplayParameter(box)
{
    document.getElementById("CalculatedMapData").innerHTML=box[0];
    document.getElementById("Filename").style.display=box[1];
    document.getElementById("CalculatedLineData").innerHTML=box[2];
    document.getElementById("LineFilename").style.display=box[3];
    document.getElementById("SecondInvariantDate").style.display=box[4];
    document.getElementById("DownloadDateRange").style.display=box[5];
    document.getElementById("DrawLine").style.display=box[6];
    document.getElementById("KonishiFilename").style.display=box[7];
    document.getElementById("KonishiFilenametext").innerHTML=box[8];
    document.getElementById("CalcLonRange").style.display=box[9];
    document.getElementById("CalcLatRange").style.display=box[10];
    document.getElementById("PreviousMethodFiletext").innerHTML=box[11];
    document.getElementById("PreviousMethodFile").style.display=box[12];
    document.getElementById("PathLineNumber").style.display=box[13];
    document.getElementById("Progress").style.display=box[14];

    document.getElementById("SFilename").style.display=box[15];
    document.getElementById("SFilenametext").innerHTML=box[16];
    document.getElementById("TFilename").style.display=box[17];
    document.getElementById("TFilenametext").innerHTML=box[18];
    document.getElementById("UFilename").style.display=box[19];
    document.getElementById("UFilenametext").innerHTML=box[20];
    document.getElementById("VFilename").style.display=box[21];
    document.getElementById("VFilenametext").innerHTML=box[22];
    document.getElementById("WFilename").style.display=box[23];
    document.getElementById("WFilenametext").innerHTML=box[24];
    document.getElementById("CheckCorrectCPUEFilename").style.display=box[25];
    document.getElementById("CheckCorrectCPUEFilenametext").innerHTML=box[26];
}
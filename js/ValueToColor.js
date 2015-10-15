/**
 * Created by vizlab on 2015/10/15.
 */
var interpolate_rgb = d3.scale.linear().domain([colorlegend_min,(colorlegend_min+colorlegend_max)/2.0,colorlegend_max]).range(["blue","green","red"]).clamp(true);
//関数内で定義したら時間がかかった->何度もこれを実行するから
function SecondInvariantToRGB(value)
{
    //陸地の処理
    if(value < -5000){
        var color_land = {
            red:0.1,
            green:0.1,
            blue:0.1
        };
        return(color_land);
    }

    value_rgb_string = interpolate_rgb(value);

    value_hex = {
        red:value_rgb_string.slice(1,3),
        green:value_rgb_string.slice(3,5),
        blue:value_rgb_string.slice(5,7)
    };
    //console.log(value_hex);
    var color = {
        red:parseInt(value_hex.red,16)/256.0,
        green:parseInt(value_hex.green,16)/256.0,
        blue:parseInt(value_hex.blue,16)/256.0
    };
    return(color);
}

var interpolate_hsl = d3.scale.linear().domain([colorlegend_min,(colorlegend_min+colorlegend_max)/2.0,colorlegend_max]).range([0.66,0.33,0]).clamp(true);  //hslでは0.66が青で0が赤
function SecondInvariantToHSL(value)
{
    //陸地の処理
    if(value < -5000){
        var color_land = {
            h:0.1,
            s:0,
            l:0
        };
        return(color_land);
    }

    var hofhsl = interpolate_hsl(value);
    //console.log(value_hex);
    var color = {
        h:hofhsl,
        s:1.0,
        l:0.5
    };
    return(color);
}

var interpolate_white = d3.scale.linear().domain([colorlegend_min,(colorlegend_min+colorlegend_max)/2.0,colorlegend_max]).range([0,0.5,1]).clamp(true);  //hslでは0.66が青で0が赤
function SecondInvariantToHSL_white(value)
{
    //へんな値の処理（陸地や計算ミスなど）
    if(value < -5000 || value == undefined){
        var color_land = {
            h:0,
            s:0,
            l:0.2
        };
        return(color_land);
    }

    var location = interpolate_white(value);
    //console.log(value_hex);
    if(location >= 0.5){
        var color = {
            h:0,
            s:1.0,
            l:1.5 - location
        };
        return color;
    }else{
        var color = {
            h:0.66,
            s:1.0,
            l:location+0.5
        };
        return color;
    }
    return(color);
}

function VortexTypeToHSL_white(value)
{
    if(value == "stable"){
        var color = {
            h:0,
            s:1.0,
            l:0.6
        };
        return color;
    }
    if(value == "unstable"){
        var color = {
            h:0.66,
            s:1.0,
            l:0.6
        };
        return color;
    }
    var color = {
        h:0,
        s:0,
        l:0
    };
    return(color);
}
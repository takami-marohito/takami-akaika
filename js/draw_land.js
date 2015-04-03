/**
 * Created by vizlab on 15/03/25.
 */



function draw_land(input)
{
    target = document.getElementById("output2");
    target.innerHTML = input.data[3][3];
    check_minmax_2Dmatrix(input);
}

//二次元配列の最大最小を求めてmin,maxを追加する
function check_minmax_2Dmatrix(input)
{
    var min=10;
    var max=-10;
    for(var i=0;i<input[0].length;i++){
        for(var j=0;j<input.length;j++){
            if(input[j][i]<min) {
                min = input[j][i];
            }
            if(input[j][i]>max){
                max=input[j][i];
            }
            if(Number.isNaN(input[j][i] == true)){
                input[j][i] = -50;
            }
            //console.log(input[i][j]);
        }
    }
}
/**
 * Created by vizlab on 15/03/25.
 */



function draw_land(input)
{
    console.log("time is " + input.u.time);
    console.log("depth is " + input.u.depth);
    target = document.getElementById("output2");
    target.innerHTML = input.u.data[3][3];
}
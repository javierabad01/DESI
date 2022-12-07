var output =document.getElementById("actYear2");
var slider =document.getElementById("year2").oninput=function(){
    var value = (this.value-this.min)/(this.max-this.min)*100

    output.innerHTML=this.value;
}
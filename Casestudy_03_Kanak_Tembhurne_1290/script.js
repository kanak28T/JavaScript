let marks = document.querySelectorAll(".marks");
let grades = document.querySelectorAll(".grade");

function getGrade(mark){

if(mark>=90)
return "O";

else if(mark>=80)
return "A+";

else if(mark>=70)
return "A";

else if(mark>=60)
return "B+";

else if(mark>=50)
return "B";

else if(mark>=40)
return "P";

else
return "F";

}

marks.forEach((input,index)=>{

// Keyboard Event
input.addEventListener("keyup",function(){

let value=Number(this.value);

grades[index].innerHTML=getGrade(value);

});

// Prevent invalid keys

input.addEventListener("keydown",function(e){

if(e.key=="-" || e.key=="e"){

e.preventDefault();

}

});

// Mouse Event

input.addEventListener("mouseover",function(){

this.style.backgroundColor="lightyellow";

});

input.addEventListener("mouseout",function(){

this.style.backgroundColor="white";

});

// Validation

input.addEventListener("blur",function(){

if(this.value>100){

alert("Marks cannot exceed 100");

this.value="";
grades[index].innerHTML="";

}

});

});

let calculate=document.getElementById("calculate");

// Mouse Events

calculate.addEventListener("mouseover",function(){

calculate.style.backgroundColor="blue";

});

calculate.addEventListener("mouseout",function(){

calculate.style.backgroundColor="green";

});

// Click Event

calculate.addEventListener("click",calculateResult);

function calculateResult(){

let total=0;

let count=0;

marks.forEach(function(subject){

if(subject.value!=""){

total+=Number(subject.value);

count++;

}

});

if(count==0){

alert("Enter Marks");

return;

}

let percentage=total/count;

let overall=getGrade(percentage);

document.getElementById("result").innerHTML=

`
Student : ${document.getElementById("name").value}<br>
Total Marks : ${total}<br>
Percentage : ${percentage.toFixed(2)}%<br>
Overall Grade : <b>${overall}</b>

`;

}

// Reset Button Event

document.getElementById("reset").addEventListener("click",function(){

alert("Form Reset Successfully");

});
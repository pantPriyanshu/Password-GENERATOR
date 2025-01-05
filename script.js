const inputSlider = document.querySelector("[data-lengthslider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generate-password");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "";
let passwordLength=10;
let checkCount=0;
handleSlider();
// set circle color to grey
setIndicator("#ccc");
// set password length
function handleSlider(){
     inputSlider.value =passwordLength;
     lengthDisplay.innerText=passwordLength;

    
}


function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function setIndicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
    
}

function getRandomInteger(min,max){

    return Math.floor(Math.random()*(max-min))+min;
}


function getRandomNumber(){
        return getRandomInteger(0,9);
}

function getRandomLowerCase(){
    // console.log("lowercasgetRandomInteger(97,123));
    return String.fromCharCode(getRandomInteger(97,122));
}

function getRandomUpperCase(){
    return String.fromCharCode(getRandomInteger(65,90));
}


function getRandomSymbol(){

       let i= getRandomInteger(0,symbols.length);

       return symbols.charAt(i);

}

function calculateStrength(){

    let hasUpper =false;
    let haslower =false;
    let hasnum =false;
    let hassymb =false;

    if(uppercaseCheck.checked) hasUpper=true;
    if(lowercaseCheck.checked) haslower=true;
    if(numbersCheck.checked) hasnum=true;
    if(symbolsCheck.checked) hassymb=true;

    if(hasUpper && haslower && (hasnum || hassymb) && passwordLength>=8 ){
        setIndicator("#0f0");

    }else if((hasUpper||haslower) && (hasnum || hassymb) && passwordLength>=6){

        setIndicator("#ff0");

    }else{
        setIndicator("#f00")
    }


}


async function copyContent(){

    try {

        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText="copied";
        
    } catch (error) {

        copyMsg.innerText="failed";
        
    }

    copyMsg.classList.add("active");

    setTimeout(()=> {
        copyMsg.classList.remove("active");
    },2000); 

}


function handleCheckBoxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
            checkCount++;
    });
    
    // special if all box checked and lenght is less than 4 then lenght will become 4 
    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }
}



allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
});


copyBtn.addEventListener('click', (e)=>{

    if(passwordDisplay.value){
        copyContent();
    }
});

inputSlider.addEventListener('input', (e)=>{

    passwordLength=e.target.value;
    handleSlider();
})




generateBtn.addEventListener('click', ()=>{

    if(checkCount==0)
        return;//none of checkbox is selected

    if(passwordLength<checkCount){
        passwordLength=checkCount;
        handleSlider();
    }

    // remove old pass 
    password="";

    let funcArr=[];

    if(uppercaseCheck.checked)
        funcArr.push(getRandomUpperCase);
    
    if(lowercaseCheck.checked)
        funcArr.push(getRandomLowerCase);

    if(numbersCheck.checked)
        funcArr.push(getRandomNumber);

    if(symbolsCheck.checked)
        funcArr.push(getRandomSymbol);


    // compulsory addition

    for(let i=0;i<funcArr.length;i++){

        password+=funcArr[i]();
    }

    // remaining addition

    for(let i=0; i<passwordLength-funcArr.length;i++){
            let ri=getRandomInteger(0,funcArr.length);
        password+=funcArr[ri]();
    }

    // shuffle the password
    password=shufflePassword(Array.from(password));

    // show the password in UI
    passwordDisplay.value=password;
    
    // show the color according to the strenght
    calculateStrength();


     
}) 

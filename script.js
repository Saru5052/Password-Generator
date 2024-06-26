 const inputSlider = document.querySelector("[data-lengthSlider]"); //if u use custom attribute for calling we use "[]" 

 const lengthDisplay = document.querySelector("[data-lengthNumber]");

 const indicator = document.querySelector("[data-strengthIndicator]");

 const passwordDisplay = document.querySelector("[data-passwordDisplay]");

 const copyBtn = document.querySelector("[data-copyButton]");

 const generateBtn = document.querySelector(".generateButton");

 const allCheckBox = document.querySelectorAll("input[type=checkbox]");

 const copyMsg = document.querySelector("[data-copyMsg]");

 const symbol = '~`!@#$%^&*()-_=+[{]}\\|;:,<.>/?';

 // making funtion for slider, default set is 10
 let password = "";
 let passwordLength = 10;
 let checkBoxCount = 0;

 //set strength circle color to grey
 setIndicator("#ccc");

 function handleSlider() {

     inputSlider.value = passwordLength;
     lengthDisplay.innerText = passwordLength;

     const min = inputSlider.min;
     const max = inputSlider.max;
     inputSlider.style.backgroundSize = ((passwordLength - min) * 100 / (max - min)) + "% 100%"
 }

 handleSlider();

 function setIndicator(color) {
     indicator.style.backgroundColor = color;
     indicator.style.boxShadow = `0px 0px 12px 2px ${color}`
 }

 function getRandInteger(min, max) {
     return Math.floor(Math.random() * (max - min)) + min;
 }

 function generateRandomNumber() {
     return getRandInteger(0, 9);
 }

 function generateLowerCase() { //we are using askie value of alphabates 
     return String.fromCharCode(getRandInteger(97, 123)); // String.fromCharCode use for convert numbers into lower case alphabates
 }

 function generateUpperCase() { //we are using askie value of alphabates 
     return String.fromCharCode(getRandInteger(65, 90)); // String.fromCharCode use for convert numbers into Upper case alphabates
 }

 function generateSymbol() {
     const randNum = getRandInteger(0, symbol.length);
     return symbol.charAt(randNum);
 }

 function calcStrength() {
     let hasUpper = false;
     let hasLower = false;
     let hasNum = false;
     let hasSym = false;

     if (uppercaseCheck.checked) hasUpper = true;
     if (lowercaseCheck.checked) hasLower = true;
     if (numbersCheck.checked) hasNum = true;
     if (symbolsCheck.checked) hasSym = true;

     if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
         setIndicator("#0f0");
     } else if ((hasLower || hasUpper) && (hasNum || hasSym) && passwordLength >= 6) {
         setIndicator("#ff0");
     } else {
         setIndicator("#f00");
     }

 }

 async function copyContent() {
     try {
         await navigator.clipboard.writeText(passwordDisplay.value); //n.c.w this method used to write on the clipboard and returns promise when promise completed "copied" text get diplayed. 
         copyMsg.innerText = "copied";
     } catch (e) {
         copyMsg.innerText = "failed";
     }

     // to make copy wala span visible

     copyMsg.classList.add("active");

     setTimeout(() => {
         copyMsg.classList.remove("active");
     }, 2000);
 }

 function handleCheckBoxChange() {
     checkBoxCount = 0;
     allCheckBox.forEach((checkbox) => {
         if (checkbox.checked)
             checkBoxCount++;
     });
     //  special function for checkBox

     if (passwordLength < checkBoxCount) {
         passwordLength = checkBoxCount;
         handleSlider();
     }
 }

 function shufflePassword(array) {
     // we shuffle the password using Fisher yates method or algorithm
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


 inputSlider.addEventListener('input', (e) => {
     passwordLength = e.target.value;
     handleSlider();
 })

 copyBtn.addEventListener('click', () => {
     if (passwordDisplay.value) {
         copyContent();
     }
 });


 allCheckBox.forEach((checkbox) => {
     checkbox.addEventListener('change', handleCheckBoxChange); //
 })

 generateBtn.addEventListener('click', () => {
     //none of the check are selected
     if (checkBoxCount == 0) return; //its actually returns nothing if one the check box is not seletected

     //specail case
     if (passwordLength < checkBoxCount) {
         passwordLength = checkBoxCount;
         handleSlider();
     }

     //Here is the journey to find new passwords

     //1st will remove the old password
     password = "";

     //let's put the stuff mentioned by checkBoxes

     //  if (uppercaseCheck.checked) {
     //      password += generateUpperCase();
     //  }

     //  if (lowercaseCheck.checked) {
     //      password += generateLowerCasee();
     //  }
     //  if (numbersCheck.checked) {
     //      password += generateRandomNumber();
     //  }

     //  if (symbolCheck.checked) {
     //      password += generateSymbol();
     //  }

     let funcArr = []

     if (uppercaseCheck.checked) {
         funcArr.push(generateUpperCase);
     }

     if (lowercaseCheck.checked) {
         funcArr.push(generateLowerCase);
     }

     if (numbersCheck.checked) {
         funcArr.push(generateRandomNumber);
     }

     if (symbolsCheck.checked) {
         funcArr.push(generateSymbol);
     }

     //adding countes of checkbox
     for (let i = 0; i < funcArr.length; i++) {
         password += funcArr[i]();
     }

     //remaing character
     for (let i = 0; i < passwordLength - funcArr.length; i++) {
         let randIndex = getRandInteger(0, funcArr.length);
         console.log(randIndex);
         password += funcArr[randIndex]();
     }

     //shuffle the password
     password = shufflePassword(Array.from(password));

     //show in UI
     passwordDisplay.value = password;

     //calculate strength;
     calcStrength();

 });
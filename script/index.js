let textInput = document.querySelector(".text-input");
let sendBtn = document.querySelector(".send-btn");
let chartList = document.querySelector(".chart-list");
let geminiHome=document.querySelector(".gemini-home");
let deleteBtn=document.querySelector(".delete-btn");

let userMessage = null;
let currentUser="";
const API_KEY=`AIzaSyD2EgptsU7VUj8Y40T4Q8rBPDHTqTmQhp4`;
const API_URL=`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;


function handleHeaderName(){
  currentUser=document.querySelector(".identify-input").value;
  saveData();
  document.querySelector(".identify-input").value="";
}

window.onload = function() {
  getData();
};

function saveData() {
  localStorage.setItem("currentUserName",currentUser);
}


function getData()
{
  geminiHome.querySelector(".header").innerText=`Hello , ${localStorage.getItem("currentUserName")}`;
}

const createMessageElement = (content, ...className) => {
  const div = document.createElement("div");
  div.classList.add("message", ...className);
  div.innerHTML = content;
  return div;
};

const showTypingEffect=(text,textElement)=>{
     const words=text.split(" ");
     let currentWordIndex=0;
     
     const typeInterval=setInterval(()=>{
      textElement.innerText +=(currentWordIndex===0?"":" ")+words[currentWordIndex++];
      if(currentWordIndex === words.length)
        {
         clearInterval(typeInterval);
        }
     },75);

}

const generateAPIResponse=async (incomingMessageDiv)=>{

    const textElement=incomingMessageDiv.querySelector(".text");
     try{
        const response=await fetch(API_URL,{
            method:"POST",
             headers:{"Content-Type": "application/json"},
             body:JSON.stringify({
                contents:[{
                    role:"user",
                    parts:[{text:userMessage}]
                }]
             })

        })

        const data=await response.json();
        const apiResponse=data?.candidates[0].content.parts[0].text;
        showTypingEffect(apiResponse,textElement);
     }catch(error){
        console.log(error);
     }finally{
        incomingMessageDiv.classList.remove("loading");
     }
}

function handleCopyClick(copyIcon){
    const messageText=copyIcon.parentElement.querySelector(".text").innerText;
    navigator.clipboard.writeText(messageText);
    setTimeout(()=>{
      copyIcon.innerHTML=`<i class="fa-solid fa-check"></i>`;
    },75)

}


const showLoadingAnimation = () => {
  const html = `<div class="message-content">
                    <img src="../image/gemini.svg" alt="loading" class="avtar">
                    <p class="text"></p>
                    <div class="loading-indicator">
                        <div class="loading-bar"></div>
                        <div class="loading-bar"></div>
                        <div class="loading-bar"></div>
                    </div>
                </div>
                <div class="copy-btn" onclick="handleCopyClick(this)"><i class="fa-regular fa-copy" class="copy-btn"></i></div>`;

  const incomingMessageDiv = createMessageElement(html, "incoming","loading");
  chartList.appendChild(incomingMessageDiv);
  generateAPIResponse(incomingMessageDiv);
};


const handleOutGoingChart = () => {
  userMessage = textInput.value.trim();
  if (!userMessage) {
    return;
  }
  geminiHome.querySelector(".header").classList.add("auto-message");
  const html = `<div class="message-content">
                    <img src="../image/1.jpg" alt="loading" class="avtar">
                    <p class="text"></p>
                </div>`;

  const outGoingMessageDiv = createMessageElement(html, "outgoing");
  outGoingMessageDiv.querySelector(".text").innerText = userMessage;
  chartList.appendChild(outGoingMessageDiv);
  textInput.value = "";
  setTimeout(showLoadingAnimation, 500);
};


sendBtn.addEventListener("click", () => {
  handleOutGoingChart();
});

deleteBtn.addEventListener("click",()=>{
  chartList.innerHTML=``;
  geminiHome.querySelector(".header").classList.remove("auto-message");
  document.querySelector(".text-input").value="";
})




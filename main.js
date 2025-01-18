let prompt = document.querySelector("#prompt")
let submit = document.querySelector('#submit')
let chatcontainer = document.querySelector(".chat-container")
let imgbtn = document.querySelector("#image")
let img = document.querySelector("#image img")
let imginput = document.querySelector("#image input")



function createchatbox(html, classes) {
    let div = document.createElement("div")
    div.innerHTML = html
    div.classList.add(classes)
    return div
}


const Api_url = "....."
let user = {
    message: null,
    file: {
        mime_type: null,
        data: null
    }
}


async function generateresponse(aichatbox) {
    let text = aichatbox.querySelector(".ai-chatarea")

    let requestoption = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "contents": [{
                "parts": [{ "text": user.message }, ...(user.file.data ? [{ "inline_data": user.file }] : [])]
            }]
        })
    }
    try {
        let response = await fetch(Api_url, requestoption)
        let data = await response.json()
        let apiresponse = data.candidates && data.candidates.length > 0 && data.candidates[0].content?.parts?.[0]?.text.replace(/\*\*(.*?)\*\*/g, "$1").trim()
        text.innerHTML = apiresponse

    } catch (error) {
        console.log(error)
    }

    finally {
        chatcontainer.scrollTo({ top: chatcontainer.scrollHeight, behavior: "smooth" })
        img.src = `img/img.svg`
        img.classList.remove("chose")
        user.file={}
    }
}



function chatresponse(message) {
    user.message = message
    let html = ` <img src="img/user.png" id="userimg" alt="" width="10%">
            <div class="user-chatarea">
                ${user.message}
                ${user.file.data ? `<img src="data:${user.file.mime_type};base64,${user.file.data}"class="chooseimg"/>` : ""}

            </div>`
    prompt.value = ""
    let userchatbox = createchatbox(html, "user-chatbox")
    chatcontainer.appendChild(userchatbox)

    chatcontainer.scrollTo({ top: chatcontainer.scrollHeight, behavior: "smooth" })

    setTimeout(() => {
        let html = `<img src="img/ai.png" id="aimg" alt="" width="10%">
            <div class="ai-chatarea">
                <img src="img/loading.webp" width="50px" alt="">
            </div>`
        let aichatbox = createchatbox(html, "ai-chatbox")
        chatcontainer.appendChild(aichatbox)
        generateresponse(aichatbox);
    }, 500)
}




prompt.addEventListener("keydown", (e) => {

    if (e.key == "Enter") {
        chatresponse(prompt.value);
    }


})
submit.addEventListener("click",()=>{
    chatresponse(prompt.value);
})
imginput.addEventListener("change", () => {
    const files = imginput.files
    if (!files || files.length === 0) return
    const file = files[0];
    let reader = new FileReader()
    reader.onload = (e) => {
        let base64string = e.target.result.split(",")[1]
        user.file = {
            mime_type: file.type,
            data: base64string
        }
        img.src = `data:${user.file.mime_type};base64,${user.file.data}`
        img.classList.add("chose")

    }


    reader.readAsDataURL(file)
})


imgbtn.addEventListener("click", () => {
    imginput.click();
})
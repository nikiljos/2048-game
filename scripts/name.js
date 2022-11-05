let $submit=document.getElementById("submit");
let $nickName=document.getElementById("nickname");
let $userName = document.getElementById("username");
let $status=document.getElementById("status");

let nickName=localStorage.getItem("nickname");
let userName = localStorage.getItem("username");

if(userName!=null){
    $nickName.value=nickName
}
if(nickName!=null){
    $userName.value=userName
}

//set name and nickname to localstorage on clicking submit
$submit.onclick=()=>{
    let nickNameInput=$nickName.value;
    let userNameInput=$userName.value;
    if(nickNameInput==""||userNameInput==""){
        $status.innerText="Please check your input!"
    }
    else{
        localStorage.setItem("nickname",nickNameInput);
        localStorage.setItem("username",userNameInput);
        $status.innerText="Successfully Updated!"
    }
    $status.classList.remove("hide")
}
function validateUser(){
    let email = document.forms["loginForm"]["email"].value;
    let password = document.forms["loginForm"]["password"].value;

    let users = JSON.parse(localStorage.getItem('members'));
    let userFullName = "";
    users.forEach(element => {
        if (element.email == email && element.password == password){
            localStorage.setItem("loggedUserId", element.id);
            location.reload();
        }
    });
    return true;
}
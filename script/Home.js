$('#dark-toggle').on('click',function(){
    $('body').toggleClass("dark-mode");
    if ($('body').hasClass("dark-mode")) 
    {
        $('#dark-toggle').text('☀️');
    } 
    else {
        $('#dark-toggle').text('🌙');
    }
})

const loginemail = $('#loginemail');
const loginpassword = $('#loginpassword');
const loginbtn = $('#loginbtn');

const API = "https://to-do-lister.onrender.com/users";

async function validate(e)
{
    e.preventDefault();

    const loginemail_pattern = /^[a-zA-Z\d]+@[a-zA-Z]+\.[a-zA-Z]{2,}$/;
    const loginpassword_pattern = /^(?=.*[a-zA-Z])(?=.*\d)(?=.*[@#$%&.])[A-Za-z\d@#$%&.]{6,15}$/;

    let loginemail_tested = loginemail_pattern.test(loginemail.val());

    if(loginemail.val() == "" || loginpassword.val() == "")
    {
        toastr.error("Enter Some Value", "Login Failed");
    }
    else
    {
    if(!loginemail_tested)
    {
        toastr.error("Invalid Email", "Login Failed");
    }

    let loginpassword_tested = loginpassword_pattern.test(loginpassword.val());

    if(!loginpassword_tested)
    {
        toastr.error("Invalid Password", "Login Failed");
    }
    }

    const response = await fetch(API);
    const user = await response.json();
    console.log(user);
    let validuser = false;

     user.forEach(element =>{
        if(element.email == loginemail.val() && element.password == loginpassword.val())
        {
            const userDetails = {
                Userid : element.id,
                Name : element.name
            }
            validuser = true;
            localStorage.setItem(
                "Userdetail",
                JSON.stringify(userDetails)
            );
        }
    });

    if(validuser)
    {
        toastr.success("Login Successful");
        setTimeout(() => {
            window.location.replace("Main.html");
        }, 3200);
    }
    else
    {
        toastr.error("Invalid Email or Password", "Login Failed");
    }
    console.log(user[0].name)

    // toastr.success("lOG IN   Successful");   
}

toastr.options = {
    "closeButton": true,
    "progressBar": true,
    "positionClass": "toast-bottom-right",
    "timeOut": "3000"
};

loginbtn.on('click',validate);

const signinname = $('#signinname');
const signinemail = $('#signinemail');
const signinpassword = $('#signinpassword');
const signincfnpassword = $('#signincfnpassword');
const signindob = $('#signindob');
const siginrole = $('#signinrole');
const signinaddress = $('#signinaddress');
const signinbtn = $('#signinbtn');

const name_pattern = /^[A-Za-z ]{3,}$/;
const email_pattern = /^[a-zA-Z\d._%+-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
const password_pattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%&.])[A-Za-z\d@#$%&.]{6,15}$/;

signinname.on('input',function(){
    if(!name_pattern.test(signinname.val().trim()))
    {
        $("#signinnameerror").text("Name should be above 2 letters");
        $(this).addClass("is-invalid")
        $(this).removeClass("is-valid")
    }
    else
    {
        $("#signinnameerror").text("")
        $(this).addClass("is-valid")
        $(this).removeClass("is-invalid")
        localStorage.setItem("name",signinname.val())
    }
});
signinemail.on('input',function(){
    if(!email_pattern.test(signinemail.val().trim()))
    {
        $("#signinemailerror").text("Not a Valid Email")
        $(this).addClass("is-invalid");
        $(this).removeClass("is-valid");
    }
    else
    {
        $("#signinemailerror").text("")
        $(this).addClass("is-valid");
        $(this).removeClass("is-invalid");
        localStorage.setItem("email",signinemail.val())
    }
});
signinpassword.on('input',function(){
    if(!password_pattern.test(signinpassword.val().trim()))
    {
        $("#signinpassworderror").text("Password should have 1 Uppercase,1 special Character and a number")
        $(this).addClass("is-invalid");
        $(this).removeClass("is-valid");
    }
    else
    {
        $("#signinpassworderror").text("")
        $(this).addClass("is-valid");
        $(this).removeClass("is-invalid");
    }
});
signincfnpassword.on('input',function(){
    if(signincfnpassword.val() != signinpassword.val() )
    {
        $("#signincfnpassworderror").text("Password should have 1 Uppercase,1 special Character and a number")
        $(this).addClass("is-invalid");
        $(this).removeClass("is-valid");
    }
    else
    {
        $("#signincfnpassworderror").text("")
        $(this).addClass("is-valid");
        $(this).removeClass("is-invalid");
    }
});
signindob.on('input',function(){

    const today = new Date();
    const dob = new Date($(this).val());
    let age = today.getFullYear() - dob.getFullYear();

    const monthdiff = today.getMonth() - dob.getMonth();

    if(monthdiff < 0 ||
        (monthdiff === 0 && today.getDate() < dob.getDate()) 
    )
    {
        age--;
    }
    if(age >= 12)
    {
        $("#signindoberror").text("");
        $(this).addClass("is-valid");
        $(this).removeClass("is-invalid");
        localStorage.setItem("dob",$(this).val())
    }
    else
    {
        $("#signindoberror").text("Age must be 12 or above");
        $(this).addClass("is-invalid");
        $(this).removeClass("is-valid");
    }
});

$('input[name="gender"]').on('change', function(){

    const gender = $('input[name="gender"]:checked').val();

    if(gender === undefined)
    {
        $("#gendererror").text("Please select a gender");
    }
    else
    {
        $("#gendererror").text("");
        localStorage.setItem("gender",$('input[name="gender"]:checked').val())
    }

});
siginrole.on('change',function(){
    if($(this).val() === " ")
    {
        $("#signinroleerror").text("Please Select a role")
        $(this).addClass("is-invalid");
        $(this).removeClass("is-valid");
    }
    else
    {
        $("#signinroleerror").text("")
        $(this).addClass("is-valid");
        $(this).removeClass("is-invalid");
        localStorage.setItem("role",$(this).val())
    }
});

signinaddress.on('input',function(){

    if(signinaddress.val().trim().length < 10)
    {
        $("#signinaddresserror").text("Address must be above 10 Words");
        $(this).addClass("is-invalid");
        $(this).removeClass("is-valid");
    }
    else
    {
        $("#signinaddresserror").text("");
        $(this).addClass("is-valid");
        $(this).removeClass("is-invalid");
        localStorage.setItem("address",$(this).val())
    }
})

function opensiginmodel()
{
        let updatesigninname = localStorage.getItem("name");
        let updatesigninemail = localStorage.getItem("email");
        let updatesigningender = localStorage.getItem("gender")
        let updatesignindob = localStorage.getItem("dob");
        let updatesiginrole = localStorage.getItem("role");
        let updatesigninaddress = localStorage.getItem("address");

        signinname.val(updatesigninname);
        signinemail.val(updatesigninemail);
        $(`input[name="gender"][value="${updatesigningender}"]`).prop("checked",true)
        signindob.val(updatesignindob);
        siginrole.val(updatesiginrole);
        signinaddress.val(updatesigninaddress);
}

$("#signinbtnopenmodel").on('click',opensiginmodel)

async function signinValidate(e)
{
    e.preventDefault();

        if(
        signinname.val() == "" ||
        signinemail.val()  == "" ||
        signinpassword.val()  == "" ||
        signindob.val()  == "" ||
        siginrole.val()  == "" ||
        signinaddress.val()  == ""
    )
    {
        toastr.error("All Fields Are Required");
        return
    }

const user ={
    name : signinname.val().trim(),
    email : signinemail.val().trim(),
    password : signinpassword.val().trim(),
    dob : signindob.val(),
    gender : $('input[name="gender"]:checked').val(),
    role : siginrole.val(),
    address : signinaddress.val().trim()
}
try
    {
        let alreadyExists = false;
        const response_user = await fetch(API) 
        const Ex_user = await response_user.json();

        Ex_user.forEach(element => {
            if(user.email == element.email)
            {
                alreadyExists = true;
            }
        });
        if(alreadyExists){
            toastr.error("User Already Exist Please Try Log In")
        }
        else
        {
            const response = await fetch(API,{
            method : "POST",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify(user)
        })
        Swal.fire(
                {
                    title : 'Sign In Success',
                    text : 'Please Log In using same credentials',
                    icon : 'success',

                    showCancelButton : true
                }
            )
        }
        const modal = bootstrap.Modal.getInstance(document.getElementById('signinmodal'))
        modal.hide()
    }
    catch(error)
    {
        toastr.error(error);
        console.log(error);
        return;
    }
}

signinbtn.on('click',signinValidate)

    // let users = JSON.parse(localStorage.getItem("users")) || [];

    // let alreadyExists = users.find( 
    // element => element.email === email
    // );
    // if(alreadyExists)
    // {
    //     toastr.error("Email Already Registered");
    //     return;
    // }

    // users.push(userdata);
    // localStorage.setItem("users", JSON.stringify(users));
    // toastr.success("Registration Successful");

// async function signinValidate(e)
// {
//     e.preventDefault();

//     const name_pattern = /^[A-Za-z ]{3,}$/;
//     const email_pattern = /^[a-zA-Z\d._%+-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;
//     const password_pattern = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@#$%&.])[A-Za-z\d@#$%&.]{6,15}$/;

//     const name = signinname.val().trim();
//     const email = signinemail.val().trim();
//     const password = signinpassword.val().trim();
//     const cfnpassword = signincfnpassword.val().trim();
//     const dob = signindob.val();
//     const gender = $('input[name="gender"]:checked').val();
//     const role = siginrole.val();
//     const address = signinaddress.val().trim();
//     const today = new Date();
//     const birthdate = new Date(dob);
//     let age = today.getFullYear() - birthdate.getFullYear();
//     const monthdiff =  today.getMonth() - birthdate.getMonth();

//     console.log(birthdate)
//     console.log(age)
//     console.log(role)

//     if(
//         name == "" ||
//         email == "" ||
//         password == "" ||
//         cfnpassword == "" ||
//         dob == "" ||
//         address == ""
//     )
//     {
//         toastr.error("All Fields Are Required");
//         return;
//     }

//     if(!name_pattern.test(name))
//     {
//         toastr.error("Name should be above 2 letters");
//         return;
//     }

//     if(!email_pattern.test(email))
//     {
//         toastr.error("Invalid Email");
//         return;
//     }

//     if(!password_pattern.test(password))
//     {
//         toastr.error("Password should have 1 Uppercase,1 special Character and a number");
//         return;
//     }

//     if(password !== cfnpassword)
//     {
//         toastr.error("Passwords Do Not Match");
//         return;
//     }
//     if(monthdiff < 0 || (monthdiff === 0 && today.getDate() < birthdate.getDate() ))
//     {
//         age--;
//     }
//     if(age <= 12)
//     {
//         toastr.error("AGE must be 12+");
//         return;
//     }
//     if(!gender)
//     {
//         toastr.error("Select Gender");
//         return;
//     }

//     if(role === "")
// {
//     alert("Please select a role");
// }

//     if(address.length < 10)
//     {
//         toastr.error("Address Too Short");
//         return;
//     }

//     const user = {
//         name : name,
//         email : email,
//         password : password,
//         dob : dob,
//         gender : gender,
//         role : role,
//         address : address
//     }

//     try
//     {
//         let alreadyExists = false;
//         const response_user = await fetch(API) 
//         const Ex_user = await response_user.json();

//         Ex_user.forEach(element => {
//             if(email == element.email)
//             {
//                 alreadyExists = true;
//             }
//         });
//         if(alreadyExists){
//             toastr.error("User Already Exist Please Try Log In")
//         }
//         else
//         {
//             const response = await fetch(API,{
//             method : "POST",
//             headers : {
//                 "content-type" : "application/json"
//             },
//             body : JSON.stringify(user)
//         })
//         }
//     }
//     catch(error)
//     {
//         toastr.error(error);
//         console.log(error)
//     }

//     // let users = JSON.parse(localStorage.getItem("users")) || [];

//     // let alreadyExists = users.find( 
//     // element => element.email === email
//     // );
//     // if(alreadyExists)
//     // {
//     //     toastr.error("Email Already Registered");
//     //     return;
//     // }

//     // users.push(userdata);
//     // localStorage.setItem("users", JSON.stringify(users));
//     // toastr.success("Registration Successful");

// }

// signinbtn.on('click', signinValidate);

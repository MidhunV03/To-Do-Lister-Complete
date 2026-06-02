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

const API = "http://localhost:3000/users";

const currentUser =JSON.parse(localStorage.getItem("Userdetail"));
console.log(currentUser.Userid)

window.onload = async function fetching() {
    
    try
    {
        const response = await fetch(`${API}?id=${currentUser.Userid}`);
        const data = await response.json();

        console.log(data)
        const userDetails = document.getElementById("userDetails")

        data.forEach(element => {
            const div = document.createElement('div');
            div.innerHTML = `
<div class="row p-4 align-items-center">

    <div class="col-lg-5 text-center mb-4 mb-lg-0">
        <img src="../asserts/Login.svg" class="img-fluid" style="max-height:350px;" alt="User Profile">
    </div>

    <div class="col-lg-7">
        <div class="card border-0 shadow-sm p-4">
            <h2 class="text-center fw-bold mb-4">
                USER DETAILS
            </h2>
            <div class="d-flex flex-column gap-3">
                <div>
                    <span class="text-secondary">Name</span>
                    <h5 class="mb-0 fw-semibold">${element.name}</h5>
                </div>
                <div>
                    <span class="text-secondary">Email</span>
                    <h5 class="mb-0 fw-semibold">${element.email}</h5>
                </div>
                <div>
                    <span class="text-secondary">Date of Birth</span>
                    <h5 class="mb-0 fw-semibold">${element.dob}</h5>
                </div>
                <div>
                    <span class="text-secondary">Gender</span>
                    <h5 class="mb-0 fw-semibold">${element.gender}</h5>
                </div>
                <div>
                    <span class="text-secondary">Role</span>
                    <h5 class="mb-0 fw-semibold">${element.role}</h5>
                </div>
                <div>
                    <span class="text-secondary">Address</span>
                    <h5 class="mb-0 fw-semibold">${element.address}</h5>
                </div>
                <div class="mt-3">
                    <button class="btn btn-danger px-4 logout-btn">
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    </div>
</div>
            `;
            userDetails.appendChild(div)
        });

    document.querySelectorAll(".logout-btn").forEach(button => {
            button.addEventListener('click',async function () {
                const result = await Swal.fire({
                    title : "Are you sure want to Log Out",
                    icon : "question",
                    showCancelButton : true
                })
                
                if(!result.isConfirmed)
                {
                    return;
                }
                    console.log("Click");
                    localStorage.clear();
                    window.location.replace('Home.html');
            });
        });

    }
    catch(error)
    {
        toastr.error(error);
    }

}

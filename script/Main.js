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

const API = "http://localhost:3000/tasks";
let currentTab = 'ALL';
const parent_div = document.getElementById('parent-div');
const currentUser = JSON.parse(localStorage.getItem("Userdetail"))
const currentUserID = currentUser.Userid;

document.getElementById("addbtn").addEventListener('click',function()
{
    const startdateInput = document.getElementById('startdate');
    const duedate = document.getElementById('duedate1');
    const today = new Date().toISOString().split("T")[0];
    document.getElementById('startdate').disabled = true;

    startdateInput.value = today;
    // startdateInput.min = today;
    // startdateInput.max = today;

    duedate.value = "";
    duedate.min = today;
})

document.getElementById("saveTask").addEventListener('click', async function () {

    const title = document.getElementById('title').value;
    const desc = document.getElementById('desc').value;
    const startdate = document.getElementById('startdate').value;
    const duedate = document.getElementById('duedate1').value;
    const priority = document.getElementById('priority').value;

    const startdateformat = new Date(startdate).toLocaleDateString('en-GB');
    const duedateformat = new Date(duedate).toLocaleDateString('en-GB');

    let notYetStarted = true;
    let isPending = false;
    let isCompleted = false;
    let isdeleted = false;

    try {
        const response = await fetch(API, {
            method: 'POST',
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Title: title,
                Desc: desc,
                notYetStarted : notYetStarted,
                isPending : isPending,
                isCompleted : isCompleted,
                isdeleted : isdeleted,
                startdate : startdateformat,
                duedate : duedateformat,
                priority : priority,
                userid : currentUserID
            })
        });   

        document.getElementById('title').value = "";
        document.getElementById('desc').value = "";

        renderTasks(); 

        const model = bootstrap.Modal.getInstance(document.getElementById('addTaskModal'))
        model.hide();
    }
    catch (error) {
        console.log(error);
    }
});

// async function fetchTask()
// {
//     try
//     {
//         const response = await fetch(`${API}?userid=${currentUserID}&isdeleted=false`);
//         const data = await response.json();
//         // const taskContainer = document.getElementById('taskContainer');
//         // taskContainer.innerHTML = "";
//         // data.forEach(element => {
//         //     const div = document.createElement('div');
//         //     div.classList.add("mb-3", "p-3", "border", "rounded");
//         //     div.innerHTML = `
//         //         <h3>${element.Title}</h3>
//         //         <h5>${element.Desc}</h5>
//         //        <button onclick="deletetask('${element.id}')">
//         //             Delete
//         //         </button>
//         //        <button onclick="completetask('${element.id}')">
//         //             Completed
//         //         </button>              
//         //     `;     
//         //     taskContainer.appendChild(div) 
//         // });
//         renderTasks(data)
//     }
//     catch(error)
//     {
//         toastr.error(error);
//     }
// }

renderTasks();

async function deletetask(taskid)
{
    console.log("delete")
    
    const result = await Swal.fire({
        title : "Delete Task?",
        text : "Task will be Deleted by can be Restored",
        icon: "warning",

        showCancelButton : true,
        confirmButtonText : "Yes,Delete!",
        cancelButtonText : "No"
    });

    if(!result.isConfirmed)
    {
        return;
    }
    try
    {   
        await fetch(`${API}/${taskid}`, {
            method : "PATCH",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({
                isdeleted : true
            })
        });
        Swal.fire(
            "Deleted!",
            "Task moved to deleted section",
            "success"
        );
        refreshCurrentTab();
    }
    catch(error)
    {
        console.log(error);

        Swal.fire(
            "Error",
            "Something went wrong",
            "error"
        );
    }   
}

// async function completetask(taskid)
// {

//     try
//     {
//         await fetch(`${API}/${taskid}`,{
//             method : "PATCH",
//             headers: {
//                 "Content-Type": "application/json"
//             },
//             body : JSON.stringify({
//                 isCompleted : true
//             })
//         })
//         refreshCurrentTab();
//     }
//     catch(error)
//     {
//         console.log(error)
//     }   
// }

async function renderTasks()
{
    try
    {
    const response = await fetch(`${API}?userid=${currentUserID}&isdeleted=false`);
    const data = await response.json();

    const taskContainer = document.getElementById('taskContainer');
    taskContainer.innerHTML = "";
    data.reverse().forEach(element => {
        const div = document.createElement('div');
        div.classList.add(
            "mb-3","p-3","border","rounded","shadow-sm","cardColor"
        );
        div.innerHTML = `
        <div class="d-flex justify-content-between align-items-end">
            <div class="row w-100">
                <div class = "col-6">
                <h3 class="fw-bold mb-2">
                    ${element.Title}
                </h3>
                <p class="mb-2">
                    ${element.Desc}
                </p>
                <p class="mb-1">
                    <strong>Start Date :</strong>
                    ${element.startdate}
                </p>
                <p class="mb-1">
                    <strong> Due Date :</strong>
                    ${element.duedate}
                </p>
                </div>
                <div class = "col-6 d-flex flex-column justify-content-between align-items-end">
                <div class ="d-flex">
                <p class="mb-2 me-3">
                    ${
                        element.isPending === true
                        ? `<span class="text-warning fw-bold">Pending</span>`
                        : (element.isCompleted === true) ? `<span class="text-success fw-bold">Completed</span>`
                        : `<span class="text-primary fw-bold">Not Yet Started</span>`
                    }
                </p>
                <p class="mb-2">
                    ${
                        element.priority === "High"
                        ? `<span class="text-danger fw-bold">🔴 High</span>`
                        : `<span class="text-success fw-bold">🟢 Low</span>`
                    }
                </p>
                </div>
        <div class="">
            <button
               onclick="openUpdateModal(
                    '${element.id}',
                    '${element.Title}',
                    '${element.Desc}',
                    '${
                        element.isPending === true 
                        ? 'pending'
                        : (element.isCompleted === true) ? 'completed'
                        : 'Not Yet Stated'
                    }',
                    '${element.startdate}',
                    '${element.duedate}',
                    '${element.priority}'
                )"
                data-bs-toggle="modal"
                data-bs-target="#updateTaskModal"
                class="btn btn-warning me-2">
                Update
            </button>
            <button
                onclick="deletetask('${element.id}')"
                class="btn btn-danger">
                Delete
            </button>
        </div>
        </div>
        </div>
        `;
        taskContainer.appendChild(div);
    });
}
catch(error)
{
    console.log(error)
}
}
async function pendingrenderTasks()
{
    let task;
    try
    {   
       const response = await fetch(`${API}?userid=${currentUserID}&isPending=true&isCompleted=false&isdeleted=false`);
       const data = await response.json();
        task = data;
    }
    catch(error)
    {
        console.log(error);
    }
    // if(response.ok)
    // {
    const pendingtaskContainer =
    document.getElementById('pendingTaskContainer');   
    pendingtaskContainer.innerHTML = "";
    
    task.reverse().forEach(element => {
        const div = document.createElement('div');
        div.classList.add("mb-3","p-3","border","rounded","cardColor");
        div.innerHTML = `
        <div class="d-flex justify-content-between align-items-end">
            <div class="row w-100">
                <div class = "col-6">
                <h3 class="fw-bold mb-2">
                    ${element.Title}
                </h3>
                <p class="mb-2">
                    ${element.Desc}
                </p>
                <p class="mb-1">
                    <strong>Start Date :</strong>
                    ${element.startdate}
                </p>
                <p class="mb-1">
                    <strong> Due Date :</strong>
                    ${element.duedate}
                </p>
                </div>
                <div class = "col-6 d-flex flex-column justify-content-between align-items-end">
                <div class ="d-flex">
                <p class="mb-2 me-3">
                    ${
                        element.isPending === true
                        ? `<span class="text-warning fw-bold">Pending</span>`
                        : (element.isCompleted === true) ? `<span class="text-success fw-bold">Completed</span>`
                        : `<span class="text-primary fw-bold">Not Yet Started</span>`
                    }
                </p>
                <p class="mb-2">
                    ${
                        element.priority === "High"
                        ? `<span class="text-danger fw-bold">🔴 High</span>`
                        : `<span class="text-success fw-bold">🟢 Low</span>`
                    }
                </p>
                </div>
        <div class="">
            <button
               onclick="openUpdateModal(
                    '${element.id}',
                    '${element.Title}',
                    '${element.Desc}',
                    '${
                        element.isPending === true 
                        ? 'pending'
                        : (element.isCompleted === true) ? 'completed'
                        : 'Not Yet Stated'
                    }',
                    '${element.startdate}',
                    '${element.duedate}',
                    '${element.priority}'
                )"
                data-bs-toggle="modal"
                data-bs-target="#updateTaskModal"
                class="btn btn-warning me-2">
                Update
            </button>
            <button
                onclick="deletetask('${element.id}')"
                class="btn btn-danger">
                Delete
            </button>
        </div>
        </div>
        </div>
        `;
        pendingtaskContainer.appendChild(div); });

        renderTasks();
    // }

}
document.getElementById('pendingtaskbtn').addEventListener('click', async function pendingtask() {
    currentTab = 'pending';
    pendingrenderTasks();
})
async function restoretask(taskid) 
{
    const result = await Swal.fire({
        title : "Restore this task",
        icon : "question",        
        showCancelButton : true,
        confirmButtonText : "Yes,Restore!",
        cancelButtonText : "No"
    })

    if(!result.isConfirmed)
    {
        return;
    }

    try
    {
        await fetch(`${API}/${taskid}`,{
            method : "PATCH",
            headers : {
                "content-type" : "application/json"
            },
            body : JSON.stringify({
                isdeleted : false
            })
        })
        Swal.fire(
            "Restored!",
            "success"
        );
        refreshCurrentTab();
        deletedrenderTasks();
        console.log(currentTab)
    }   
    catch
    {
        console.error("error")
    } 

}
async function deletedrenderTasks(data)
{
    let task;
    try
    {   
       const response = await fetch(`${API}?userid=${currentUserID}&isdeleted=true`);
       const data = await response.json();
       task = data;
    }
    catch(error)
    {
        toastr.error(error);
    }

    const deletedtaskContainer =document.getElementById('deletedTaskContainer');   
    deletedtaskContainer.innerHTML = "";
    
    task.reverse().forEach(element => {
        const div = document.createElement('div');
        div.classList.add("mb-3","p-3","border","rounded","cardColor");
        div.innerHTML = `
    <div class="d-flex justify-content-between align-items-start">
        <div>
            <h3>${element.Title}</h3>
        </div>
    </div>
    <div class="mt-3">
        <button 
            onclick="restoretask('${element.id}')"
            class="btn btn-danger">
            restore
        </button>
    </div>
`;
        deletedtaskContainer.appendChild(div);
        renderTasks();
        
    });
}
document.getElementById('deletedtaskbtn').addEventListener('click', async function deletedtask() {
   
    deletedrenderTasks();
})

let updateTaskId = null;

function openUpdateModal(id,title,desc,Status,startdate,duedate,priority)
{
    updateTaskId = id;
    console.log(desc)
    document.getElementById('updatetitle').value = title;
    document.getElementById('updatedesc').value = desc;
    document.getElementById('updateStatus').value = Status;

    document.getElementById('updatestartdate').value = startdate;
    document.getElementById('updatestartdate').disabled = true;
    const today = new Date().toISOString().split("T")[0];

    document.getElementById('updateduedate').min = today;
    document.getElementById('updateduedate').value = duedate;

    document.getElementById('updatepriority').value = priority;
}

document.getElementById("updateTask").addEventListener('click',async function(){

    const updatedTitle = document.getElementById('updatetitle').value;

    const updatedDesc = document.getElementById('updatedesc').value;

    const updateStatus = document.getElementById('updateStatus').value;

    const updatedStartDate = document.getElementById('updatestartdate').value;

    const updatedDueDate = document.getElementById('updateduedate').value;

    const updatedPriority = document.getElementById('updatepriority').value;
        
    try
    {
        await fetch(`${API}/${updateTaskId}`,{
            method : "PATCH",
            headers : {
                "Content-Type" : "application/json"
            },
            body : JSON.stringify({
            Title : updatedTitle,
            Desc : updatedDesc,
            isPending : updateStatus == 'pending'?true:false,
            isCompleted : updateStatus == 'completed'?true:false,
            startdate : updatedStartDate,
            duedate : updatedDueDate,
            priority : updatedPriority
        })
        })
        refreshCurrentTab();
    }
    catch(error)
    {
        toastr.error(error)
    }
        
    const modal = bootstrap.Modal.getInstance(document.getElementById('updateTaskModal'));
    modal.hide();
})

async function completedrenderTasks()
{
    let tasks;
    try
    {   
       const response = await fetch(`${API}?userid=${currentUserID}&isCompleted=true&isdeleted=false`);
       const data = await response.json();
       tasks = data;
    }
    catch(error)
    {
        console.log(error);
    }

    const completedtaskContainer =
    document.getElementById('completedTaskContainer');   
    completedtaskContainer.innerHTML = "";
    
    tasks.forEach(element => {
        const div = document.createElement('div');
        div.classList.add(
            "mb-3",
            "p-3",
            "border",
            "rounded",
            "cardColor"
        );
        div.innerHTML = `
        <div class="d-flex justify-content-between align-items-end">
            <div class="row w-100">
                <div class = "col-6">
                <h3 class="fw-bold mb-2">
                    ${element.Title}
                </h3>
                <p class="mb-2">
                    ${element.Desc}
                </p>
                <p class="mb-1">
                    <strong>Start Date :</strong>
                    ${element.startdate}
                </p>
                <p class="mb-1">
                    <strong> Due Date :</strong>
                    ${element.duedate}
                </p>
                </div>
                <div class = "col-6 d-flex flex-column justify-content-between align-items-end">
                <div class ="d-flex">
                <p class="mb-2 me-3">
                    ${
                        element.isPending === true
                        ? `<span class="text-warning fw-bold">Pending</span>`
                        : (element.isCompleted === true) ? `<span class="text-success fw-bold">Completed</span>`
                        : `<span class="text-primary fw-bold">Not Yet Started</span>`
                    }
                </p>
                <p class="mb-2">
                    ${
                        element.priority === "High"
                        ? `<span class="text-danger fw-bold">🔴 High</span>`
                        : `<span class="text-success fw-bold">🟢 Low</span>`
                    }
                </p>
                </div>
        <div class="">
            <button
               onclick="openUpdateModal(
                    '${element.id}',
                    '${element.Title}',
                    '${element.Desc}',
                    '${
                        element.isPending === true 
                        ? 'pending'
                        : (element.isCompleted === true) ? 'completed'
                        : 'Not Yet Stated'
                    }',
                    '${element.startdate}',
                    '${element.duedate}',
                    '${element.priority}'
                )"
                data-bs-toggle="modal"
                data-bs-target="#updateTaskModal"
                class="btn btn-warning me-2">
                Update
            </button>
            <button
                onclick="deletetask('${element.id}')"
                class="btn btn-danger">
                Delete
            </button>
        </div>
        </div>
        </div>
        `;
        completedtaskContainer.appendChild(div);
        renderTasks();
    });
}
document.getElementById('completedtaskbtn').addEventListener('click', async function completedtask() {
    currentTab = 'completed';
    completedrenderTasks();
})

async function overduerenderTasks(data)
{
    let task;
    try
    {
        const today = new Date().toISOString().split("T")[0];

        const response = await fetch(
            `${API}?userid=${currentUserID}&isdeleted=false`
        );

        const data = await response.json();

        const overdueTasks = data.filter(element =>
            element.duedate < today &&
            element.isCompleted === false
        );

        task = overdueTasks;
    }
    catch(error)
    {
        console.log(error);
    }

    const duedatetaskContainer =
    document.getElementById('duedateTaskContainer');

    duedatetaskContainer.innerHTML = "";

    task.reverse().forEach(element => {
        const div = document.createElement('div');
        div.classList.add(
            "mb-3",
            "p-3",
            "border",
            "rounded",
            "shadow-sm","cardColor"
        );

        div.innerHTML = `
        <div class="d-flex justify-content-between align-items-end">
            <div class="row w-100">
                <div class = "col-6">
                <h3 class="fw-bold mb-2">
                    ${element.Title}
                </h3>
                <p class="mb-2">
                    ${element.Desc}
                </p>
                <p class="mb-1">
                    <strong>Start Date :</strong>
                    ${element.startdate}
                </p>
                <p class="mb-1">
                    <strong> Due Date :</strong>
                    ${element.duedate}
                </p>
                </div>
                <div class = "col-6 d-flex flex-column justify-content-between align-items-end">
                <div class ="d-flex">
                <p class="mb-2 me-3">
                    ${
                        element.isPending === true
                        ? `<span class="text-warning fw-bold">Pending</span>`
                        : (element.isCompleted === true) ? `<span class="text-success fw-bold">Completed</span>`
                        : `<span class="text-primary fw-bold">Not Yet Started</span>`
                    }
                </p>
                <p class="mb-2">
                    ${
                        element.priority === "High"
                        ? `<span class="text-danger fw-bold">🔴 High</span>`
                        : `<span class="text-success fw-bold">🟢 Low</span>`
                    }
                </p>
                </div>
        <div>
            <button
               onclick="openUpdateModal(
                    '${element.id}',
                    '${element.Title}',
                    '${element.Desc}',
                    '${
                        element.isPending === true 
                        ? 'pending'
                        : (element.isCompleted === true) ? 'completed'
                        : 'Not Yet Stated'
                    }',
                    '${element.startdate}',
                    '${element.duedate}',
                    '${element.priority}'
                )"
                data-bs-toggle="modal"
                data-bs-target="#updateTaskModal"
                class="btn btn-warning me-2">
                Update
            </button>
            <button
                onclick="deletetask('${element.id}')"
                class="btn btn-danger">
                Delete
            </button>
        </div>
        </div>
        </div>
        `;
        duedatetaskContainer.appendChild(div);
        refreshCurrentTab();
    });
}

document.getElementById('duedatetaskbtn').addEventListener('click', async function () {
    currentTab = 'duedate';
    overduerenderTasks();
});

async function highpriorityrenderTasks()
{
    let task;
        try
    {
        const response = await fetch(
            `${API}?userid=${currentUserID}&priority=High&isdeleted=false`
        );

        const data = await response.json();
        task = data;
    }
    catch(error)
    {
        console.log(error);
    }
    const highprioritytaskContainer =
    document.getElementById('highpriorityTaskContainer');

    highprioritytaskContainer.innerHTML = "";

    task.reverse().forEach(element => {
        const div = document.createElement('div');
        div.classList.add(
            "mb-3",
            "p-3",
            "border",
            "rounded","cardColor"
        );

        div.innerHTML = `
        <div class="d-flex justify-content-between align-items-end">
            <div class="row w-100">
                <div class = "col-6">
                <h3 class="fw-bold mb-2">
                    ${element.Title}
                </h3>
                <p class="mb-2">
                    ${element.Desc}
                </p>
                <p class="mb-1">
                    <strong>Start Date :</strong>
                    ${element.startdate}
                </p>
                <p class="mb-1">
                    <strong> Due Date :</strong>
                    ${element.duedate}
                </p>
                </div>
                <div class = "col-6 d-flex flex-column justify-content-between align-items-end">
                <div class ="d-flex">
                <p class="mb-2 me-3">
                    ${
                        element.isPending === true
                        ? `<span class="text-warning fw-bold">Pending</span>`
                        : (element.isCompleted === true) ? `<span class="text-success fw-bold">Completed</span>`
                        : `<span class="text-primary fw-bold">Not Yet Started</span>`
                    }
                </p>
                <p class="mb-2">
                    ${
                        element.priority === "High"
                        ? `<span class="text-danger fw-bold">🔴 High</span>`
                        : `<span class="text-success fw-bold">🟢 Low</span>`
                    }
                </p>
                </div>
        <div class="">
            <button
               onclick="openUpdateModal(
                    '${element.id}',
                    '${element.Title}',
                    '${element.Desc}',
                    '${
                        element.isPending === true 
                        ? 'pending'
                        : (element.isCompleted === true) ? 'completed'
                        : 'Not Yet Stated'
                    }',
                    '${element.startdate}',
                    '${element.duedate}',
                    '${element.priority}'
                )"
                data-bs-toggle="modal"
                data-bs-target="#updateTaskModal"
                class="btn btn-warning me-2">
                Update
            </button>
            <button
                onclick="deletetask('${element.id}')"
                class="btn btn-danger">
                Delete
            </button>
        </div>
        </div>
        </div>
        `;
        highprioritytaskContainer.appendChild(div);
    });
}

document.getElementById('highprioritytaskbtn').addEventListener('click', async function () {

    currentTab = 'highpriority';
    highpriorityrenderTasks();
});

async function refreshCurrentTab()
{
    try
    {
        if(currentTab === 'ALL')
        {
            renderTasks();
            console.log("came")
        }
        else if(currentTab === 'pending')
        {
            pendingrenderTasks();
        }
        else if(currentTab === 'completed')
        {
            completedrenderTasks();
        }
        else if(currentTab === 'delete')
        {
            deletedrenderTasks();
        }
        else if(currentTab === 'duedate')
        {
            overduerenderTasks();
        }
        else if(currentTab === 'highpriority')
        {
            highpriorityrenderTasks();
        }
    }
    catch(error)
    {
        console.log(error);
    }
}

document.getElementById("fromdate").addEventListener("change", function () {

    const fromdate = this.value;

    const todateInput = document.getElementById("todate");

    todateInput.min = fromdate;
});

async function filterTask() {

    let tasks;

    const fromdate = document.getElementById("fromdate").value; 
    const todate = document.getElementById("todate").value; 

    if (fromdate === "" || todate === "")
    {
        toastr.error("Please Select Date");
    }

    document.getElementById("todate").min = fromdate;

    const fromdateformated = new Date(fromdate).toLocaleDateString('en-GB');
    const todateformated = new Date(todate).toLocaleDateString('en-GB');

    try{
        const response = await fetch(`${API}?userid=${currentUserID}&isdeleted=false`);
        const data = await response.json();
        tasks = data;
    }
    catch(error)
    {
        toastr.error(error)
    }
    
    const filteredTask = tasks.filter(task => 
        task.startdate >= fromdateformated && task.duedate <= todateformated
    );

const filterTaskContainer =
    document.getElementById('filterTaskContainer');

    filterTaskContainer.innerHTML = "";

    filteredTask.reverse().forEach(element => {
        const div = document.createElement('div');
        div.classList.add(
            "mb-3",
            "mt-3",
            "p-3",
            "border",
            "rounded","cardColor"
        );

        div.innerHTML = `
        <div class="d-flex justify-content-between align-items-end">
            <div class="row w-100">
                <div class = "col-6">
                <h3 class="fw-bold mb-2">
                    ${element.Title}
                </h3>
                <p class="mb-2">
                    ${element.Desc}
                </p>
                <p class="mb-1">
                    <strong>Start Date :</strong>
                    ${element.startdate}
                </p>
                <p class="mb-1">
                    <strong> Due Date :</strong>
                    ${element.duedate}
                </p>
                </div>
                <div class = "col-6 d-flex flex-column justify-content-between align-items-end">
                <div class ="d-flex">
                <p class="mb-2 me-3">
                    ${
                        element.isPending === true
                        ? `<span class="text-warning fw-bold">Pending</span>`
                        : (element.isCompleted === true) ? `<span class="text-success fw-bold">Completed</span>`
                        : `<span class="text-primary fw-bold">Not Yet Started</span>`
                    }
                </p>
                <p class="mb-2">
                    ${
                        element.priority === "High"
                        ? `<span class="text-danger fw-bold">🔴 High</span>`
                        : `<span class="text-success fw-bold">🟢 Low</span>`
                    }
                </p>
                </div>
        <div class="">
            <button
               onclick="openUpdateModal(
                    '${element.id}',
                    '${element.Title}',
                    '${element.Desc}',
                    '${
                        element.isPending === true 
                        ? 'pending'
                        : (element.isCompleted === true) ? 'completed'
                        : 'Not Yet Stated'
                    }',
                    '${element.startdate}',
                    '${element.duedate}',
                    '${element.priority}'
                )"
                data-bs-toggle="modal"
                data-bs-target="#updateTaskModal"
                class="btn btn-warning me-2">
                Update
            </button>
            <button
                onclick="deletetask('${element.id}')"
                class="btn btn-danger">
                Delete
            </button>
        </div>
        </div>
        </div>
        `;
        filterTaskContainer.appendChild(div);
    });
}   

document.getElementById("filtertasksubbtn").addEventListener('click',filterTask)

const userNametag = document.getElementById("username");

window.onload = function(){
    const atag = document.createElement('a');
    atag.classList.add("nav-link");
    atag.style.cursor = "pointer";
    atag.href = "userProfile.html"
    atag.innerHTML = 
    `HI,<strong> ${currentUser.Name}</strong>`
    userNametag.appendChild(atag)
}
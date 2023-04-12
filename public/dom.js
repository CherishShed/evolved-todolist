var today = new Date(Date.now())
var meridian = "";
var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
var dateNum = String(today.getDate())
var prefix = "";
var numOfTasks = parseInt($(".task-count").text());
var iconElement = "<i class= fa-solid fa-check></i>"

function checkMeridian() {
    if (new Date(Date.now()).getHours() > 11) {
        meridian = "PM";
    } else {
        meridian = "AM";
    }
}

function changeDate() {
    $("#dayOfWeek").fadeOut(10);
    $("#dayOfWeek").text(days[today.getDay()] + ", ");
    $("#dayOfWeek").fadeIn(1000);

    if (parseInt(dateNum) > 3 & parseInt(dateNum) < 21) {
        prefix = "th";
    }
    else if (dateNum.charAt(dateNum.length - 1) === "1") {
        prefix = "st";
    }
    else if (dateNum.charAt(dateNum.length - 1) === "2") {
        prefix = "nd";
    }
    else if (dateNum.charAt(dateNum.length - 1) === "3") {
        prefix = "rd";
    }
    else {
        prefix = "th";
    }

    $("#date").slideUp(10);
    $("#date").text(today.getDate() + prefix);
    $("#date").slideDown(800);

    $("#month").slideUp(10);
    $("#month").text(months[today.getMonth()] + ", ");
    $("#month").slideDown(800);

    $("#year").slideUp(10);
    $("#year").text(today.getFullYear());
    $("#year").slideDown(800);

    // $(".timeToDo").html("<i class='fa-solid fa-stopwatch'></i> " + (new Date(Date.now()).toUTCString()))
    $("#clockTime").slideUp(10);
    $("#clockTime").text(today.getHours() + ":" + today.getMinutes() + " " + meridian);
    $("#clockTime").slideDown(800);
    taskCalc(numOfTasks);
}

function taskCalc(numTasks) {
    if (numTasks === 1) {
        $("#taskNum").slideUp(10);
        $("#taskNum").slideDown(700);
        $("#taskNum").text(numTasks + " Task")
    } else {
        $("#taskNum").slideUp(10);
        $("#taskNum").slideDown(700);
        $("#taskNum").text(numTasks + " Tasks")
    }
}

changeDate();
addRemove();


$(".addButton").click(function () {
    $(".form-overlay").show(500);
})

$(".newTask .close").click(function () {
    $(".form-overlay").hide(500);
})

$(".addNew").click(function () {
    // console.log(newTask);
    addRemove();
    $(".form-overlay").hide(500);

})

function addRemove() {
    $(".mainList li").click(function (ev) {
        $(this.firstChild).toggleClass("icon")

        $(this).toggleClass("checked");
    })
    $("li").mouseenter(function () {
        $(this.lastChild).show();
    }
    );
    $("li").mouseleave(function () {
        $(this.lastChild).hide();
    }
    );
    $("span.close").click(function (ev) {
        let happenedTo = ev.target.parentElement;
        $(this.parentElement).slideUp(500, function () {
            $(ev.parentElement).css("display", "none");
            $(happenedTo).remove();
            numOfTasks--;
            taskCalc(numOfTasks);
        });
        const idToDelete = $(this).data('id');

        // Send a DELETE request to the server using Ajax
        $.ajax({
            url: `/${idToDelete}`,
            type: 'DELETE',
            success: function (result) {
                console.log(result);
                // Handle the success case, such as removing the deleted record from the DOM
            },
            error: function (error) {
                console.error(error);
                // Handle the error case, such as displaying an error message
            }
        });
    })

}


setInterval(function () {
    checkMeridian();
    let x = new Date(Date.now());
    $("#clockTime").text(("0" + x.getHours()).slice(-2) + ":" + ("0" + x.getMinutes()).slice(-2) + " " + meridian);
}, 500);

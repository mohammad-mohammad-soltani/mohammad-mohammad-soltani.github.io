let level = 1;
const levels = [1,2,3,4,5,6,7,8];
$(document).ready(() => {
    $("#level_"+level).show(200);
    $("#level_"+level).addClass("flex");
    $("input").val("")
})
let response;
let checkbox = [
    ["south" , true],
    ["north" , false] ,
    ["east" , false],
    ["west" , false],
    [0]

];
$(".next_level").click((e) => {

    response = level_manager(eval($(e.target).attr("level")));
    if(response !== true){
        e.preventDefault();
        console.log(response.message)
        $(response.target).addClass("invalid")
        $("#" + response.traget_id +  "_error" ).html(response.message).show(300)
    }else{
        $("#level_"+$(e.target).attr("level")).hide(200).removeClass("flex")
        setTimeout(() => {
            $("#level_"+(eval($(e.target).attr("level"))+1)).show(200).addClass("flex")
        }, 300);
        level = $(e.target).attr("level");
        document.getElementsByClassName("progress")[0].style.width = (Math.round(level / levels.length * 100 ) - 5 )+ "%";

    }
    
    
})


//Functions

function level_manager(id){
    switch (id) {
        case 1:
            if(($("#phone").val()).length>=10){

            }else{
                return {
                    type : "phone_length",
                    message : "شماره تلفن وارد شده نا معتبر میباشد",
                    target : $("#phone"),
                    traget_id : "phone"
                };
            }
            break;
        case 2:
            if(($("#verfication").val()).length == 4){
                console.log("ok")
            }else{
                return {
                    type : "verfication_code",
                    message : "کد وارد شده با کد ارسالی مطابقت ندارد",
                    target : $("#verfication"),
                    traget_id : "verfication"
                };
            }
            break;
        case 4:
            let count = 2;
            for(i = 0 ; i < count ; i ++){
                if($($("#level_4 input ")[i]).val()  == '' || ($($("#level_4 input ")[i]).val() ).length < eval($($("#level_4 input ")[i]).attr("minimum"))){
                    return {
                        type : "user_data",
                        message : "لطفا تمامی فیلد ها را مرور کنید",
                        target : $(null),
                        traget_id : "user_data"
                    };
                 }
            }
            return true;
        case 5:
            if(document.getElementById("resid").files.length != 1){
                return false;
            }
            checkbox.forEach(element => {
                if(element[1]) $("#" + element[0]).addClass("r_active")
                    $("#" + element[0]).click((e) => {
                        $("#" + checkbox[checkbox[4]][0]).removeClass("r_active")
                        switch ($(e.target).attr("id")) {
                            case "south":
                                checkbox[4] = 0;
                                break;
                            case "north":
                                checkbox[4] = 1;
                                break;
                            case "east":
                                checkbox[4] = 2;
                                break;
                            case "west":
                                checkbox[4] = 3;
                                break;
                        }
                        $("#" + checkbox[checkbox[4]][0]).addClass("r_active")
                    })
            });
            
    
    }
    return true;
}
$("#resid").change((e) => {
    if(e.target.files[0].size > 8000000) {
        $("#resid_error").html("فایل شما به دلیل حجم بالا آپلود نشد").show(300)
        $(e.target).val('');
    }else{
        $("#upload-state").html("یک فایل آپلود شد <br> برای تغییر فایل میتوانید مجددا کلیک کنید")
        $("#resid_error").hide(200)
    }
    
})
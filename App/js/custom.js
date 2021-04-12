$(document).ready(function(){
    if($('#cb-tos').checked){
        $('#btn-submit').prop('disabled', false)
    }

    $('#cb-tos').change(function(){
        if(this.checked){
            $('#btn-submit').prop('disabled', false)
        }
        else{
            $('#btn-submit').prop('disabled', true)
        }
    })
})

$(document).ready(function(){
    var title = $(document).attr('title')
    
    if(title == "Home")
        $('#menu-list-home').addClass("active")
    else if(title == "User" || title == "User Detail")
        $('#menu-list-user').addClass("active")
    else if(title == "Student" || title == "Student Detail")
        $('#menu-list-student').addClass("active")
    else if(title == "Faculty" || title == "Faculty Detail")
        $('#menu-list-faculty').addClass("active")
    else if(title == "Topic" || title == "Topic Detail")
        $('#menu-list-topic').addClass("active")
    else if(title == "Contribution" || title == "File" || title == "Comment")
        $('#menu-list-contribution').addClass("active")
     else if(title == "Profile"){
        $('#menu-account').addClass("active show")
        $('#menu-list-account').addClass("active")
        $('#menu-list-profile').addClass("active")
        return
     }
     else
        return

    $('#menu-main').addClass("active show")
    $('#menu-list-main').addClass("active")
    
})



       
$(document).ready(function() {
    $("input[name$='inorup']").click(function() {
        var choice = $(this).val();
        $("div.confirmChoice").hide();
        if (choice == 'signin'){
          $("#logConfirmInsideContent").show();
          $("#confirmForm").attr("action", "/basket/login");
        }else if(choice == 'signup'){
          $("#regConfirmInsideContent").show();
          $("#confirmForm").attr("action", "/basket/register");
        }
    });
});

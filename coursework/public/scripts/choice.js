$(document).ready(function() {
    $("input[name$='inorup']").click(function() {
        var choice = $(this).val();
        $("div.confirmChoice").hide();
        if (choice == 'signin'){
          $("#logConfirmInsideContent").show();
        }else if(choice == 'signup'){
          $("#regConfirmInsideContent").show();
        }
    });
});

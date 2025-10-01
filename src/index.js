if("serviceWorker" in navigator){
    navigator.serviceWorker.register("/sw.js").then((rg)=>{
        console.log("Papi estamos online registraos",rg.scope)
    }).catch((err=>console.log("Nos jodimos vamos tocó en edge")))
}
$(document).ready(() => {
    const input = $("#inputScanner");

    input.change(function() {
        console.log($(this).val());
        alert($(this).val())
    });
});

function handleSetInputFocus() {
   const input  = $("#inputScanner");
   input.val("");
   input.focus()

}

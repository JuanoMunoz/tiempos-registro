 if("serviceWorker" in navigator){
     navigator.serviceWorker.register("/tiempos-registro/sw.js").then((rg)=>{
         console.log("Papi estamos online registraos",rg.scope)
     }).catch((err=>console.log("Nos jodimos vamos tocó en edge")))
 }
$(document).ready(() => {
    const nombre = $("#nombre");
    const documento = $("#documento");
    const sexo = $("#sexo");
    const tipoSangre = $("#tipoSangre");
    const nacimiento = $("#nacimiento");
    const correo = $("#correo");
    const numero = $("#numero");
    const input = $("#inputScanner");
    input.on('keydown', function(e) {
        if(e.keyCode === 9){
            e.preventDefault()
            input.val(`${input.val()}|`)
     }
    });
    input.change(function(e) {
        const infoCandidate = input.val().split("|");
        const isAnOldCC = infoCandidate.length == 8
        console.log(isAnOldCC)
        nombre.val(infoCandidate.slice(1,5).join(" "));
        documento.val(infoCandidate[0]);
        sexo.val(infoCandidate[5].toUpperCase() === 'M' ? 'masculino' : "femenino");
        nacimiento.val(getBirthDaySpanish(infoCandidate[6],isAnOldCC));
        if(isAnOldCC)tipoSangre.val(infoCandidate[7])
        input.val("")
     })

});

function handleSetInputFocus() {
   const input  = $("#inputScanner");
   input.val("");
   input.focus()

}

function getBirthDaySpanish(dateString, isAnOldCC) {
    const day = isAnOldCC ? dateString.substring(0,2):dateString.substring(8,10);
    const month = isAnOldCC ? dateString.substring(2,4):dateString.substring(5,7);
    const year = isAnOldCC ? dateString.substring(4,8):dateString.substring(0,4);
    const fechaNacimiento = new Date(year, month-1,day)
    const options = {
    year: 'numeric',
    month: 'long',  
    day: 'numeric'  
    };
    console.log(`FECHA: dia ${day} año : ${year} mes ${month}`);
    
    console.log( fechaNacimiento.toLocaleDateString('es-ES',options))
    return fechaNacimiento.toLocaleDateString('es-ES',options)
}

//TODO implement TYPE OF Document Cédula de ciudadanía, Cédula de extranjería, pasaporte, Permiso de proteccion
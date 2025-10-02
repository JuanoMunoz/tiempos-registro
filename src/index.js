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
    const tipoDocSelect = $("#tipoDocSelect");
    const tipoDocSpan = $("#tipoDocSpan");
    input.on('keydown', function(e) {
        if(e.keyCode === 9){
            e.preventDefault()
            input.val(`${input.val()}|`)
     }
    });

    updateSelectWidthDNI(tipoDocSelect,tipoDocSpan)
    tipoDocSelect.change(function (e){
        updateSelectWidthDNI(tipoDocSelect,tipoDocSpan)
    })

    input.change(function(e) {
        const infoCandidate = input.val().split("|");
        const isAnOldCC = infoCandidate.length == 8
        nombre.val(infoCandidate.slice(1,5).join(" "));
        documento.val(infoCandidate[0]);
        sexo.val(infoCandidate[5].toUpperCase() === 'M' ? 'masculino' : "femenino");
        nacimiento.val(getBirthDaySpanish(infoCandidate[6],isAnOldCC));
        if(isAnOldCC)tipoSangre.val(infoCandidate[7])
        input.val("")
        numero.focus();
        numero[0].setSelectionRange(0, 0);
     })

     const buttonSubmitCandidate = $("#buttonSubmitCandidate")
     buttonSubmitCandidate.click(function(e) {
        e.preventDefault()
        const candidates = JSON.parse(localStorage.getItem("candidates") || "[]")
        if (numero.val() === '') showToast("¡Debes ingresar el número para contactarte!","error")
        else if(numero.val().toUpperCase() === "EXCEL"){
            downloadCandidates(candidates)
        }
        else if(numero.val().toUpperCase()=== "CLEAR")localStorage.removeItem("candidates")
        else if(!numero.val().match(/^3\d{9}$/))showToast("¡El número ingresado es inválido! (Ej: 3001234961)","error")
        else if (candidates.find(c=>c.documento === documento.val()))showToast("Este documento ya está registrado","error");
        else {
            const nombreArray = nombre.val().split(" ")
            const primerApellido = nombreArray[0];
            const segundoApellido = nombreArray[1];
            const primerNombre = nombreArray[2];
            const segundoNombre = nombreArray[3];
            const candidate = {
                primerNombre: primerNombre,
                segundoNombre: segundoNombre,
                primerApellido: primerApellido,
                segundoApellido: segundoApellido,
                documento: documento.val(),
                sexo: sexo.val(),
                tipoSangre: tipoSangre.val() == "" ? 'N/A' :tipoSangre.val(),
                nacimiento: nacimiento.val(),
                correo: correo.val() == "" ? 'N/A':correo.val(),
                numero: numero.val(),
                tipoDoc: tipoDocSelect.val()
            };
            candidates.push(candidate)
            localStorage.setItem("candidates",JSON.stringify(candidates))
            showToast("¡Candidato agendado correctamente!","success")
            tipoDocSelect.val("CC")
            updateSelectWidthDNI(tipoDocSelect,tipoDocSpan)
            numero.val("")
            correo.val("")
            handleSetInputFocus()
        }
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
function updateSelectWidthDNI(select,span) {
    span.text(select.find("option:selected").text())
    span.css({
        font: select.css("font"),
        "font-size": select.css("font-size"),
        "font-family": select.css("font-family"),
        "letter-spacing": select.css("letter-spacing")
    })
    select.width(span.width()+30);
}
//Código robado de google
function showToast(message, type = 'info', duration = 5500) {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.classList.add('toast', type); 
    toast.textContent = message;

    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, duration); 
}

function downloadCandidates(data, fileName = "candidatos"+Date.now()+".xlsx") {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);
    XLSX.utils.book_append_sheet(wb, ws, "candidatos");
    XLSX.writeFile(wb, fileName);
}

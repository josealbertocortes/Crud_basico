class JSValidator{

    status = true;

    errors = [];

    via = "http";
    validators = {
        minLength:3,
        maxLength:255
    }
    msgs = {
        required: `Este campo es requerido`,
        minLength: `Longitud no válida. Mínimo __minLength__ caracteres`,
        maxLength: `Longitud no válida. Máximo __maxLength__  caracteres`,
        email: `El campo de email no es válido`,
        integer: `El campo debe ser de tipo entero`,
        digit: `El valor debe ser un dígito`,
        url: `El campo debe ser una URL válida`
    }

    constructor(formId){
        this.setForm(formId);
        this.setInput();
        this.parseInputs();
    }
    
    setForm (formId){
        
        this.form = document.getElementById(formId);
    }

    setInput(){
        this.inputs = document.querySelectorAll(`#${this.form.id} .jsvalidator`)
    }

    setAjax(){
        this.via = "ajax";
        return this;
    }


    parseInputs(){
        this.inputs.forEach(
            input => {
                this.apppenErrorTag(input)
    
            }
        )
    }
    apppenErrorTag(input){
        let parent =input.parentNode;
        let span = document.createElement('span');
        span.setAttribute("class","error-msg");
        parent.appendChild(span);
    }


    validateForm(){

        this.form.addEventListener('submit',(e)=>{

            this.resetValidation()

            // validar cada input 
            this.inputs.forEach(input =>{
                
                this.validateInput(input);
                
            });
            if(!this.status){
                e.preventDefault();
           
            }else{

                // nueva evaluacion si se debe enviar por ajax o http
                if(this.via=="ajax"){
                    e.preventDefault();
                    this.submitHandler();

                 

                }
               
            }
        });

    }


    validateInput(input){
        let validators = input.dataset.validators;
        if(validators !== undefined){

            validators = validators.split(" ");
            validators.forEach(validator=>{

                this[`_${validator}`](input);

            });

        }

    }


    setError(input, msg){
        this.status = false;

        this.setStackError(input,msg);

        this.setErrorMessage(input,msg);
        
   
    }

    setStackError(input, msg ){

        this.errors.push({
            input:input,msg:msg
        })
    }

    setErrorMessage(input,msg){
        let span = input.nextElementSibling;
        span.innerHTML += (msg+"<br />")

    }

    resetStackError(){
        this.errors = [];
    }


    resetErrorMesages(){
        let spans = document.querySelectorAll(`#${this.form.id} .error-msg`);
        spans.forEach(span=>{
            span.innerHTML="";
        })
    }
    resetValidation(){
        this.status = true;
        this.resetStackError()
        this.resetErrorMesages()

    }

    validateInputs(){
        this.inputs.forEach(input=>{
            input.addEventListener('input',(e)=>{
                this.resetValidation();
                this.validateInput(input);
            })
        })

    }

    submitHandler(){


        let data = new FormData(this.form);
        
        fetch(this.form.action,{
            method: this.form.method,
            body:data
        })
        .then(response=>response.json())
        .then(data=>{
          
           
            let div = document.createElement('div');
            div.setAttribute("class","mensaje_recibido");
            document.body.appendChild(div);
            let span = document.createElement('span');
            span.setAttribute("class","mesaje_contenido");
            span.innerHTML = data[0]
            div.appendChild(span);


            console.log(data)
        
        })
        .catch(error=>{
            console.log(error)
        })
    }

    init(){

        this.validateForm();
        this.validateInputs();
        return this;


    }

}



JSValidator.prototype._required = function(input){


    let value = input.value;

    let msg = this.msgs.required;

    if(value.trim()=== ""||value.length<1){
        this.setError(input,msg)
    }
}

JSValidator.prototype._length = function(input){

    let value = input.value;
    let inputLengt = value.length;
    let minLength = (input.dataset.validators_minlenght !== undefined)?Number(input.dataset.validators_minlenght):this.validators.minLength;
    let maxLength = (input.dataset.validators_maxlenght !== undefined)?Number(input.dataset.validators_maxlenght):this.validators.maxLength;
    let msgs;
    if(inputLengt<minLength){
        msg = this.msgs.minLength.replace("__minLength__",minLength);
        this.setError(input,msg)
    }
    if(inputLengt>maxLength){
        msg = this.msgs.maxLength.replace("__maxLength__",maxLength);
        this.setError(input,msg)
    }

}

JSValidator.prototype._email = function(input) {
	
	// En primer lugar vamos a recuperar el valor del input
	let value = input.value;
 
	// Definir el mensaje de error
	let msg = this.msgs.email;
 
	// expresión regular para validar email
	let pattern = new RegExp(/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/i);
 
	// En caso de que la validación falle mandar error.
    if (!pattern.test(value) && value.trim() != "") {
 
    	this.setError(input, msg);
 
    }
 
};

JSValidator.prototype._integer = function(input) {
	
	// En primer lugar vamos a recuperar el valor del input
	let value = input.value;
 
	// Definir el mensaje de error
	let msg = this.msgs.integer;
 
	// expresión regular para validar integer
	let pattern = new RegExp(/^[0-9]+$/);
 
	// En caso de que la validación falle mandar error.
    if (!pattern.test(value) && value.trim() != "") {
 
    	this.setError(input, msg);
 
    }
 
};

JSValidator.prototype._alphanumeric = function(input) {
	
	// En primer lugar vamos a recuperar el valor del input
	let value = input.value;
 
	// Definir el mensaje de error
	let msg = this.msgs.alphanumeric;
 
	// expresión regular para validar digit
	let pattern = new RegExp(/^[a-zA-Z0-9]+$/);
 
	// En caso de que la validación falle mandar error.
    if (!pattern.test(value) && value.trim() != "") {
 
    	this.setError(input, msg);
 
    }
 
};

JSValidator.prototype._url = function(input) {
	
	// En primer lugar vamos a recuperar el valor del input
	let value = input.value;
 
	// Definir el mensaje de error
	let msg = this.msgs.url;
 
	// expresión regular para validar url
	var pattern = new RegExp(/^(https?|s?ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i);
 
	// En caso de que la validación falle mandar error.
    if (!pattern.test(value) && value.trim() != "") {
 
    	this.setError(input, msg);
 
    }
 
};
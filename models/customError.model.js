module.exports = function CustomError(errors,type,status=400){
    this.errors = errors;
    this.type =type;
    this.status =status;
}
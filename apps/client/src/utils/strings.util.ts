String.prototype.capitalize = function (this) {
    return this.charAt(0).toUpperCase() + this.slice(1).toLocaleLowerCase()
}
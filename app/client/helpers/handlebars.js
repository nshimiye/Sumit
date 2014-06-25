//Handlebars.registerHelper creates a global 
//helper that can be user within any template
UI.registerHelper('pluralize', function(n, thing) {
    if (n === 1) {
        return '1 ' + thing;
    } else {
        return n + ' ' + thing + 's';
    }
});


// for tags that are longer
// this function cuts them to a desired size
// developper should find better ways/hints to display full tag to user 
UI.registerHelper('shortenString', function(inputString) {
    var saveString = inputString;
    if (saveString.length > 20) {
        saveString = inputString.substring(0, 20) + " ...";
    }
    return saveString;
});

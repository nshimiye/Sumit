//Handlebars.registerHelper creates a global 
//helper that can be user within any template
UI.registerHelper('pluralize', function(n, thing) {
    if (n === 1) {
        return '1 ' + thing;
    } else {
        return n + ' ' + thing + 's';
    }
});
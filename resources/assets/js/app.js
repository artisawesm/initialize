// Imported from node_modules folder
let $ = require('jquery'); //jQuery
import 'bootstrap'; //Bootstrap

//jQuery starts here
$(document).ready(()=> {
    console.log('initialize is running!');
    $("#init").addClass('move');
});
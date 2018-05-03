// Imported from node_modules folder
let $ = require('jquery'); //jQuery
import 'bootstrap'; //Bootstrap

//jQuery starts here
$(document).ready(()=> {
    console.log('initialize is running!');
    $("#init").addClass('move');

    // toggle dark and light
    $('#light').on('click', ()=> {
        $('.toggle-light-dark').removeClass('light');

        $('.toggle-light-dark').addClass('dark');
        $('.init').addClass('dark');
        $('.title').addClass('dark');
    });

    $('#dark').on('click', ()=> {
        $('.toggle-light-dark').removeClass('dark');

        $('.toggle-light-dark').addClass('light');
        $('.init').removeClass('dark');
        $('.title').removeClass('dark');
    });
});
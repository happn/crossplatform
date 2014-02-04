/*global happnCrossplatform, $*/


window.happnCrossplatform = {
    Models: {},
    Collections: {},
    Views: {},
    Routers: {},
    init: function () {
        'use strict';
        console.log('Hello from Backbone!');
    }
};

$(document).ready(function () {
    'use strict';
    happnCrossplatform.init();
});

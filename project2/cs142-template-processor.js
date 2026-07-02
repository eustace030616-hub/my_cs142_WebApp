// in this file, i used regex to find pattern, you should also check cs142-test-project2.js as well, in there i used (function(){}) IIFE to make global scope variable local so to pass test 3
'use strict';

function Cs142TemplateProcessor(template) {
    this.template = template;
}

Cs142TemplateProcessor.prototype.fillIn = function(dict) {
    var result = this.template;
    var pattern = /\{\{(\w+)\}\}/g;
    var match = pattern.exec(this.template);

    while (match !== null) {
        var key = match[1];
        var placeholder = match[0];

        if (dict[key] !== undefined) {
            result = result.replace(placeholder, dict[key]);
        } else {
            result = result.replace(placeholder, "");
        }

        match = pattern.exec(this.template);
    }

    return result;
};
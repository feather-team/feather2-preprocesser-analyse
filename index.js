'use strict';

var PROCESSES = {
    'extend-uri' : require('./process/extend-uri.js')
};

var CHINAS = ['extend-uri', 'widget'];

module.exports = function(content, file, conf){
	CHINAS.forEach(function(item){
        content = PROCESSES[item](content, file, conf);
    });

    return content;
};
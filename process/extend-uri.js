'use strict';

var REG = /"(?:[^\\"\r\n\f]|\\[\s\S])*"|'(?:[^\\'\n\r\f]|\\[\s\S])*'|(?:\/\/[^\r\n\f]+|\/\*[\s\S]*?(?:\*\/|$))|\b__uri\s*\(\s*("(?:[^\\"\r\n\f]|\\[\s\S])*"|'(?:[^\\'\n\r\f]|\\[\s\S])*')\s*(?:,\s*(true|false)\s*)(?:,\s*(true|false)\s*)?\)/g;

function extendUriBefore(content, file){
    return content.replace(REG, function(m, value, hash, domain){
        if(value){
            var info = feather.uri(value, file.dirname);
            feather.compile(info.file);

            var oldHash = info.file.useHash;//, oldDomain = info.file.useDomain;

            if(info.file && info.file.isFile()){
                hash = hash && hash == 'true';
                domain = !domain || domain == 'true';

                if(!hash || !domain){
                    //info.file.useHash = oldHash || hash;
                    //info.file.useDomain = domain;

                    var query = (info.file.query && info.query) ? '&' + info.query.substring(1) : info.query;
                    var url = info.file.getUrl();
                    var hash = info.hash || info.file.hash;

                    if(!domain){
                        url = url.substring(info.file.domain.length);
                    }

                    info.file.useHash = oldHash;
                  //  info.file.useDomain = oldDomain;

                    return ':::FEATHER#URI:::' + info.quote + url + query + info.quote + ':::END:::';
                }
            }

            return '__uri(' + value + ')';
        }

        return m;
    });
}

module.exports = function(content, file, conf){
    if(file.isHtmlLike){
        content = content.replace(/(<script[^>]*>)([\s\S]+?)<\/script>/g, function(all, tag, $2){
            if(!/\s+type\s*=/i.test(tag) || /\s+type\s*=\s*(['"]?)text\/javascript\1/i.test(tag)){
                $2 = extendUriBefore($2, file);
            }

            return tag + $2 + '</script>';
        });
    }else if(file.isJsLike){
        content = extendUriBefore(content, file);
    }

    return content;
};
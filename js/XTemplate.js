var XTemplate = {
    templateMapper:function(Container, source, templateId) {
        function readProperty(item, property) {
            if(property.match(/\w+\../)) {
                //property is refering to an object
                var props = property.split('.');
                return item[props[0]][props[1]];
            }
            else
            {
                return item[property];
            }
        }
        var template;
        if(typeof XTemplate[templateId] === 'undefined') {
            XTemplate[templateId] = document.getElementById(templateId).content;
        }
        template = XTemplate[templateId];

        if(source instanceof Array === false) {
            source = [source];
        }

        var tpl = document.importNode(template, true);
        source.forEach(function(item) {
            //replace all attributes
            [].forEach.call(tpl.querySelectorAll('[data-attribute]'), function(node) {
                //node.setAttribute(node.getAttribute('data-attribute'), item[node.getAttribute('data-map')]);
                node.setAttribute(node.getAttribute('data-attribute'), readProperty(item, node.getAttribute('data-map')));
            });
            //replace all text
            [].forEach.call(tpl.querySelectorAll('[data-property]'), function(node) {
                //node[node.getAttribute('data-property')] = item[node.getAttribute('data-map')];
                node[node.getAttribute('data-property')] = readProperty(item, node.getAttribute('data-map'));
            });

            Container.appendChild(document.importNode(tpl, true));
        });
    }
};

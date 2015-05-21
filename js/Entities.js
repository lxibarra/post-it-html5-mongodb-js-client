var Entities = {
    note: {
        saveFromForm:function(formName, elements, callback, onsend, oncomplete) {
            var createdDate = new Date();
            var record = {
                    CreatedAt:createdDate,
                    LastModified:createdDate
                };
            //read form attributes
            elements.forEach(function(element) {
                [].forEach.call(document.forms[formName].getElementsByTagName(element), function(i) {
                    record[i.name] = i.value;
                });
            });

            mongodb.saveNote(record, callback, onsend, oncomplete);
        },
        toList:function(callback, oncomplete, parameters, onsend) {
            mongodb.getNotes(callback, oncomplete, parameters, onsend)
        },
        getSingleNote:function(id,  callback, onsend, oncomplete) {
            mongodb.getSingleNote(id, callback, onsend, oncomplete);
        },
        removeNote:function(id, callback, onsend, oncomplete) {
           mongodb.removeNote(id, callback, onsend, oncomplete);
        }
    }
};
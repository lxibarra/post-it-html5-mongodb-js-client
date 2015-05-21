
$(function() {
    $('#newNote').on('click', function() {
        clearForm();
        $('#newNoteModal').modal('show');
    });

    $('#newNotebtn').on('click', function() {
        Entities.note.saveFromForm('newNoteForm', ['input', 'textarea'], function(success, data) {
            if(success) {
                $('#newNoteModal').modal('hide');
                clearForm();
                listNotes();
            }
        },
            //before save
            function() {
                preLoader.on();
                $('#newNoteForm button').attr('disabled', 'disabled');
            },
            //oncomplete
            function() {
                $('#newNoteForm button').removeAttr('disabled');
                preLoader.off();
            }
        );
    })

    $('#noteContainer').on('click', '[data-action]', function(e) {
        var action = e.target.getAttribute('data-action');
        Entities.note[action](e.target.getAttribute('data-value'), function(result, data) {
            switch(action) {
                case 'removeNote' :
                    DeleteNoteHolder(e.currentTarget);
                    break;
                case 'getSingleNote' :
                    SetFormValues(result, data);
                    $('#newNoteModal').modal('show');
                    break;
            }
        }, preLoader.on, preLoader.off);
    });

    listNotes(function() {
        preLoader.on();
    }, function() {
        preLoader.off();
    });

});

function DeleteNoteHolder(obj) {
    if(obj.hasAttribute('data-parent'))
        $(obj).slideUp("slow", function() {
            obj.parentNode.removeChild(obj);
        });
    else
        DeleteNoteHolder(obj.parentNode);
}

function ClearItem(parent) {
    while(parent.hasChildNodes()) {
        parent.removeChild(parent.lastChild);
    }
}

function listNotes(onsend, oncomplete) {
    Entities.note.toList(function(success, data) {
        ClearItem(document.getElementById('noteContainer'));
        var c = 0, row = document.createElement('div');
        row.className = 'row';
        data.forEach(function(r) {
            XTemplate.templateMapper(row, r, 'noteTemplate');
            document.getElementById('noteContainer').appendChild(row);
            c++;
            if(c >= 3) {
                row = document.createElement('div');
                row.className = 'row';
                c = 0;
            }
        });
    }, oncomplete, undefined, onsend);
}

function SetFormValues(result, data) {
    if(result) {
        Object.keys(data).forEach(function(p) {
            switch(typeof data[p]) {
                case 'string' :
                    if(typeof document.getElementsByName(p)[0] !== 'undefined')
                        document.getElementsByName(p)[0].value = data[p];
                    break;
                case 'object' :
                    SetFormValues(true, data[p]);
                    break;
            }
        });
    }
}

function clearForm() {
    //to include text areas
    document.forms['newNoteForm'].reset();

    //form reset does not work for hidden fields
    [].forEach.call(document.forms['newNoteForm'].getElementsByTagName("input"), function (e) {
        e.value = '';
    });
}


var preLoader = {
    on:function() {
        $('.preloader').fadeIn("fast");
    },
    off:function() {
        $('.preloader').fadeOut("slow");
    }
};





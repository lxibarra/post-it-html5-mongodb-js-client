/*http://docs.mongolab.com/restapi/*/
var mongodb = {
    apiKey:'YOUR-OWN-APIKEY',
    database:'YOUR-DATABASE-NAME',
    tcollection:'YOUR-COLLECTION',
    baseUrl: 'https://api.mongolab.com/api/1/',
    requestUrl:function() {
        if(typeof this._requestUrl === 'undefined') {
            this._requestUrl = this.baseUrl + 'databases/' + this.database + '/collections/' + this.tcollection + '?apiKey=' + this.apiKey;
        }
        return this._requestUrl;
    },
    requestDynamicUrl:function(id) {
        return this.baseUrl + 'databases/' + this.database + '/collections/' + this.tcollection + '/' + id + '?apiKey=' + this.apiKey;
    },
    getNotes:function(callback, oncomplete, sortParams, onsend) {

        var Url = this.requestUrl(sortParams);
        Url = typeof sortParams === 'undefined'? (Url + '&s={CreatedAt:-1}') : (Url + '&s=' + JSON.stringify(sortParams));
        $.ajax({
            url:Url,
            type:'GET',
            contentType: "application/json",
            beforeSend:function() {
                if(typeof onsend === 'function')
                    onsend();
            },
            error:function() {
                if(typeof callback === 'function')
                    callback(false, {});
            },
            success:function(data) {
                if(typeof callback === 'function')
                    callback(true, data);
            },
            complete:function() {
                if(typeof oncomplete === 'function')
                    oncomplete();
            }
        });
    },
    getSingleNote:function(id, callback, onsend, oncomplete) {
        var Url = this.requestDynamicUrl(id);
        $.ajax({
            url: Url,
            type: "GET",
            beforeSend:function() {
                if(typeof onsend === 'function')
                    onsend();
            },
            success: function (data) {
                if(typeof callback === 'function') {
                    callback(true, data);
                }
            },
            complete:function() {
                if(typeof oncomplete === 'function')
                    oncomplete();
            },
            error: function (xhr, status, err) {
                callback(false, xhr, status, err);
            }
        });
    },
    saveNote:function(record, callback, beforeSave, oncomplete) {
        this.helpers.normalizeFields(record);
        var typeRequest = 'POST', dataready = record;
        /*==================Begin -> Super patch needs cleanup================*/
                //if an id is present is an update else is an insert
                if(typeof record._id !== 'undefined') {
                    typeRequest = 'PUT';
                    dataready = {
                        title: record.title,
                        note: record.note,
                        LastModified: {"$date": new Date().toISOString()},
                        CreatedAt: record.CreatedAt
                    };
                    delete dataready._id;

                }

                var Url = typeRequest === 'POST'? this.requestUrl() :
                    this.requestDynamicUrl(JSON.parse(record._id).$oid);
        /*==================End -> Super patch needs cleanup================*/
        $.ajax({
            url:Url,
            type:typeRequest,
            data: JSON.stringify(dataready),
            contentType: "application/json",
            beforeSend:function() {
                if(typeof beforeSave === 'function')
                    beforeSave();
            },
            error:function(xhr, status, err) {
                if(typeof callback === 'function')
                    callback(false, {});
            },
            success:function(data) {
                if(typeof callback === 'function')
                    callback(true, data);
            },
            complete:function() {
                if(typeof oncomplete === 'function')
                    oncomplete();
            }
        });
    },
    removeNote:function(id, callback, onsend, oncomplete) {
        var Url = this.requestDynamicUrl(id);
        $.ajax({
            url: Url,
            type: "DELETE",
            beforeSend:function() {
                if(typeof onsend === 'function')
                    onsend();
            },
            success: function (data) {
                if(typeof callback === 'function') {
                    callback(true, data);
                }
            },
            complete:function() {
                if(typeof oncomplete === 'function')
                    oncomplete();
            },
            error: function (xhr, status, err) {
                callback(false, xhr, status, err);
            }
        });
    },
    helpers: { //mongo db needs date fields and id's in a very specific form
        normalizeFields:function(record) {

            if(record.$oid.length > 0) {
                //if(typeof record.id.$oid === 'undefined') {
                    var tmp = record.$oid;
                    record._id = JSON.stringify({ "$oid": tmp });
                    delete record.$oid;
                //}
            }
            else {
                //just to be safe
                delete record.$oid;
            }

            //created date exists
            if(record.$date.length > 0) {
                record.CreatedAt = { "$date": record.$date };
            }
            else {

                if (typeof record.CreatedAt !== 'undefined') {
                    var tmpdate = record.CreatedAt;
                    record.CreatedAt = {"$date": tmpdate.toISOString()};
                }
                else {
                    record.CreatedAt = {"$date": new Date().toISOString()};
                }
            }

            //delete form reference to created date
            delete record.$date;

            if(typeof record.LastModified !== 'undefined') {
                var tmpdate = record.LastModified;
                record.LastModified = { "$date": tmpdate.toISOString() };
            }
            else {
                record.LastModified = { "$date": new Date().toISOString() };
            }
        }
    }
};
html5 post-it & mongodb — client side post-it app
==================================================

Warning
--------------------------------------
This application is only a concept. Since there is no server side code in this app, the keys for the database are visible to everyone therefore is not safe to host this application as it is in a real environment. To fix this issue you can extend the app to allow user authenticatication and provide a unique key for each user (currently everyone's uses the same key)

Installation
--------------------------------------
1. Just download/clone this repo and host the files in the server of your choice.
2. Create a free account in [www.mongolab.com](http://www.mongolab.com)
3. Create a database and a collection and get your unique REST API key
4. Configure the app by editing js/mongodb.js (see below) 
5. Launch the app and you are set.


Configuration
--------------------------------------

```js 

    var mongodb = {
           apiKey:'YOUR-OWN-APIKEY',
           database:'YOUR-DATABASE-NAME',
           tcollection:'YOUR-COLLECTION',
           baseUrl: 'https://api.mongolab.com/api/1/'
           //below this line no modification is needed
       }



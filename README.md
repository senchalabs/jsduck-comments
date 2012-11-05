JSDuck Comments Server
======================

NodeJS server for [JSDuck][] comments system on top of MySQL database.

**NOTE:** The authentication system is currently targeted to work with
[Sencha Forum][] users database.  If you're not from Sencha, then this
is obviously not an option.  For that case there also exists an
alternative implementation which uses a local users table, but as of
now the implementation doesn't cover registration, only the
authentication part.

[JSDuck]: https://github.com/senchalabs/jsduck
[Sencha Forum]: http://www.sencha.com/forum/


Install
-------

Clone the repository and install dependencies:

    $ git clone git://github.com/senchalabs/jsduck-comments.git
    $ cd jsduck-comments
    $ npm install

Create new MySQL database and run the schema.sql script to set up the
tables:

    $ mysql my_comments_db_name < sql/schema.sql

Create config file with user & pass for connecting to MySQL database:

    $ cp config.example.js config.js
    $ vi config.js


Usage
-----

Run the `app.js` script to start the server:

    $ node app.js

Preferably though, use [always][] to run it, so in case it happens to
crash it'll be restarted automatically:

    $ always app.js

[always]: https://github.com/edwardhotchkiss/always

Now the server is running, but we also need a client side, which of
course is the docs app that JSDuck generates.  But we need to tell
JSDuck the address of the server and the "domain" of comments.

When you're running on your local machine, the URL will be
`http://localhost:3000/auth` (unless you have changed the default port
in config.js file).

The domain is a simple string of `<name>/<version>` - it allows a
single comments server to handle requests from multiple docs apps.  So
you could have multiple docs generated with the same comments server
URL but with different domain names.

For example:

    $ jsduck --comments-url http://localhost:3000/auth --comments-domain extjs/4 ...

Now open the generated docs app in browser and try to log in with your
username and password.


Development
-----------

Install [jasmine][] if you don't have it already:

    $ npm install jasmine-node -g

[jasmine]: https://github.com/mhevery/jasmine-node

Make sure you have the `testDb` configured in `config.js` - just set
up an empty MySQL database that'll be used for testing.  Then simply
run make:

    $ make

For now the testsuite is database-io-heavy and therefore somewhat
slow.  Hope to improve that on the future.

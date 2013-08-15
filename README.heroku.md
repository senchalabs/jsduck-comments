Running your own JSDuck Comments Server on Heroku
=================================================

If you want to run the comments servers on [Heroku](http://www.heroku.com) then read along.

First of all, you need to have a Heroku account setup, your SSH keys pushed to it etc and have the heroku toolbelt setup on your local system.

### Initial setup (Heroku tools and mysql etc)

1. See [Nodejs and Heroku](https://devcenter.heroku.com/articles/nodejs) to get your Heroku account setup and your local build environment ready.

2. Depending on your OS, make sure you have nodejs and npm etc installed. 

3. Clone the master branch and install node dependencies. Setup the mysql database (Your database must be accessible to Heroku!)

```    
    $ git clone git@github.com:senchalabs/jsduck-comments.git
    $ cd jsduck-comments && npm install
    $ mysql -u<dbuser> -p<dbpass> -h<dbhost> dbname < sql/schema.sql
```

### AWS SES setup, tesing and open mysql to Heroku ###

1. To be able to send out emails from Heroku, you will need either an SMTP relay available or use SES. App sends out email using nodemailer so its trivial to add-in support for using Gmail as well. I will assume you are going to use SES.

2. Enable Amazon SES on your AWS account and authenticate/verify your entire domain to be able to send emails as user@domain.com. See [AWS SES Developer Guide](http://docs.aws.amazon.com/ses/latest/DeveloperGuide/verify-domains.html) for details.(Full domain auth is needed since the sender 'from' will vary each time). You should receive an email from AWS confirming the domain is now verified for use with SES (Yours DNS admins help will be needed to complete verification as this involves adding custom TXT records).

3. From your AWS Account page, grab your AWS Access ID and Secret Key. You will need to stick this into your local config.js. Its safer to use a set of keys with access to SES alone (Ask your EC2 admin to create a IAM user policy with SES access alone and apply it)

4. Modify the config.js to have the params email.mode="SES", email.config.AWSAccessKeyID='AWS-ACC-ID' and email.config.AWSSecretKey='AWS-SECRET'. See config.example.js. Use 'node testmail_ses.js youremail@domain.com' to test if your SES setup and auth keys are OK.

5. Although you will be specifying the config in config.js, this file will never be pushed to Heroku(To keep config.js out of your your git repo).

6. When running on Heroku, you will need to make sure your Mysql database host is accessible from the internet. e.g. as mydb.domain.com:3306. If your database host is a EC2 instance, you(rather your EC2 admin) can run this to open up TCP/3306 to Heroku.  

```
    $ ec2-authorize YOURGROUP -P tcp -p 3306 -u 098166147350 -o default
```

### Local testing ###

1. Run the app locally via foreman and test its accessible(Defaults to port 5000 in config.port)

```
    $ foreman start
    $ curl http://localhost:5000/serverinfo
```

### Link local git repo to Heroku ###

1. Create a new heroku app from the Heroku GUI or console (assuming AppUrl jsduck-comments-svr.herokuapp.com & Git `git@heroku.com:jsduck-comments-svr.git`)

2. Now link your local checkout folder to the Heroku Git by adding heroku as a remote repo.

```
    $ git remote add heroku git@heroku.com:jsduck-comments-svr.git
    $ git remote -v
```

### Push to Heroku ###

Push the app to Heroku (Any push to the heroku master branch will deploy the app/changes to the Heroku app endpoint)

```
    $ git push heroku master
```

### Flatten config ###
While your "local" copy will use config.js, we dont want to push this to Heroku/Your-Git (It is in .gitignore). So push the config as a flat param list to Heroku.

```
    $ node flattenconfig.js ./config.js | sh
    $ heroku config
```

The above would have generated a `heroku config set:` command based on your config.js and updated the Heroku app config with this flattened set of config params and restarted the app at Heroku to read in the config.

### Use custom domain for the app ###
If you would like the app addressable by a custom name (say comments.domain.com), then run the following and setup comments.domain.com as a CNAME to the app url from the `heroku info` cmd.

```
    $ heroku domains:add comments.domain.com 
    $ heroku info | perl -ne 'print $1 if /http:\/\/(.*)\/$/;'
```

### Add more web processes at Heroku (optional) ###
If you are using Heroku in the free tier, your app has only one web worker (which could be put to sleep after some inactivity). Bump up to two web processes if needed(costs ~$30 per month) -

```
    $ heroku ps:scale web=2
```

Access your app url and thats it (Note: I've noticed the first access after a push/restart to heroku is somewhat slow - maybe web processes are'nt started up until a request is received but subseqeuent ones go thru immediately). Hit the health check url via `curl -v http://comments.domain.com/serverinfo` to check...

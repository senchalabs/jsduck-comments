Running your own JSDuck Comments Server on Heroku
=================================================

If you want to run the comments servers on [Heroku][http://www.heroku.com] then read along.

First of all, you need to have a Heroku account setup, your SSH keys pushed to it etc and have the heroku toolbelt setup on your local system.

1. See [Nodejs and Heroku][https://devcenter.heroku.com/articles/nodejs] to get your Heroku account setup and your local build environment ready.
2. Depending on your OS, make sure you have nodejs and npm etc installed. 
3. Clone the master branch via `git clone git@github.com:senchalabs/jsduck-comments.git` and `cd jsduck-comments && npm install` to install deps.
4. To be able to send out emails from Heroku, you will need either an SMTP relay available or use SES. App sends out email using nodemailer so its trivial to add-in support for using Gmail as well. I will assume you are going to use SES.
5. Enable Amazon SES on your AWS account and authenticate/verify your entire domain to be able to send emails as user@domain.com. See [AWS SES Developer Guide][http://docs.aws.amazon.com/ses/latest/DeveloperGuide/verify-domains.html] for details.(Full domain auth is needed since the sender 'from' will vary each time).
6. From your AWS Account page, grab your AWS Access ID and Secret Key. You will need to stick this into your local config.js.
7. Modify the config.js to have the params email.mode="SES", email.config.AWSAccessKeyID='AWS-ACC-ID' and email.config.AWSSecretKey='AWS-SECRET'. See config.example.js.
8. Although you will be specifying the config in config.js, this file will never be pushed to Heroku(To keep config.js out of your your git repo).
9. When running on Heroku, you will need to make sure your Mysql database host is accessible from the internet. e.g. as mydb.domain.com:3306. If your database host is a EC2 instance, you(/your EC2 admin) can run `ec2-authorize YOURGROUP -P tcp -p 3306 -u 098166147350 -o default` to open up 3306 to Heroku.
9. Run the app locally via `foreman start` to confirm all the config etc work fine. You should be able to hit `curl http://localhost:5000/serverinfo` now to check.
10. Create a new heroku app from the Heroku GUI or console (assuming name jsduck-comments-svr.herokuapp.com and Git git@heroku.com:jsduck-comments-svr.git)
10. Now link your local checkout folder to the Heroku Git by adding heroku as a remote repo.
11. `git remote add heroku git@heroku.com:jsduck-comments-svr.git `
12. Push the app to Heroku - `git push heroku master` (Note anything you push to the Heroku master branch will get deployed!)
13. While your "local" copy will use config.js, we dont want to push this to Heroku/Your-Git. So push the config as a flat param list to Heroku.
14. `node flattenconfig.js ./config.js` - This will generate a `heroku config:set ...` command. Copy and paste this and run in your console to push the config to Heroku. This will bounce the app as well to have it read the config changes. Wrapper lib/configwrapper.js will use Heroku ENV params when config.js is not available.
15. You can always see the "current" Heroku config via `heroku config`. This should be a flattened list of keys from config.js if you did Step #14.
16. If you would like the app addressable by a custom name (say comments.domain.com), then run `heroku domains:add comments.domain.com` and setup comments.domain.com as a CNAME on your DNS to point to the apps hostname (`heroku info | perl -ne 'print $1 if /http:\/\/(.*)\/$/;'`)
17. If you are using Heroku in the free tier, your app has only one web worker (which could be put to sleep after some inactivity). To add more web processes, run `heroku ps:scale web=2` to set the app to have 2 web processes(This will cost you ~30$ a month)
18. Access your app url and thats it (Note: I've noticed the first access after a push/restart to heroku is slow - maybe web processes are'nt started up until a request is received but subseqeuent ones go thru immediately). Hit the health check url via `curl -v http://comments.domain.com/serverinfo` to check...

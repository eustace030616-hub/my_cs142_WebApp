/**
 * This builds on the webServer of previous projects in that it exports the
 * current directory via webserver listing on a hard code (see portno below)
 * port. It also establishes a connection to the MongoDB named 'cs142project6'.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch
 * any file accessible to the current user in the current directory or any of
 * its children.
 *
 * This webServer exports the following URLs:
 * /            - Returns a text status message. Good for testing web server
 *                running.
 * /test        - Returns the SchemaInfo object of the database in JSON format.
 *                This is good for testing connectivity with MongoDB.
 * /test/info   - Same as /test.
 * /test/counts - Returns the population counts of the cs142 collections in the
 *                database. Format is a JSON object with properties being the
 *                collection name and the values being the counts.
 *
 * The following URLs need to be changed to fetch there reply values from the
 * database:
 * /user/list         - Returns an array containing all the User objects from
 *                      the database (JSON format).
 * /user/:id          - Returns the User object with the _id of id (JSON
 *                      format).
 * /photosOfUser/:id  - Returns an array with all the photos of the User (id).
 *                      Each photo should have all the Comments on the Photo
 *                      (JSON format).
 */

// new dependencies for project7
const session = require("express-session");
const bodyParser = require("body-parser");
const multer = require("multer");

const mongoose = require("mongoose");
mongoose.Promise = require("bluebird");

const async = require("async");

const express = require("express");
const app = express();

// Load the Mongoose schema for User, Photo, and SchemaInfo
const User = require("./schema/user.js");
const Photo = require("./schema/photo.js");
const SchemaInfo = require("./schema/schemaInfo.js");

// XXX - Your submission should work without this line. Comment out or delete
// this line for tests and before submission!
//const cs142models = require("./modelData/photoApp.js").cs142models;
mongoose.set("strictQuery", false);
mongoose.connect("mongodb://127.0.0.1/cs142project6", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// new project7 
// "secretKey" is the secret you use to cryptographically protect the session cookie.
// use the multer middleware in the photo upload code.
app.use(session({secret: "secretKey", resave: false, saveUninitialized: false}));
app.use(bodyParser.json());

// We have the express static module
// (http://expressjs.com/en/starter/static-files.html) do all the work for us.
app.use(express.static(__dirname));

app.get("/", function (request, response) {
  response.send("Simple web server of files from " + __dirname);
});

/**
 * Use express to handle argument passing in the URL. This .get will cause
 * express to accept URLs with /test/<something> and return the something in
 * request.params.p1.
 * 
 * If implement the get as follows:
 * /test        - Returns the SchemaInfo object of the database in JSON format.
 *                This is good for testing connectivity with MongoDB.
 * /test/info   - Same as /test.
 * /test/counts - Returns an object with the counts of the different collections
 *                in JSON format.
 */
app.get("/test/:p1", function (request, response) {
  // Express parses the ":p1" from the URL and returns it in the request.params
  // objects.
  console.log("/test called with param1 = ", request.params.p1);

  const param = request.params.p1 || "info";

  if (param === "info") {
    // Fetch the SchemaInfo. There should only one of them. The query of {} will
    // match it.
    SchemaInfo.find({}, function (err, info) {
      if (err) {
        // Query returned an error. We pass it back to the browser with an
        // Internal Service Error (500) error code.
        console.error("Error in /user/info:", err);
        response.status(500).send(JSON.stringify(err));
        return;
      }
      if (info.length === 0) {
        // Query didn't return an error but didn't find the SchemaInfo object -
        // This is also an internal error return.
        response.status(500).send("Missing SchemaInfo");
        return;
      }

      // We got the object - return it in JSON format.
      console.log("SchemaInfo", info[0]);
      response.end(JSON.stringify(info[0]));
    });
  } else if (param === "counts") {
    // In order to return the counts of all the collections we need to do an
    // async call to each collections. That is tricky to do so we use the async
    // package do the work. We put the collections into array and use async.each
    // to do each .count() query.
    const collections = [
      { name: "user", collection: User },
      { name: "photo", collection: Photo },
      { name: "schemaInfo", collection: SchemaInfo },
    ];
    async.each(
      collections,
      function (col, done_callback) {
        col.collection.countDocuments({}, function (err, count) {
          col.count = count;
          done_callback(err);
        });
      },
      function (err) {
        if (err) {
          response.status(500).send(JSON.stringify(err));
        } else {
          const obj = {};
          for (let i = 0; i < collections.length; i++) {
            obj[collections[i].name] = collections[i].count;
          }
          response.end(JSON.stringify(obj));
        }
      }
    );
  } else {
    // If we know understand the parameter we return a (Bad Parameter) (400)
    // status.
    response.status(400).send("Bad param " + param);
  }
});

/**
 * URL /admin/login - Provides a way for the photo app's LoginRegister view to login in a user.
 */
app.post("/admin/login", function(request, response) {
  const login_name = request.body.login_name;
  const password = request.body.password;

  User.findOne({ login_name: login_name })

    .then(function(user) {
      
      if(!user) {
        response.status(400).send({ error: 'Invalid login_name'});
        return;
      }
      if (password !== user.password) {
        response.status(400).send({ error: 'Invalid password'});
        return;
      }

      // login success, set session
      request.session.user_id = user._id;
      request.session.login_name = user.login_name;
      response.status(200).send({
        _id: user._id,
        first_name: user.first_name,
      });
    })
    .catch(function(err) {
      response.status(500).send({ error: 'server error'});
    });
});

/**
 * URL /admin/logout - logout the user by clearing the information stored in the session.
 */
app.post("/admin/logout", function(request, response) {

  if (!request.session.user_id) {
    response.status(400).send("User is not logged in");
    return;
  }

  request.session.destroy();
  response.send({ ok: true});
});

/**
 * Add new comments /commentsOfPhotos/:photo:id
 */
app.post("/commentsOfPhotos/:photo_id", function(request, response) {
  if (!request.session.user_id) {
    response.status(401).send("Not logged in");
    return;
  }

  var commentText = request.body.comment;
  if (!commentText) {
    response.status(400).send("Comment text is required");
    return;
  }

  // Create the comment in the photo
  var newComment = {
    comment: commentText,
    date_time: new Date(),
    user_id: request.session.user_id,
  };

  Photo.findByIdAndUpdate(
    request.params.photo_id,
    { $push: { comments: newComment } },
    { new: true }
  )
    .then(function(photo) {
      if (!photo) {
        response.status(400).send("Photo not found");
        return;
      }
      var addedComment = photo.comments[photo.comments.length - 1];

      // send gathered info for frontend
      User.findById(request.session.user_id)
        .then(function(user) {
          response.send({
            _id: addedComment._id,
            comment: addedComment.comment,
            date_time: addedComment.date_time,
            user_id: addedComment.user_id,
            user: {
              _id: user._id,
              first_name: user.first_name,
              last_name: user.last_name,
            },
          });
        });
    })
    .catch(function(err) {
      response.status(500).send("Server error");
    });
});

/**
 * URL /admin/session - Returns the current logged-in user's info.
 * Used on page load to restore login state from the session cookie.
 */
app.get("/admin/session", function(request, response) {
  if (!request.session.user_id) {
    response.status(401).send("Not logged in");
    return;
  }

  User.findById(request.session.user_id)
    .then(function(user) {
      if (!user) {
        request.session.destroy();
        response.status(401).send("Session invalid");
        return;
      }
      response.send({
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
      });
    })
    .catch(function(err) {
      response.status(500).send("Server error");
    });
});

/**
 * URL /user/list - Returns all the User objects.
 */
app.get("/user/list", function (request, response) {
  User.find({})
    .then(function(users) {
      var sideBarUsers = users.map(function(u) {
        return {
          _id: u._id,
          first_name: u.first_name,
          last_name: u.last_name,
        };
      });
      response.status(200).send(sideBarUsers);
    })
    .catch(function() {
      response.status(500).send("DB error");
    });
});

/**
 * URL /user/:id - Returns the information for User (id).
 */
app.get("/user/:id", function (request, response) {
  var userId = request.params.id;

  User.findById(userId)
    .then(function(user) {
      if (!user) {
        response.status(400).send("User not found");
        return;
      }

      var userDetails = {
        _id: user._id,
        first_name: user.first_name,
        last_name: user.last_name,
        description: user.description,
        occupation: user.occupation,
        location: user.location,
      };
      response.status(200).send(userDetails);
    })

    .catch(function(err) {
      if (err.name === "CastError") {
        response.status(400).send("Invalid user ID");
      } else {
        console.error("Error in /user/:id:", err);
        response.status(500).send("DB error");
      }
    });
});

/**
 * URL /photosOfUser/:id - Returns the Photos for User (id).
 */
app.get("/photosOfUser/:id", function (request, response) {
  var userId = request.params.id;

  Photo.find({ user_id: userId })
    .then(function(photos) {

      if (photos.length === 0) {
        response.status(400).send("Not found");
        return;
      }

      var uniqueUserIDOfComments = [];
      photos.forEach(function(photo) {
        photo.comments.forEach(function(comment) {
          if (uniqueUserIDOfComments.indexOf(comment.user_id.toString()) === -1) {
            uniqueUserIDOfComments.push(comment.user_id);
          }
        });
      });

      if (uniqueUserIDOfComments.length === 0) {
        var result = photos.map(function(p) {
          return {
            _id: p._id,
            file_name: p.file_name,
            date_time: p.date_time,
            user_id: p.user_id,
            comments: [],
          };
        });
        response.status(200).send(result);
        return;
      }

      User.find({ _id: { $in: uniqueUserIDOfComments } })
        .then(function(users) {
          var userMap = {};
          users.forEach(function(u) {
            userMap[u._id] = u;
          });
          var results = photos.map(function(p) {
            return {
              _id: p._id,
              file_name: p.file_name,
              date_time: p.date_time,
              user_id: p.user_id,
              comments: p.comments.map(function(comment) {
                var commentUser = userMap[comment.user_id];
                return {
                  _id: comment._id,
                  comment: comment.comment,
                  date_time: comment.date_time,
                  user: {
                    _id: commentUser._id,
                    first_name: commentUser.first_name,
                    last_name: commentUser.last_name,
                  },
                };
              }),
            };
          });
          response.status(200).send(results);
        })
        .catch(function() {
          response.status(500).send("DB error");
        });
    })
    .catch(function(err) {
      if (err.name === "CastError") {
        response.status(400).send("Invalid user ID");
      } else {
        console.error("Error in /photosOfUser/:id:", err);
        response.status(500).send("DB error");
      }
    });
});

const server = app.listen(3000, function () {
  const port = server.address().port;
  console.log(
    "Listening at http://localhost:" +
      port +
      " exporting the directory " +
      __dirname
  );
});

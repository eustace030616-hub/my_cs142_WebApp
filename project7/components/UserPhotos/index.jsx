import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  TextField,
  Button,
  Typography,
  Grid,
  Box,
  Link as MuiLink,
} from "@mui/material";
import { Link } from "react-router-dom";

import "./styles.css";
import axios from "axios";

class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      photos: [],
      expandedPhotoId: null,
      currentIndex: 0,
      showComments: false,
      photoOwner: null,
      newComment: '',
    };

    var userId = this.props.match.params.userId;

    // Fetch photo owner info
    axios.get("/user/" + userId).then(
      function (response) {
        this.setState({ photoOwner: response.data });
      }.bind(this)
    );

    // Read initial photo index from URL
    var initialIndex = 0;
    if (this.props.location.search) {
      var params = new URLSearchParams(this.props.location.search);
      var photoParam = params.get("photo");
      if (photoParam !== null) {
        initialIndex = parseInt(photoParam, 10);
      }
    }

    this.state.currentIndex = isNaN(initialIndex) ? 0 : initialIndex;

    axios.get("/photosOfUser/" + userId).then(
      function (response) {
        this.setState({ photos: response.data });
      }.bind(this)
    );
  }

  componentDidUpdate(prevProps) {
    var userId = this.props.match.params.userId;
    var prevUserId = prevProps.match.params.userId;

    // If navigating to a different user, fetch new photos
    if (userId !== prevUserId) {
      // Reset index for new user
      var initialIndex = 0;
      if (this.props.location.search) {
        var params = new URLSearchParams(this.props.location.search);
        var photoParam = params.get("photo");
        if (photoParam !== null) {
          initialIndex = parseInt(photoParam, 10);
        }
      }
      this.setState({
        photos: [],
        currentIndex: isNaN(initialIndex) ? 0 : initialIndex,
      });

      axios.get("/photosOfUser/" + userId).then(
        function (response) {
          this.setState({ photos: response.data });
        }.bind(this)
      );
    } else {
      // Check if URL photo param changed (browser back/forward)
      var prevSearch = prevProps.location.search || "";
      var currSearch = this.props.location.search || "";
      if (
        this.props.advancedFeatures &&
        prevSearch !== currSearch
      ) {
        var params = new URLSearchParams(currSearch);
        var photoParam = params.get("photo");
        if (photoParam !== null) {
          var newIndex = parseInt(photoParam, 10);
          if (!isNaN(newIndex) && newIndex !== this.state.currentIndex) {
            this.setState({ currentIndex: newIndex, expandedPhotoId: null });
          }
        }
      }
    }
  }

  handlePhotoClick(photoId) {
    this.setState(function (prevState) {
      return {
        expandedPhotoId:
          prevState.expandedPhotoId === photoId ? null : photoId,
      };
    });
  }

  handleToggleComments() {
    this.setState(function (prevState) {
      return { showComments: !prevState.showComments };
    });
  }

  handleStepperClick(index) {
    this.setState({ currentIndex: index, expandedPhotoId: null, showComments: false });

    // Update URL for bookmarking
    var path = this.props.location.pathname;
    var newUrl = path + "?photo=" + index;
    this.props.history.push(newUrl);
  }

  handlePostComment(photoId) {
  axios.post(`/commentsOfPhotos/${photoId}`, { comment: this.state.newComment })
    .then(response => {
      var photos = [...this.state.photos];
      var photo = photos.find(p => p._id === photoId);
      photo.comments.push(response.data);  // ← complete object, push directly
      this.setState({ photos: photos, newComment: "" });
    });
  }
  
  renderGridView() {
    return (
      <Box
        sx={{
          p: 2,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 2,
          alignItems: "start",
        }}
      >
        {this.state.photos.map(function (photo) {
          return (
            <Card key={photo._id} sx={{ overflow: "hidden" }}>
              <CardMedia
                component="img"
                height="280"
                image={"/images/" + photo.file_name}
                alt={photo.file_name}
                sx={{ objectFit: "cover", cursor: "pointer" }}
                onClick={() => this.handlePhotoClick(photo._id)}
              />
              <CardContent
                sx={{ p: "8px 12px", "&:last-child": { pb: "8px" } }}
              >
                <Typography variant="caption" color="text.secondary">
                  {photo.file_name}
                </Typography>

                {this.state.expandedPhotoId === photo._id && (
                  <Box
                    sx={{
                      mt: 1,
                      pt: 1,
                      borderTop: 1,
                      borderColor: "divider",
                    }}
                  >
                    {photo.comments && photo.comments.length > 0
                      ? photo.comments.map(function (comment) {
                          return (
                            <Box key={comment._id} sx={{ mb: 2 }}>
                              <MuiLink
                                component={Link}
                                to={"/users/" + comment.user._id}
                                variant="body2"
                                underline="hover"
                                color="primary"
                              >
                                {comment.user.first_name}{" "}
                                {comment.user.last_name}
                              </MuiLink>
                              <Typography variant="body2" sx={{ mt: 0.8 }}>
                                {comment.comment}
                              </Typography>
                              <Typography
                                variant="caption"
                                color="text.disabled"
                              >
                                {comment.date_time}
                              </Typography>
                            </Box>
                          );
                        })
                      : (
                        <Typography
                          variant="body2"
                          color="text.disabled"
                          fontStyle="italic"
                        >
                          -No Comment-
                        </Typography>
                      )}
                    <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
                      <TextField
                        size="small"
                        fullWidth
                        placeholder="Write a comment..."
                        value={this.state.newComment}
                        onChange={(e) => this.setState({ newComment: e.target.value })}
                      />
                      <Button
                        variant="contained"
                        size="small"
                        onClick={() => this.handlePostComment(photo._id)}
                      >
                        Post
                      </Button>
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          );
        }, this)}
      </Box>
    );
  }

  renderStepperView() {
    var photos = this.state.photos;
    if (photos.length === 0) {
      return null;
    }

    var index = this.state.currentIndex;
    // Clamp index to valid range
    if (index < 0) index = 0;
    if (index >= photos.length) index = photos.length - 1;

    var photo = photos[index];
    var hasPrev = index > 0;
    var hasNext = index < photos.length - 1;

    return (
      <Box sx={{ p: 2 }}>
        {/* Fixed-height placeholder for prev thumbnail - always present */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 1,
            height: 100,
            alignItems: "flex-end",
          }}
        >
          {hasPrev && (
            <Card
              sx={{ width: 200, cursor: "pointer", opacity: 0.5 }}
              onClick={() => this.handleStepperClick(index - 1)}
            >
              <CardMedia
                component="img"
                height="100"
                image={"/images/" + photos[index - 1].file_name}
                alt={photos[index - 1].file_name}
                sx={{ objectFit: "cover", filter: "blur(2px)" }}
              />
            </Card>
          )}
        </Box>

        {/* Main photo card */}
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <Card sx={{ width: 650 }}>
            {/* User info bar above the photo */}
            <Box
              sx={{
                p: "8px 12px",
                borderBottom: 1,
                borderColor: "divider",
                bgcolor: "white",
              }}
            >
              <MuiLink
                component={Link}
                to={"/users/" + this.props.match.params.userId}
                variant="body2"
                underline="hover"
                color="primary"
                fontWeight="medium"
              >
                {this.state.photoOwner
                  ? this.state.photoOwner.first_name +
                    " " +
                    this.state.photoOwner.last_name
                  : "Loading..."}
              </MuiLink>
            </Box>

            <CardMedia
              component="img"
              height="450"
              image={"/images/" + photo.file_name}
              alt={photo.file_name}
              sx={{ objectFit: "contain", bgcolor: "#f5f5f5" }}
            />
            <CardContent
              sx={{
                p: "8px 12px",
                "&:last-child": { pb: "8px" },
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  {photo.file_name}
                </Typography>
                <Typography
                  variant="caption"
                  color="text.disabled"
                  sx={{ fontSize: "11px" }}
                >
                  {photo.date_time}
                </Typography>
              </Box>

              <Box
                onClick={() => this.handleToggleComments()}
                sx={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  color: "text.secondary",
                  "&:hover": { color: "primary.main" },
                  userSelect: "none",
                }}
              >
                <Typography variant="body2" sx={{ mr: 0.5 }}>
                  Comments:
                </Typography>
                <Typography variant="body2">
                  {photo.comments ? photo.comments.length : 0}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Box>

        {/* Comments section - shown when toggled, dynamic height */}
        {this.state.showComments && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 1 }}>
            <Card sx={{ width: 650 }}>
              <CardContent sx={{ "&:last-child": { pb: "8px" } }}>
                <Typography variant="subtitle2" sx={{ mb: 1 }}>
                  Comments
                </Typography>
                {photo.comments && photo.comments.length > 0
                  ? photo.comments.map(function (comment) {
                      return (
                        <Box key={comment._id} sx={{ mb: 2 }}>
                          <MuiLink
                            component={Link}
                            to={"/users/" + comment.user._id}
                            variant="body2"
                            underline="hover"
                            color="primary"
                          >
                            {comment.user.first_name}{" "}
                            {comment.user.last_name}
                          </MuiLink>
                          <Typography variant="body2" sx={{ mt: 0.8 }}>
                            {comment.comment}
                          </Typography>
                          <Typography
                            variant="caption"
                            color="text.disabled"
                          >
                            {comment.date_time}
                          </Typography>
                        </Box>
                      );
                    })
                  : (
                    <Typography
                      variant="body2"
                      color="text.disabled"
                      fontStyle="italic"
                    >
                      -No Comment-
                    </Typography>
                  )}
              </CardContent>
            </Card>
          </Box>
        )}

        {/* Fixed-height placeholder for next thumbnail - always present */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mt: 1,
            height: 20,
            alignItems: "flex-start",
          }}
        >
          {hasNext && (
            <Card
              sx={{ width: 200, cursor: "pointer", opacity: 0.5 }}
              onClick={() =>
                this.handleStepperClick(index + 1)
              }
            >
              <CardMedia
                component="img"
                height="100"
                image={"/images/" + photos[index + 1].file_name}
                alt={photos[index + 1].file_name}
                sx={{ objectFit: "cover", filter: "blur(2px)" }}
              />
            </Card>
          )}
        </Box>
      </Box>
    );
  }

  render() {
    if (this.props.advancedFeatures && this.state.photos.length > 0) {
      return this.renderStepperView();
    }
    return this.renderGridView();
  }
}

export default UserPhotos;

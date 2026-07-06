import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Grid,
  Box,
  Link as MuiLink,
} from "@mui/material";
import { Link } from "react-router-dom";

import "./styles.css";

/**
 * Define UserPhotos, a React component of CS142 Project 5.
 */
class UserPhotos extends React.Component {
  constructor(props) {
    super(props);
    const userId = this.props.match.params.userId;
    const photos = window.cs142models.photoOfUserModel(userId);
    this.state = {
      photos: photos,
      expandedPhotoId: null,
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.match.params.userId !== this.props.match.params.userId) {
      const userId = this.props.match.params.userId;
      const photos = window.cs142models.photoOfUserModel(userId);
      this.setState({ photos: photos, expandedPhotoId: null });
    }
  }

  handlePhotoClick(photoId) {
    this.setState((prevState) => ({
      expandedPhotoId:
        prevState.expandedPhotoId === photoId ? null : photoId,
    }));
  }

  render() {
    return (
      <Box sx={{ p: 2 }}>
        <Grid container spacing={2} alignItems="flex-start">
          {this.state.photos.map((photo) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={photo._id}>
              <Card sx={{ overflow: "hidden" }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={`/images/${photo.file_name}`}
                  alt={photo.file_name}
                  sx={{ objectFit: "cover", cursor: "pointer" }}
                  onClick={() => this.handlePhotoClick(photo._id)}
                />
                <CardContent sx={{ p: "8px 12px", "&:last-child": { pb: "8px" } }}>
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
                      {photo.comments && photo.comments.length > 0 ? (
                        photo.comments.map((comment) => (
                          <Box key={comment._id} sx={{ mb: 2 }}>
                            <MuiLink
                            component={Link}
                            to={`/users/${comment.user._id}`}
                            variant="body2"
                            underline="hover"
                            color="primary"
                            >
                              {comment.user.first_name} {comment.user.last_name}
                            </MuiLink>
                            <Typography variant="body2" sx={{ mt:0.8 }}>
                              {comment.comment}
                            </Typography>
                            <Typography
                              variant="caption"
                              color="text.disabled"
                            >
                              {comment.date_time}
                            </Typography>
                          </Box>
                        ))
                      ) : (
                        <Typography
                          variant="body2"
                          color="text.disabled"
                          fontStyle="italic"
                        >
                          -No Comment-
                        </Typography>
                      )}
                    </Box>
                  )}
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }
}

export default UserPhotos;

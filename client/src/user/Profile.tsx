import React, { useState, useEffect } from 'react';
import { makeStyles, Paper, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Avatar, IconButton, Typography, Divider } from '@material-ui/core';
import EditIcon from '@material-ui/icons/Edit';
import PersonIcon from '@material-ui/icons/Person';
import { useLocation, Navigate, Link, useParams } from 'react-router-dom';
import auth from '../lib/auth-helper';
import { read } from './api-user';

const useStyles = makeStyles(theme => ({
  root: {
    ...theme.mixins.gutters(),
    maxWidth: 600,
    margin: 'auto',
    padding: theme.spacing(3),
    marginTop: theme.spacing(5)
  },
  title: {
    marginTop: theme.spacing(3),
    color: theme.palette.primary.main
  }
}));

interface User {
  _id?: string;
  name?: string;
  email?: string;
  created?: Date;
}

const Profile: React.FC = () => {
  const classes = useStyles();
  const [user, setUser] = useState<User>({});
  const [redirectToSignin, setRedirectToSignin] = useState(false);
  const jwt = auth.isAuthenticated();
  const { userId } = useParams<{ userId?: string }>(); // Change type to accept undefined
  const location = useLocation();
  const token = jwt && typeof jwt !== 'boolean' ? jwt.token : '';
  
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
  
    if (userId) { // Check if userId is defined
      read({ userId }, { t: token }, signal)
        .then((data) => {
          if (data && data.error) {
            setRedirectToSignin(true);
          } else if (data) { // Ensure data is defined before setting the user
            setUser(data);
          }
        })
        .catch((err) => {
          if (err.name === 'AbortError') {
            console.log('Fetch aborted');
          } else {
            console.log(err);
          }
        });
    }
  
    return function cleanup() {
      abortController.abort(); // Abort fetch request on component unmount
    };
  }, [userId]);

  if (redirectToSignin) {
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />;
  }

  const isAuthenticated = auth.isAuthenticated();

  return (
    <Paper className={classes.root} elevation={4}>
      <Typography variant="h6" className={classes.title}>
        Profile
      </Typography>
      <List dense>
      <ListItem>
        <ListItemAvatar>
          <Avatar>
            <PersonIcon />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary={user?.name} secondary={user?.email} /> {/* Add '?' to safely access properties */}
        {jwt && user && ( // Add check for user existence
          <ListItemSecondaryAction>
            <Link to={`/user/edit/${user._id}`}>
              <IconButton aria-label="Edit" color="primary">
                <EditIcon />
              </IconButton>
            </Link>
          </ListItemSecondaryAction>
        )}
      </ListItem>
        <Divider />
        <ListItem>
        <ListItemText primary={`Joined: ${user?.created && new Date(user.created).toDateString()}`} /> {/* Add '?' to safely access properties */}
        </ListItem>
      </List>
    </Paper>
  );
};

export default Profile;

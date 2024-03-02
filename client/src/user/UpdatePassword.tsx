import  { useState, useEffect } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import { makeStyles, Theme } from '@material-ui/core/styles';
import { useParams, Navigate } from 'react-router-dom';

import auth from '../lib/auth-helper';
import { read, updatePassword } from './api-user';

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    textAlign: 'center',
    marginTop: theme.spacing(5),
    paddingBottom: theme.spacing(2),
  },
  title: {
    margin: theme.spacing(2),
    color: theme.palette.text.primary,
  },
  error: {
    verticalAlign: 'middle',
  },
  textField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300,
  },
  submit: {
    margin: 'auto',
    marginBottom: theme.spacing(2),
  },
}));

interface UserValues {
  username: string;
  email: string;
  oldPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
  error: string;
  redirectToProfile: boolean;
}

export default function UpdatePassword() {
  const classes = useStyles();
  const [values, setValues] = useState<UserValues>({
    username: '',
    email: '',
    oldPassword: '',
    newPassword: '',
    newPasswordConfirm: '',
    error: '',
    redirectToProfile: false,
  });
  const jwt = auth.isAuthenticated();
  const { userId } = useParams<{ userId?: string }>(); // Change type to accept undefined
  const token = jwt && typeof jwt !== 'boolean' ? jwt.token : '';
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;
    if (userId) {
      read({ userId: userId }, { t: token }, signal).then((data) => {
        if (data && data.error) {
          setValues((prevValues) => ({ ...prevValues, error: data.error }));
        } else {
          setValues((prevValues) => ({
            ...prevValues,
            username: data?.username ?? '', // Use optional chaining and nullish coalescing
            email: data?.email ?? '', // Use optional chaining and nullish coalescing
          }));
        }
      });
    }
  
    return function cleanup() {
      abortController.abort();
    };
  }, [userId, token]);

  const clickSubmit = () => {
    const user = {
      oldPassword: values.oldPassword || undefined,
      newPassword: values.newPassword || undefined,
      newPasswordConfirm: values.newPasswordConfirm || undefined,
    };
    if(userId){
        updatePassword(
            {
              userId: userId
            },
            {
              t:token
            },
            user
          ).then((data) => {
            if (data && data.error) {
              setValues((prevValues) => ({ ...prevValues, error: data.error }));
            } else {
              setValues((prevValues) => ({
                ...prevValues,
                redirectToProfile: true,
              }));
            }
          });
    }

  };

  if (values.redirectToProfile) {
    return <Navigate to={'/user/' + userId} />;
  }

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h6" className={classes.title}>
          Update Password
        </Typography>
        <TextField
          id="username"
          label="Username"
          disabled
          value={values.username}
          InputProps={{
            readOnly: true,
          }}
          margin="normal"
        />
        <br />
        <TextField
          id="email"
          label="Email"
          disabled
          value={values.email}
          InputProps={{
            readOnly: true,
          }}
          margin="normal"
        />
        <br />
        <TextField
          id="oldPassword"
          label="Old Password"
          type="password"
          className={classes.textField}
          value={values.oldPassword}
          onChange={(e) => setValues((prevValues) => ({ ...prevValues, oldPassword: e.target.value }))}
          margin="normal"
        />
        <br />
        <TextField
          id="newPassword"
          label="New Password"
          type="password"
          className={classes.textField}
          value={values.newPassword}
          onChange={(e) => setValues((prevValues) => ({ ...prevValues, newPassword: e.target.value }))}
          margin="normal"
        />
        <br />
        <TextField
          id="newPasswordConfirm"
          label="Confirm New Password"
          type="password"
          className={classes.textField}
          value={values.newPasswordConfirm}
          onChange={(e) => setValues((prevValues) => ({ ...prevValues, newPasswordConfirm: e.target.value }))}
          margin="normal"
        />
        <br />
        {values.error && (
          <Typography component="p" color="error">
            <Icon color="error" className={classes.error}>
              error
            </Icon>
            {values.error}
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Button
          color="primary"
          variant="contained"
          onClick={clickSubmit}
          className={classes.submit}
        >
          Update Password
        </Button>
      </CardActions>
    </Card>
  );
}

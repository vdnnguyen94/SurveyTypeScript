import React, { useState, useEffect } from 'react';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Icon from '@material-ui/core/Icon';
import { makeStyles, Theme } from '@material-ui/core/styles';
import auth from '../lib/auth-helper';
import { Link, useParams, Navigate } from 'react-router-dom';
import { read, update } from './api-user';
import Grid from '@material-ui/core/Grid';



interface UserValues {
  firstName: string;
  lastName: string;
  companyName: string;
  username: string;
  email: string;
  userId: string,
  open: boolean;
  error: string;
  redirectToProfile: boolean;
}

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
    color: theme.palette.primary.main, // Assuming protectedTitle is a primary color
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
    width: 160,
  },
  readOnlyField: {
    marginLeft: theme.spacing(1),
    marginRight: theme.spacing(1),
    width: 300,
    backgroundColor: theme.palette.background.default,
  },
}));

const EditProfile: React.FC = () => {
  const classes = useStyles();
  const { userId } = useParams<{ userId: string }>();
  const userID1 = userId ? userId : '';
  const [values, setValues] = useState<UserValues>({
    firstName: '',
    lastName: '',
    companyName: '',
    username: '',
    email: '',
    userId: '',
    open: false,
    error: '',
    redirectToProfile: false,
  });
  const jwt = auth.isAuthenticated();
  const token = jwt && typeof jwt !== 'boolean' ? jwt.token : '';
  const userID2 = jwt && typeof jwt !== 'boolean' ? jwt.user._id : '';
  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    read(
      {
        userId: userID1,
      },
      { t: token },
      signal
    ).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          firstName: data.firstName,
          lastName: data.lastName,
          companyName: data.companyName,
          username: data.username,
          email: data.email,
        });
      }
    });
    return function cleanup() {
      abortController.abort();
    };
  }, [userId]);

  const clickSubmit = () => {
    const user = {
      firstName: values.firstName || undefined,
      lastName: values.lastName || undefined,
      companyName: values.companyName || undefined,
    };
    update(
      {
        userId: userID1,
      },
      {
        t: token,
      },
      user
    ).then((data) => {
      if (data && data.error) {
        setValues({ ...values, error: data.error });
      } else {
        setValues({
          ...values,
          userId: userID1,
          redirectToProfile: true,
        });
      }
    });
  };

  const handleChange = (name: keyof UserValues) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [name]: event.target.value });
  };

  if (values.redirectToProfile) {
    return <Navigate to={'/user/' + values.userId} />;
  }

  return (
    <Card className={classes.card}>
      <CardContent>
        <Typography variant="h6" className={classes.title}>
          Edit Profile
        </Typography>
        <TextField
          id="firstName"
          label="First Name"
          className={classes.textField}
          value={values.firstName}
          onChange={handleChange('firstName')}
          margin="normal"
        />
        <br />
        <TextField
          id="lastName"
          label="Last Name"
          className={classes.textField}
          value={values.lastName}
          onChange={handleChange('lastName')}
          margin="normal"
        />
        <br />
        <TextField
          id="companyName"
          label="Company Name"
          className={classes.textField}
          value={values.companyName}
          onChange={handleChange('companyName')}
          margin="normal"
        />
        <br />
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
        <Grid container direction="column" spacing={2}>
          <Grid item>
            <Button
              color="primary"
              variant="contained"
              onClick={clickSubmit}
              style={{ width: '200px', margin: '3px' }}
              className={classes.submit}
            >
              Submit
            </Button>
          </Grid>
          <Grid item>
            <Link to={`/user/${userId}/updatepassword`}>
              <Button
                color="primary"
                variant="contained"
                style={{ width: '200px', margin: '3px' }}
                className={classes.submit}
              >
                Update Password
              </Button>
            </Link>
          </Grid>
        </Grid>
      </CardActions>
    </Card>
  );
};

export default EditProfile;

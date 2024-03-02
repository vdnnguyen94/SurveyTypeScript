import React, { useState } from 'react';
import { makeStyles, Card, CardContent, Typography, TextField, CardActions, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import { Link, useNavigate} from 'react-router-dom';
import PropTypes from 'prop-types';
import { create} from './api-user';

interface SignupProps {
  handleClose: () => void;
}

const useStyles = makeStyles((theme) => ({
  card: {
    maxWidth: 400,
    margin: '0 auto',
    marginTop: theme.spacing(3),
    padding: theme.spacing(2),
    textAlign: 'center',
  },
  textField: {
    width: '100%',
    marginBottom: theme.spacing(2),
  },
  error: {
    color: 'red',
  },
  submit: {
    margin: '0 auto',
    marginBottom: theme.spacing(2),
  },
  title: {
    fontSize: 18,
  },
}));

const Signup: React.FC<SignupProps> = ({  handleClose }) => {
  const classes = useStyles();
  const navigate = useNavigate(); // hook to handle navigation

  const [open, setOpen] = useState(false); // State to control dialog open/close
  const [values, setValues] = useState({
    firstName: '',
    lastName: '',
    companyName: '',
    email: '',
    username: '',
    password: '',
    passwordConfirmation: '',
    error: '',
  });

  const handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const validateForm = () => {
    if (!values.firstName || !values.lastName || !values.companyName || !values.email || !values.username || !values.password || !values.passwordConfirmation) {
      setValues({ ...values, error: 'All fields are required.' });
      return false;
    }

    if (values.password.length < 6) {
      setValues({ ...values, error: 'Password must be at least 6 characters long.' });
      return false;
    }

    if (values.password !== values.passwordConfirmation) {
      setValues({ ...values, error: 'Password Confirmation does not match.' });
      return false;
    }

    return true;
  };

  const clickSubmit = () => {
    if (!validateForm()) {
      return;
    }

    const user = {
      firstName: values.firstName,
      lastName: values.lastName,
      companyName: values.companyName,
      email: values.email,
      username: values.username,
      password: values.password,
      passwordConfirmation: values.passwordConfirmation,
    };

    // Check if email exists

    create(user).then((data) => {
        if (data.error) {
            setValues({ ...values, error: data.error });
          } else {
              setOpen(true);
          }});
  }
  // Dialog close handler
  const handleDialogClose = () => {
    setOpen(false);
    handleClose(); // Close signup form
    navigate('/signin'); // Navigate to signin page
  };
  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6" className={classes.title}>
            Sign Up
          </Typography>

          <TextField
            id="firstName"
            label="First Name"
            className={classes.textField}
            value={values.firstName}
            onChange={handleChange('firstName')}
            margin="normal"
          />
          <TextField
            id="lastName"
            label="Last Name"
            className={classes.textField}
            value={values.lastName}
            onChange={handleChange('lastName')}
            margin="normal"
          />
          <TextField
            id="companyName"
            label="Company Name"
            className={classes.textField}
            value={values.companyName}
            onChange={handleChange('companyName')}
            margin="normal"
          />
          <TextField
            id="email"
            label="Email"
            className={classes.textField}
            value={values.email}
            onChange={handleChange('email')}
            margin="normal"
          />
          <TextField
            id="username"
            label="username"
            className={classes.textField}
            value={values.username}
            onChange={handleChange('username')}
            margin="normal"
          />
          <TextField
            id="password"
            label="Password"
            className={classes.textField}
            value={values.password}
            onChange={handleChange('password')}
            type="password"
            margin="normal"
          />
          <TextField
            id="passwordConfirmation"
            label="Password Confirmation"
            className={classes.textField}
            value={values.passwordConfirmation}
            onChange={handleChange('passwordConfirmation')}
            type="password"
            margin="normal"
          />
          {values.error && (
            <Typography variant="body2" className={classes.error}>
              {values.error}
            </Typography>
          )}
        </CardContent>
        <CardActions>
          <Button color="primary" variant="contained" onClick={clickSubmit} className={classes.submit}>
            Submit
          </Button>
        </CardActions>
      </Card>

      <Dialog open={open} onClose={handleDialogClose}>
        <DialogTitle>New Account</DialogTitle>
        <DialogContent>
          <DialogContentText>
            New account successfully created.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Link to="/Signin">
            <Button color="primary" autoFocus variant="contained" onClick={handleDialogClose}>
              Sign In
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </div>
  );
};

Signup.propTypes = {
  handleClose: PropTypes.func.isRequired,
};

export default Signup;

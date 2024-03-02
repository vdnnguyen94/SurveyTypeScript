import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  Card,
  CardContent,
  Typography,
  TextField,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  FormControlLabel,
  RadioGroup,
  Radio
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import auth from '../lib/auth-helper';
import { create } from './api-survey';

const useStyles = makeStyles((theme) => ({
  card: {
    width: '55%',
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
  success: {
    color: 'green',
  },
  submit: {
    margin: '0 auto',
    marginBottom: theme.spacing(2),
  },
  title: {
    fontSize: 18,
  },
}));

const NewSurvey: React.FC = () => {
  const { userId } = useParams();
  const classes = useStyles();
  const jwt = auth.isAuthenticated();
  const token = jwt && typeof jwt !== 'boolean' ? jwt.token : '';
  const [values, setValues] = useState({
    name: '',
    expireDate: null as string | null,
    setExpireDate: false,
    error: '',
    message: '',
  });

  const [open, setOpen] = useState(false);

  const handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [name]: event.target.value });
  };

  const handleExpireDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, expireDate: event.target.value });
  };

  const handleSetExpireDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({
      ...values,
      setExpireDate: event.target.value === 'yes',
      expireDate: null, // Reset expireDate when user toggles the choice
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const validateForm = () => {
    if (!values.name) {
      setValues({ ...values, error: 'Survey name is required.' });
      return false;
    }

    if (values.setExpireDate && (!values.expireDate || new Date(values.expireDate).getTime() - new Date().getTime() < 3 * 24 * 60 * 60 * 1000)) {
      setValues({ ...values, error: 'Expiration date must be set and at least 3 days from now.' });
      return false;
    }

    return true;
  };

  const clickSubmit = () => {
    if (!validateForm()) {
      return;
    }

    let dateExpire: Date | undefined = undefined;

    if (values.setExpireDate && values.expireDate) {
      dateExpire = new Date(values.expireDate);
    }
  
    const survey = {
      name: values.name || undefined,
      dateExpire: dateExpire,
    };
    if(userId){
        create({ userId: userId }, { t: token }, survey).then((data) => {
            if (data.error) {
              setValues({ ...values, error: data.error, message: '' });
            } else {
              setValues({ ...values, error: '', message: data.message });
              setOpen(true);
            }
          });
    }

  };

  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          <Typography variant="h6" className={classes.title}>
            Create Survey
          </Typography>

          <TextField
            id="name"
            label="Survey Name"
            className={classes.textField}
            value={values.name}
            onChange={handleChange('name')}
            margin="normal"
          />

          <Typography>
            Would you like to set an expiration date for your survey?
            <RadioGroup
              aria-label="SetExpireDate"
              name="setExpireDate"
              value={values.setExpireDate ? 'yes' : 'no'}
              onChange={handleSetExpireDateChange}
            >
              <FormControlLabel value="yes" control={<Radio />} label="Yes" />
              <FormControlLabel value="no" control={<Radio />} label="No" />
            </RadioGroup>
          </Typography>

          {values.setExpireDate && (
            <Typography>
              Expire Date
              <TextField
                id="expireDate"
                type="date"
                className={classes.textField}
                value={values.expireDate || ''}
                onChange={handleExpireDateChange}
                margin="normal"
              />
            </Typography>
          )}
          {values.message && (
            <Typography variant="body2" className={classes.success}>
              {values.message}
            </Typography>
          )}
          {values.error && (
            <Typography variant="body2" className={classes.error}>
              {values.error}
            </Typography>
          )}
        </CardContent>
        <CardActions>
          <Button color="primary" variant="contained" onClick={clickSubmit} className={classes.submit}>
            Create Survey
          </Button>
        </CardActions>
      </Card>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>New Survey</DialogTitle>
        <DialogContent>
          <DialogContentText>New survey successfully created.</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Link to="/mysurveys">
            <Button color="primary" autoFocus variant="contained" onClick={handleClose}>
              Navigate to My Surveys
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default NewSurvey;

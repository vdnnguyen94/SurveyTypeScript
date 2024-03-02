import React, { useEffect, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@material-ui/core';
import { Link, useParams } from 'react-router-dom';
import auth from '../lib/auth-helper';
import {
  surveyByID,
  updateSurvey,
} from './api-survey';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      width: '40%',
      margin: '0 auto',
      marginTop: theme.spacing(3),
      padding: theme.spacing(2),
      textAlign: 'center',
    },
    title: {
      fontSize: 18,
      marginBottom: theme.spacing(2),
    },
    biggerText: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    errorText: {
      color: 'red',
      fontSize: 20,
      fontWeight: 'bold',
    },
    buttonContainer: {
      marginTop: theme.spacing(2),
    },
    button: {
      marginRight: theme.spacing(2),
    },
    textField: {
      marginTop: theme.spacing(2),
    },
  })
);

const EditSurvey: React.FC = () => {
  const classes = useStyles();
  const jwt = auth.isAuthenticated();
  const { surveyId } = useParams<{ surveyId: string }>();
  const token = jwt && typeof jwt !== 'boolean' ? jwt.token : '';
  const userID = jwt && typeof jwt !== 'boolean' ? jwt.user._id : '';
  const surveyID = surveyId ? surveyId : '';
  const [currentSurvey, setCurrentSurvey] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const [editMode, setEditMode] = useState<boolean>(false);
  const [editedSurvey, setEditedSurvey] = useState<any>({
    name: '',
    setExpireDate: false,
    expireDate: null,
  });

  const handleEditClick = () => {
    setEditMode(true);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditedSurvey({
      name: currentSurvey ? currentSurvey.name : '',
      setExpireDate: false,
      expireDate: currentSurvey ? currentSurvey.dateExpire : null,
    });
  };

  const handleSaveEdit = async () => {
    try {
      if (!validateEditedSurvey()) {
        return;
      }

      const result = await updateSurvey(
        { surveyId: surveyID },
        { t: token },
        {
          name: editedSurvey.name || undefined,
          dateExpire: editedSurvey.setExpireDate ? editedSurvey.expireDate : undefined,
        }
      );

      if (result.error) {
        setError(result.error);
      } else {
        setEditMode(false);
        fetchSurveyDetails();
      }
    } catch (error) {
      console.error('Error updating survey:', error);
      setError('Internal Server Error');
    }
  };

  const validateEditedSurvey = () => {
    if (!editedSurvey.name) {
      setError('Survey name is required.');
      return false;
    }

    if (
      editedSurvey.setExpireDate &&
      (!editedSurvey.expireDate || (new Date(editedSurvey.expireDate).getTime() - new Date().getTime()) < 7 * 24 * 60 * 60 * 1000)
    ) {
      setError('Expiration date must be set and at least 7 days from now.');
      return false;
    }

    return true;
  };

  const handleEditInputChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedSurvey({ ...editedSurvey, [name]: event.target.value });
  };

  const fetchSurveyDetails = async () => {
    try {

        const abortController = new AbortController();
        const surveyData = await surveyByID({ surveyId: surveyID });

        if (surveyData.error) {
            setError(surveyData.error);
        } else {
            setCurrentSurvey(surveyData);
            setEditedSurvey({
            name: surveyData.name,
            setExpireDate: !!surveyData.dateExpire,
            expireDate: surveyData.dateExpire || null,
            });
        }
    } catch (error) {
      console.error('Error in fetching survey details:', error);
      setError('Internal Server Error');
    }
  };

  useEffect(() => {
    fetchSurveyDetails();
  }, [surveyId]);

  return (
    <div>
      <Card className={classes.card}>
        <CardContent>
          {error ? (
            <Typography variant="h5" className={classes.errorText}>
              {error}
            </Typography>
          ) : currentSurvey ? (
            <>
              <Typography variant="h5" className={classes.title}>
                Survey Details
              </Typography>

              {editMode ? (
                <>
                  <TextField
                    id="edited-name"
                    label="Survey Name"
                    className={classes.textField}
                    value={editedSurvey.name}
                    onChange={handleEditInputChange('name')}
                    margin="normal"
                  />

                  <Typography>
                    Would you like to set a new expiration date for your survey?
                    <RadioGroup
                      aria-label="SetExpireDate"
                      name="setExpireDate"
                      value={editedSurvey.setExpireDate ? 'yes' : 'no'}
                      onChange={(event) =>
                        setEditedSurvey({ ...editedSurvey, setExpireDate: event.target.value === 'yes' })
                      }
                    >
                      <FormControlLabel value="yes" control={<Radio />} label="Yes" />
                      <FormControlLabel value="no" control={<Radio />} label="No" />
                    </RadioGroup>
                  </Typography>

                  {editedSurvey.setExpireDate && (
                    <Typography>
                      New Expire Date
                      <TextField
                        id="edited-expireDate"
                        type="date"
                        className={classes.textField}
                        value={editedSurvey.expireDate}
                        onChange={handleEditInputChange('expireDate')}
                        margin="normal"
                      />
                    </Typography>
                  )}

                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={handleSaveEdit}
                  >
                    Save
                  </Button>
                  <Button
                    variant="contained"
                    color="default"
                    className={classes.button}
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Typography className={classes.biggerText} color="primary">
                    {currentSurvey.name}
                  </Typography>

                  {currentSurvey.dateExpire && (
                    <Typography>
                      Expiration Date: {new Date(currentSurvey.dateExpire).toLocaleDateString()}
                    </Typography>
                  )}
                  {!currentSurvey.dateExpire && <Typography>NO EXPIRATION DATE</Typography>}

                  <Typography>Status: {currentSurvey.status}</Typography>
                  <Typography>
                    Owner: {currentSurvey.owner.firstName} {currentSurvey.owner.lastName} [
                    {currentSurvey.owner.username}]
                  </Typography>

                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    onClick={handleEditClick}
                  >
                    Edit Survey
                  </Button>
                </>
              )}

              {userID === currentSurvey.owner._id && (
                <div className={classes.buttonContainer}>
                  {/* ... (other buttons) */}
                </div>
              )}
            </>
          ) : (
            <Typography variant="h5" className={classes.title}>
              Loading...
            </Typography>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EditSurvey

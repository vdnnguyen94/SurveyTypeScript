import React, { useEffect, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
  Card, CardContent, Typography, TextField, Button, Dialog, DialogContent, DialogContentText, DialogActions, FormControl, InputLabel, Select, MenuItem,
} from '@material-ui/core';
import { Link, useParams } from 'react-router-dom';
import auth from '../lib/auth-helper';
import { createQuestion } from './api-question';
import { surveyByID } from '../survey/api-survey';

interface Survey {
  _id: string;
  name: string;
  owner: {
    _id: string;
  };
}

interface QuestionData {
  questionOrder?: number;
  questionType?: 'MC' | 'TF' | null;
  name?: string;
  answerNum?: number;
  possibleAnswers?: string[];
  surveyResults?: number[];
  surveyResult2?: string[];
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    card: {
      width: '70%',
      margin: '0 auto',
      marginTop: theme.spacing(3),
      padding: theme.spacing(2),
      textAlign: 'center',
    },
    cardContent: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    surveyCard: {
      marginBottom: theme.spacing(2),
      padding: theme.spacing(2),
      border: '1px solid #ccc',
    },
    biggerText: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    title: {
      fontSize: 18,
      marginBottom: theme.spacing(2),
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
      width: '60%',
      marginBottom: theme.spacing(2),
    },
    select: {
      width: '60%',
      marginBottom: theme.spacing(2),
    },
    formControl: {
      width: '60%',
      marginBottom: theme.spacing(2),
    },
  })
);

const NewQuestion: React.FC = () => {
  const classes = useStyles();
  const jwt = auth.isAuthenticated(); 
  const { surveyId } = useParams<{ surveyId: string }>();
  const surveyID = surveyId ? surveyId : '';
  const [error, setError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'MC' | 'TF' | null>(null);
  const [numberOfAnswers, setNumberOfAnswers] = useState<number>(2);
  const [currentSurvey, setCurrentSurvey] = useState<Survey | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  useEffect(() => {
    const abortController = new AbortController();
    const signal = abortController.signal;

    const fetchSurveyDetails = async () => {
      try {
        const surveyData = await surveyByID({ surveyId: surveyID });

        if (surveyData.error) {
          setError(surveyData.error);
        } else {
          setCurrentSurvey(surveyData);
        }
      } catch (error) {
        console.error('Error in fetching survey details:', error);
        setError('Internal Server Error');
      }
    };
    fetchSurveyDetails();

    return function cleanup() {
      abortController.abort();
    };
  }, [surveyId]);

  const handleTypeChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setSelectedType(event.target.value as 'MC' | 'TF');
  };

  const handleNumberOfAnswersChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    setNumberOfAnswers(event.target.value as number);
  };

  const handleCreateQuestion = async () => {
    try {
      let questionData: QuestionData = {
        questionType: selectedType,
        name: (document.getElementById('name') as HTMLInputElement).value,
      };
  
      if (selectedType === 'MC') {
        // If the question type is multiple choice, include answerNum and possibleAnswers
        questionData.answerNum = numberOfAnswers;
  
        const possibleAnswers: string[] = [];
        for (let i = 1; i <= numberOfAnswers; i++) {
          const possibleAnswer = (document.getElementById(`possibleAnswer${i}`) as HTMLInputElement).value;
          if (possibleAnswers.includes(possibleAnswer)) {
            setError('Each possibleAnswer must be unique. Duplicates are not allowed.');
            return;
          }
          possibleAnswers.push(possibleAnswer);
        }
  
        questionData.possibleAnswers = possibleAnswers;
      }
  
      if (typeof jwt === 'boolean' || !jwt.token) {
        // Handle case when user is not authenticated
        setError('User not authenticated');
        return;
      }
  
      createQuestion({ surveyId: surveyID }, { t: jwt.token }, questionData)
        .then((response) => {
          if (response.error) {
            setError(response.error);
          } else {
            console.log('Question created successfully');
            console.log(response);
            setOpen(true);
          }
        })
        .catch((error) => {
          console.error('Error creating question:', error);
          setError('Internal Server Error');
        });
    } catch (error) {
      console.error('Error creating question:', error);
      setError('Internal Server Error');
    }
  };

  const renderAnswerFields = () => {
    const answerFields: JSX.Element[] = [];
    for (let i = 1; i <= numberOfAnswers; i++) {
      answerFields.push(
        <TextField
          key={`possibleAnswer${i}`}
          id={`possibleAnswer${i}`}
          label={`Possible Answer ${i}`}
          className={classes.textField}
        />
      );
    }
    return answerFields;
  };

  if (typeof jwt !== 'boolean' && currentSurvey &&jwt.token && jwt.user._id === currentSurvey.owner._id) {
    return (
      <div>
        <Card className={classes.card}>
          <CardContent className={classes.cardContent}>
            <Typography variant="h5" className={classes.errorText}>
              {error}
            </Typography>
            <Typography> {currentSurvey.name}</Typography>
            <TextField id="name" label="What is the question?" className={classes.textField} />
            <div>
              <p>What type of question would you like to create?</p>
              <FormControl className={classes.formControl}>
                <InputLabel id="question-type-label">Question Type</InputLabel>
                <Select
                  labelId="question-type-label"
                  id="question-type"
                  value={selectedType}
                  onChange={handleTypeChange}
                >
                  <MenuItem value="MC">Multiple Choice</MenuItem>
                  <MenuItem value="TF">Text Field</MenuItem>
                </Select>
              </FormControl>
            </div>

            {selectedType === 'MC' && (
              <div>
                <FormControl className={classes.formControl}>
                  <InputLabel id="number-of-answers-label">Number of Answers</InputLabel>
                  <Select
                    labelId="number-of-answers-label"
                    id="number-of-answers"
                    value={numberOfAnswers}
                    onChange={handleNumberOfAnswersChange}
                  >
                    {[2, 3, 4, 5].map((number) => (
                      <MenuItem key={number} value={number}>
                        {number}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                {renderAnswerFields()}
              </div>
            )}
          </CardContent>
          <Button variant="contained" color="primary" onClick={handleCreateQuestion}>
            Create a Question
          </Button>
        </Card>
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogContent>
            <DialogContentText>Question is successfully created..!</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Link to={`/survey/${surveyId}`}>
              <Button color="primary" autoFocus variant="contained" onClick={() => setOpen(false)}>
                Go to Surveys
              </Button>
            </Link>
          </DialogActions>
        </Dialog>
      </div>
    );
  } else {
    return (
      <div>
        <Card className={classes.card}>
          <Typography variant="h4" style={{ color: 'red' }}>
            You are not the owner of this survey.
          </Typography>
        </Card>
      </div>
    );
  }
};

export default NewQuestion;

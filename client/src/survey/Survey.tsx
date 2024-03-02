import React, { useEffect, useState } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Card, CardContent, Typography, Button, TextField, Radio, RadioGroup, FormControlLabel } from '@material-ui/core';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@material-ui/core';
import { Link, useParams } from 'react-router-dom';
import auth from '../lib/auth-helper';
import { listSurveyQuestions } from '../question/api-question';
import { surveyByID } from './api-survey';
import { checkCompletedSurvey, updateSurveyResult } from '../surveysubmit/api-submit';

const useStyles = makeStyles((theme) =>
  createStyles({
    card: {
      width: '60%',
      margin: '0 auto',
      marginTop: theme.spacing(3),
      padding: theme.spacing(2),
      textAlign: 'center',
    },
    title: {
      fontSize: 18,
      marginBottom: theme.spacing(2),
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
    textField: {
        width: '100%',
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
    questionsContainer: {
      marginTop: theme.spacing(3),
    },
    questionCard: {
      marginTop: theme.spacing(2),
      padding: theme.spacing(2),
      border: '1px solid #ccc',
    },
    radioLabel: {
      display: 'block',
      marginBottom: theme.spacing(1),
    },
    radioGroup: {
      paddingLeft: 20,
    },
  })
);

const MySurveys: React.FC = () => {
  const classes = useStyles();
  const jwt = auth.isAuthenticated();
  const userID = jwt && typeof jwt !== 'boolean' ? jwt.user._id : '';
  const token = jwt && typeof jwt !== 'boolean' ? jwt.token : '';
  const { surveyId } = useParams<{ surveyId: string }>();
  const [currentSurvey, setCurrentSurvey] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [completedSurvey, setCompletedSurvey] = useState<string | null>(null);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string | number }>({});
  const [validationError, setValidationError] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleAnswerChange = (questionId: string, answer: string | number) => {
    setUserAnswers((prevAnswers) => {
      const updatedAnswers = { ...prevAnswers };
      const question = questions.find((q) => q._id === questionId);

      if (question) {
        if (question.questionType === 'MC') {
          updatedAnswers[questionId] = parseInt(answer as string);
        } else if (question.questionType === 'TF') {
          updatedAnswers[questionId] = answer;
        }
      }
      return updatedAnswers;
    });
  };

  const handleSubmit = () => {
    const totalQuestions = questions.length;
    const textFillQuestions = questions.filter((question) => question.questionType === 'TF');
    const textFillAnswers = Object.values(userAnswers).filter((answer) => answer !== null && answer !== '');
    const allTextFillAnswered = totalQuestions === textFillAnswers.length;

    const mcQuestions = questions.filter((question) => question.questionType === 'MC');
    const mcAnswers = Object.values(userAnswers).filter((answer) => answer !== null);
    const allMCAnswered = totalQuestions === mcAnswers.length;
    const finalCheck = totalQuestions === Object.keys(userAnswers).length;

    if (allTextFillAnswered && allMCAnswered && finalCheck && surveyId) {

      updateSurveyResult({ surveyId: surveyId }, { t: token }, userAnswers)
        .then((result) => {
          if (result.error) {
            setValidationError(result.error);
          } else {
            setOpen(true);
          }
        })
        .catch((error) => {
          console.error('Error updating survey results:', error);
          setValidationError('Error updating survey results. Please try again.');
        });
    } else {
      setValidationError('Validation Failed. Please Answer All Questions.');
    }
  };

  useEffect(() => {
    const abortController = new AbortController();


    const fetchSurveyDetails = async () => {
        
      try {
        if(surveyId)
        {
            const surveyData = await surveyByID({ surveyId: surveyId });
            if (surveyData.error) {
                setError(surveyData.error);
              } else {
                setCurrentSurvey(surveyData);
              }
        }
      } catch (error) {
        console.error('Error in fetching survey details:', error);
        setError('Internal Server Error');
      }
    };

    const fetchSurveyQuestions = async () => {
      try {
        if(surveyId)
        {
            const questionsData = await listSurveyQuestions({ surveyId: surveyId });
            if (questionsData.error) {
            setError(questionsData.error);
            } else {
            setQuestions(questionsData);
            }
        }
      } catch (error) {
        console.error('Error in fetching survey questions:', error);
        setError('Internal Server Error');
      }
    };

    const fetchCompletedSurvey = async () => {
      try {
        if (surveyId){
            const result = await checkCompletedSurvey({ surveyId: surveyId }, { t: token });
            if (result.error) {
            setError(result.error);
            } else {
            setCompletedSurvey(result.answer);
            }
        }
      } catch (error) {
        console.error('Error in fetching completed survey status:', error);
        setError('Internal Server Error');
      }
    };

    fetchSurveyDetails();
    fetchSurveyQuestions();
    fetchCompletedSurvey();

    return function cleanup() {
      abortController.abort();
    };
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
              <Typography className={classes.biggerText} color="primary" >
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
              {userID === currentSurvey.owner._id && (
                <div className={classes.buttonContainer}>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    component={Link}
                    style={{ width: '180px' }}
                    to={`/survey/${surveyId}/createquestion`}
                  >
                    Create Question
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    component={Link}
                    style={{ width: '180px' }}
                    to={`/survey/${surveyId}/edit`}
                  >
                    Edit Survey
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    className={classes.button}
                    component={Link}
                    style={{ width: '180px' }}
                    to={`/survey/${surveyId}/result`}
                  >
                    Result
                  </Button>
                </div>
              )}

              <div className={classes.questionsContainer}>
                <Typography variant="h5" className={classes.title}>
                  Survey Questions
                </Typography>
                {questions.length === 0 ? (
                  <Typography variant="h6">There are no questions in this survey.</Typography>
                ) : (
                  questions.map((question) => (
                    <Card key={question._id} className={classes.questionCard}>
                      {userID === currentSurvey.owner._id && (
                        <Button
                          variant="contained"
                          color="primary"
                          className={classes.button}
                          component={Link}
                          to={`/question/${surveyId}/${question._id}/edit`}
                        >
                          Edit Question
                        </Button>
                      )}
                      <Typography variant="subtitle1">
                        Question {question.questionOrder}: {question.name}
                      </Typography>
                      {question.questionType === 'MC' ? (
                      <RadioGroup>
                        {question.possibleAnswers.map((answer : any, index : any) => (
                            <FormControlLabel
                            key={index}
                            value={String(index)}
                            control={<Radio />}
                            label={answer}
                            onChange={(e) => handleAnswerChange(question._id, (e.target as any).value)}
                            />
                        ))}
                        </RadioGroup>
                      ) : (
                            <TextField
                            id={question._id}
                            label="Answer"
                            variant="outlined"
                            className={classes.textField}
                            onChange={(e) => handleAnswerChange(question._id, (e.target as any).value)}
                            />
                      )}
                    </Card>
                  ))
                )}

                {questions.length > 0 && (
                  <Typography variant="h5" style={{ color: 'blue' }}>
                    {completedSurvey === 'No' ? (
                      <Button
                        variant="contained"
                        color="primary"
                        style={{ margin: '20px', fontSize: '1.2rem', fontWeight: 'bold', width: '200px' }}
                        className={classes.button}
                        onClick={handleSubmit}
                      >
                        Submit
                      </Button>
                    ) : (
                      'You have already submitted the survey.'
                    )}
                  </Typography>
                )}
                {validationError && (
                  <Typography variant="h4" style={{ color: 'red' }}>
                    {validationError}
                  </Typography>
                )}
              </div>
            </>
          ) : (
            <Typography variant="h5" className={classes.title}>
              Loading...
            </Typography>
          )}
        </CardContent>
      </Card>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Survey</DialogTitle>
        <DialogContent>
          <DialogContentText>Thank you for completing the survey!!!</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Link to="/surveys">
            <Button color="primary" autoFocus variant="contained" onClick={handleClose}>
              Go to Surveys
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MySurveys;

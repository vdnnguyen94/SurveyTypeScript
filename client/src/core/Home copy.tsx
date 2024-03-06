import React, { useState, useEffect } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import toonieLogo from '../assets/images/toonieLogo.png';
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import auth from '../lib/auth-helper';
import { signin } from '../lib/api-auth';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import Typography from '@material-ui/core/Typography';

interface HomeProps {
  isUserSignedOut?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    marginTop: theme.spacing(5),
    position: 'relative',
  },
  media: {
    width: '100%',
    minHeight: 250,
    paddingTop: '56.25%',
    objectFit: 'cover',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginTop: theme.spacing(2),
  },
  button: {
    margin: theme.spacing(1),
  },

}));

const Home: React.FC<HomeProps> = ({ isUserSignedOut }) => {
  const classes = useStyles();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');

  useEffect(() => {
    const signInWithDefaultAccounts = async () => {
      const testAccounts = [
        { username: 'test1@survey.com', password: 'survey123' },
        { username: 'test2@survey.com', password: 'survey123' },
        { username: 'test3@survey.com', password: 'survey123' }
      ];

      if (!auth.isAuthenticated()) {
        for (const account of testAccounts) {
          try {
            const response = await signin(account);
            if (!response.error) {
              auth.authenticate(response, () => {});
              setIsLoggedIn(true);
              setUsername(account.username);
              setDialogOpen(true);
              break;
            }
          } catch (error) {
            console.error('Error logging in:', error);
          }
        }
      }
    };

    signInWithDefaultAccounts();
  }, []);

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  return (
    <div>
      <Card className={classes.card}>
        <CardMedia
          className={classes.media}
          image={toonieLogo}
          title="Toonie Solution Logo"
          onError={(e) => {
            console.error('Error loading image:', e);
          }}
        />
        <CardContent>
          <div className={classes.buttonContainer}>
            <Link to="/signup">
              <Button variant="contained" color="primary" className={classes.button}>
                Sign Up
              </Button>
            </Link>
            <Link to="/signin">
              <Button variant="contained" color="primary" className={classes.button}>
                Sign In
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
      <Dialog open={dialogOpen} onClose={handleDialogClose}>
        <DialogTitle>Auto Log In Demo</DialogTitle>
        <DialogContent>
          <Typography>
            Demo Account: {username}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Link to="/surveys">
            <Button variant="contained" color="primary" onClick={handleDialogClose}>
              Go to Surveys
            </Button>
          </Link>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Home;

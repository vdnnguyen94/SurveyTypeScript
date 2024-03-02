import React, { useState, useEffect } from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import toonieLogo from '../assets/images/toonieLogo.png'; 
import { Link } from 'react-router-dom';
import Button from '@material-ui/core/Button';
import auth from '../lib/auth-helper'; 

interface HomeProps {
  isUserSignedOut?: boolean;
}

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    maxWidth: 600,
    margin: 'auto',
    marginTop: theme.spacing(5),
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
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // Initialize with false

  useEffect(() => {
    // Update the authentication status when isUserSignedOut changes
    setIsLoggedIn(!!auth.isAuthenticated()); // Convert JWT to boolean
  }, [isUserSignedOut]);



  return (
    <Card className={classes.card}>
      <CardMedia
        className={classes.media}
        image={toonieLogo} // Using the imported image directly
        title="Toonie Solution Logo"
        onError={(e) => {
          console.error('Error loading image:', e);
        }}
      />
      <CardContent>
        <div className={classes.buttonContainer}>
          {isLoggedIn ? (
            <Link to="/mysurveys" style={{ textDecoration: 'none' }}>
              <Button variant="contained" color="primary" className={classes.button}>
                MY SURVEY
              </Button>
            </Link>
          ) : (
            <>
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
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default Home;

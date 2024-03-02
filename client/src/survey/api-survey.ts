interface SurveyDocument  {
  name: string;
  owner: string;
  dateExpire?: Date;
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED';
}

const create = async (params: { userId: string }, credentials: { t: string }, survey: Partial<SurveyDocument>) => {
  try {
    if (!params.userId) {
      return { error: "Missing userID"};
    }
    // Survey Name exist or not
    if (survey.name && survey.name.length < 4) {
      return { error: 'Survey name must be at least 4 characters long.' };
    }
    // validate date, cannot create a survey expire within 3 days
    if (survey.dateExpire)
    {
        if (survey.dateExpire && (new Date(survey.dateExpire).getTime() - new Date().getTime()) < 3 * 24 * 60 * 60 * 1000) {
        return { error: 'Survey expiration date must be at least 3 days from now.' };
      }
    }

    // create survey copy from prof shop
    let response = await fetch('/api/surveys/by/' + params.userId, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t 
      },
      body: JSON.stringify(survey),
    });
    const data = await response.json();
    if (response.ok) {
      return { message: data.message };
    } else {
      return { error: data.error };
    }
  } catch (err) {
    console.log(err);
    return { error: err };
  }
};

const listAllSurveys = async (credentials: { t: string }) => {
  try {
    let response = await fetch('/api/surveys', {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + credentials.t,
      },
    });
    const data = await response.json();

    if (response.ok) {
      return data; // Return the list of surveys
    } else {
      return { error: data.error };
    }
  } catch (err) {
    console.log(err);
    return { error: err };
  }
};

const listMySurveys = async (params: { userId: string }, credentials: { t: string }) => {
  try {
    let response = await fetch('/api/surveys/by/'+params.userId, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
    })
    return response.json()
  }catch(err){
    console.log(err)
  }
};


const surveyByID = async (params: { surveyId: string }) => {
  try {
    let response = await fetch('/api/surveys/' + params.surveyId, {
      method: 'GET',
    })
    return response.json()
  }catch(err) {
    console.log(err)
  }
};

const updateSurvey = async (params: { surveyId: string }, credentials: { t: string }, survey: Partial<SurveyDocument>) => {
  try {
    let response = await fetch(`/api/surveys/${params.surveyId}`, {
      method: 'POST', // Assuming you are using POST to handle updates, you can change it to PUT if needed
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + credentials.t 
      },
      body: JSON.stringify(survey),
    });

    const data = await response.json();

    if (response.ok) {
      return { message: data.message };
    } else {
      return { error: data.error };
    }
  } catch (err) {
    console.log(err);
    return { error: err };
  }
};

const activateSurvey = async (params: { surveyId: string }, credentials: { t: string }) => {
  try {
    let response = await fetch(`/api/surveys/${params.surveyId}/activate`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
    });

    const data = await response.json();

    if (response.ok) {
      return { message: data.message };
    } else {
      return { error: data.error };
    }
  } catch (err) {
    console.log(err);
    return { error: err };
  }
};

const inactivateSurvey = async (params: { surveyId: string }, credentials: { t: string }) => {
  try {
    let response = await fetch(`/api/surveys/${params.surveyId}/inactivate`, {
      method: 'PUT',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
    });

    const data = await response.json();

    if (response.ok) {
      return { message: data.message };
    } else {
      return { error: data.error };
    }
  } catch (err) {
    console.log(err);
    return { error: err };
  }
};

const removeSurvey = async (params: { surveyId: string }, credentials: { t: string }) => {
  try {
    let response = await fetch(`/api/surveys/${params.surveyId}`, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': 'Bearer ' + credentials.t
      }
    });

    const data = await response.json();

    if (response.ok) {
      return { message: data.message };
    } else {
      return { error: data.error };
    }
  } catch (err) {
    console.log(err);
    return { error: err };
  }
};

export {
  create,
  listAllSurveys,
  listMySurveys,
  surveyByID,
  updateSurvey,
  activateSurvey,
  inactivateSurvey,
  removeSurvey,
};

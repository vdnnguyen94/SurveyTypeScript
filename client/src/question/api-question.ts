interface Question {
    questionOrder?: number;
    questionType?: 'MC' | 'TF'|null;
    name?: string;
    answerNum?: number;
    possibleAnswers?: string[];
    surveyResults?: number[];
    surveyResult2?: string[];
}
  
  interface Credentials {
    t: string;
  }
  
  interface UpdateQuestionParams {
    surveyId: string;
    questionId: string;
  }
  
  interface UpdateMCQuestionParams {
    questionId: string;
  }
  
  const createQuestion = async (params: { surveyId: string }, credentials: Credentials, question: Question): Promise<any> => {
    try {
      const response = await fetch(`/api/surveys/questions/${params.surveyId}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t 
        },
        body: JSON.stringify(question),
      });
  
      const data = await response.json();
      
      if (response.ok) {
        return data;
      } else {
        return { error: data.error };
      }
    } catch (err) {
      console.log(err);
      return { error: 'Internal Server Error' };
    }
  };
  
  const listSurveyQuestions = async (params: { surveyId: string }): Promise<any> => {
    try {
      const response = await fetch(`/api/surveys/questions/${params.surveyId}`, {
        method: 'GET'
      });
  
      const questions = await response.json();
      
      if (response.ok) {
        return questions;
      } else {
        return { error: questions.error };
      }
    } catch (err) {
      console.log(err);
      return { error: 'Internal Server Error' };
    }
  };
  
  const questionByID = async (params: { questionId: string }, signal?: AbortSignal): Promise<any> => {
    try {
      if(!params.questionId){
        return { error: 'Missing' };
      }
      const response = await fetch(`/api/question/${params.questionId}/get` , {
        method: 'GET',
        signal: signal
      });
      return response.json();
    } catch(err) {
      console.log(err);
      return { error: 'Internal Server Error' };
    }
  };
  
  const updateQuestion = async (params: UpdateQuestionParams, credentials: Credentials, question: Question): Promise<any> => {
    try {
      const response = await fetch(`/api/question/${params.surveyId}/${params.questionId}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t 
        },
        body: JSON.stringify(question),
      });
  
      const data = await response.json();
      
      if (response.ok) {
        return data;
      } else {
        return { error: data.error };
      }
    } catch (err) {
      console.log(err);
      return { error: 'Internal Server Error' };
    }
  };
  
  const updateMCQuestion = async (params: UpdateMCQuestionParams, credentials: Credentials, newPossibleAnswers: string[]): Promise<any> => {
    try {
      const response = await fetch(`/api/question/${params.questionId}/MC`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t 
        },
        body: JSON.stringify({ newPossibleAnswers }),
      });
  
      const data = await response.json();
      
      if (response.ok) {
        return data;
      } else {
        return { error: data.error };
      }
    } catch (err) {
      console.log(err);
      return { error: 'Internal Server Error' };
    }
  };
  
  const removeQuestion = async (params: UpdateQuestionParams, credentials: Credentials): Promise<any> => {
    try {
      const response = await fetch(`/api/question/${params.surveyId}/${params.questionId}`, {
        method: 'DELETE',
        headers: {
          'Accept': 'application/json',
          'Authorization': 'Bearer ' + credentials.t 
        },
      });
  
      const data = await response.json();
      
      if (response.ok) {
        return data;
      } else {
        return { error: data.error };
      }
    } catch (err) {
      console.log(err);
      return { error: 'Internal Server Error' };
    }
  };
  
  const updateQuestionName = async (params: UpdateQuestionParams, credentials: Credentials, name: string): Promise<any> => {
    try {
      const response = await fetch(`/api/question/${params.surveyId}/${params.questionId}/updateName`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + credentials.t 
        },
        body: JSON.stringify({ name }),
      });
  
      const data = await response.json();
      
      if (response.ok) {
        return data;
      } else {
        return { error: data.error };
      }
    } catch (err) {
      console.log(err);
      return { error: 'Internal Server Error' };
    }
  };
  
  export {
    createQuestion,
    listSurveyQuestions,
    questionByID,
    updateQuestion,
    updateMCQuestion,
    removeQuestion,
    updateQuestionName,
  };
  
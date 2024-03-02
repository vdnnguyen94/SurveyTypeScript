const checkCompletedSurvey = async (params: { surveyId: string }, credentials: { t: string }) => {
    try {
        let response = await fetch(`/api/surveys/${params.surveyId}/check`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            }
        });

        return await response.json();
    } catch (err) {
        console.log(err);
    }
};

const updateSurveyResult = async (params: { surveyId: string }, credentials: { t: string }, answeredQuestions: any) => {
    try {
        if (!credentials.t) {
            return { error: "Missing credentials.t" };
        }
        let response = await fetch(`/api/surveys/${params.surveyId}/submit`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            },

            body: JSON.stringify(answeredQuestions)
        });

        return await response.json();
    } catch (err) {
        console.log(err);
    }
};

const downloadSurveyResult = async (params: { surveyId: string }, credentials: { t: string }) => {
    try {
        let response = await fetch(`/api/surveys/${params.surveyId}/downloadresult`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': 'Bearer ' + credentials.t
            }
        });

        const blob = await response.blob();

        // Create a download link
        const downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = 'survey_results.json';

        // Trigger a click on the link to start the download
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);

    } catch (err) {
        console.log(err);
    }
};

export { checkCompletedSurvey, updateSurveyResult, downloadSurveyResult };

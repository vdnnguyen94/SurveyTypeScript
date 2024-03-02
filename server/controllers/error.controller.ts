import { Request, Response } from 'express';

const handleError = (req: Request, res: Response) => {
  // Implement your error handling logic here
};

const getErrorMessage = (errMsg: string) => {
  console.log(errMsg);
  // Implement your error message retrieval logic here
};

export default {
  handleError,
  getErrorMessage
};

//to use user in request
declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export { };
export interface RequestWithCookies extends Request {
  cookies: {
    [key: string]: string;
  };
}

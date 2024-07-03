import * as jwt from 'jsonwebtoken';

export class TokenService {
  static generateToken(email: string, name: string) {
    return jwt.sign({ email, name }, process.env.JWT_SECRET, {
      expiresIn: "6h",
    });
  }

  static verifyToken(token: string) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
          return reject(err);
        }
        return resolve(decoded);
      });
    });
  }
}

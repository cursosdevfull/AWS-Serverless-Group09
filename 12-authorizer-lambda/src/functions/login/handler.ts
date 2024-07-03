import { UserRepository } from '@functions/repositories/user.repository';
import { CryptService } from '@functions/services/crypt.service';
import { TokenService } from '@functions/services/token.service';
import { UserService } from '@functions/services/user.service';

const login = async (event) => {
  const { email, password } = JSON.parse(event.body);

  const repository: UserRepository = new UserService();
  const users = await repository.getUserByEmail(email);

  if (users.length === 0) {
    return {
      statusCode: 404,
      body: JSON.stringify({ message: "User not found" }),
    };
  }

  const user = users[0];

  const isPasswordValid = await CryptService.comparePassword(
    password,
    user.password.S
  );

  if (!isPasswordValid) {
    return {
      statusCode: 401,
      body: JSON.stringify({ message: "Invalid password" }),
    };
  }

  const token = await TokenService.generateToken(user.email.S, user.name.S);
  return {
    statusCode: 200,
    body: JSON.stringify({ token }),
  };
};

export const main = login;

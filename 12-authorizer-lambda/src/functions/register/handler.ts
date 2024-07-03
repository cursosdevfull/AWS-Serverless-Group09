import { UserRepository } from '@functions/repositories/user.repository';
import { CryptService } from '@functions/services/crypt.service';
import { UserService } from '@functions/services/user.service';

const register = async (event) => {
  let { name, email, password } = JSON.parse(event.body);
  password = await CryptService.hashPassword(password);

  const repository: UserRepository = new UserService();
  const users = await repository.getUserByEmail(email);
  await repository.createUser(email, password, name);

  if (users.length > 0) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "User duplicated" }),
    };
  }
  return {
    statusCode: 200,
    body: JSON.stringify({ message: "User created" }),
  };
};

export const main = register;

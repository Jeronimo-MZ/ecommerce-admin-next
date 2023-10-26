import { User } from "../../../models/user";

export interface CreateUserRepository {
  create(input: CreateUserRepository.Input): Promise<User>;
}

export namespace CreateUserRepository {
  export type Input = {
    name: string;
    email: string;
    password: string;
    address: string;
  };
}

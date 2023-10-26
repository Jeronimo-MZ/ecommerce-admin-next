import { User } from "../../../models/user";

export interface FindUserRepository {
  findOne(input: FindUserRepository.Input): Promise<User | null>;
}

export namespace FindUserRepository {
  export type Input = XOR<{ email: string }, { id: number }>;
}

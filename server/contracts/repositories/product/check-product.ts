export interface CheckProductRepository {
  checkBy(input: CheckProductRepository.Input): Promise<boolean>;
}

export namespace CheckProductRepository {
  export type Input = { storeId: number } & XOR<{ categoryId: number }, XOR<{ colorId: number }, { sizeId: number }>>;
}

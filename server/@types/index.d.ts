type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };
declare type XOR<T, U> = T | U extends object ? (Without<T, U> & U) | (Without<U, T> & T) : T | U;

type RequireAtLeastOne<T> = { [K in keyof T]-?: Required<Pick<T, K>> & Partial<Pick<T, Exclude<keyof T, K>>> }[keyof T];

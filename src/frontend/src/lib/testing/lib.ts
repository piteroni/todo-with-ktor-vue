import { isClass } from "@/shared/helpers";

export type Constructor<T = {}> = new (...args: any[]) => T;

export function createMock<T>(c: new () => T, entries: PartialDeep<T>): T
export function createMock<T>(o: T, entries: PartialDeep<T>): T

export function createMock<T extends object>(o: T | (new () => T), entries: PartialDeep<T>): T {
  if (isClass(o)) {
    return Object.assign(new (o as new () => T), entries)
  } else {
    return Object.assign(o as T, entries)
  }
}

type Primitive = null | undefined | string | number | boolean | symbol | bigint;

export type PartialDeep<T> = T extends Primitive
  ? Partial<T>
  : T extends Map<infer KeyType, infer ValueType>
  ? PartialMapDeep<KeyType, ValueType>
  : T extends Set<infer ItemType>
  ? PartialSetDeep<ItemType>
  : T extends ReadonlyMap<infer KeyType, infer ValueType>
  ? PartialReadonlyMapDeep<KeyType, ValueType>
  : T extends ReadonlySet<infer ItemType>
  ? PartialReadonlySetDeep<ItemType>
  : T extends (...args: any[]) => unknown // eslint-disable-line @typescript-eslint/no-explicit-any
  ? T | undefined
  : T extends object
  ? PartialObjectDeep<T>
  : unknown;

interface PartialMapDeep<KeyType, ValueType>
  extends Map<PartialDeep<KeyType>, PartialDeep<ValueType>> {}

interface PartialSetDeep<T> extends Set<PartialDeep<T>> {}

interface PartialReadonlyMapDeep<KeyType, ValueType>
  extends ReadonlyMap<PartialDeep<KeyType>, PartialDeep<ValueType>> {}

interface PartialReadonlySetDeep<T> extends ReadonlySet<PartialDeep<T>> {}

type PartialObjectDeep<ObjectType extends object> = {
  [KeyType in keyof SuppressObjectPrototypeOverrides<ObjectType>]?: PartialDeep<
    SuppressObjectPrototypeOverrides<ObjectType>[KeyType]
  >;
};

type SuppressObjectPrototypeOverrides<ObjectType> = Pick<
  ObjectType,
  Exclude<keyof ObjectType, keyof Object>
> &
  Pick<Object, Extract<keyof Object, keyof ObjectType>>;


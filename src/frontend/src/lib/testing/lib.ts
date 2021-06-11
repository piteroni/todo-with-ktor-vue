import { isClass } from "@/shared/helpers"

/* eslint-disable no-use-before-define */
/* eslint-disable @typescript-eslint/ban-types */

export function createMock<T extends object>(o: T | Constructor<T>, entries: PartialDeep<T>): T {
  if (isClass(o)) {
    return Object.assign(new (o as Constructor<T>)(), entries)
  } else {
    return Object.assign(o as T, entries)
  }
}

export type Constructor<T = {}> = new (...args: any[]) => T

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

type PartialMapDeep<KeyType, ValueType> = Map<PartialDeep<KeyType>, PartialDeep<ValueType>>

type PartialSetDeep<T> = Set<PartialDeep<T>>

type PartialReadonlyMapDeep<KeyType, ValueType> = ReadonlyMap<PartialDeep<KeyType>, PartialDeep<ValueType>>

type PartialReadonlySetDeep<T> = ReadonlySet<PartialDeep<T>>

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

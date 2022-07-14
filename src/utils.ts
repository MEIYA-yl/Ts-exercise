// MaybeNull：接受并返回一个包括null的联合类型，是的工具类具有处理方法调用和空值属性的能力。
type MaybeNull<NewType> = NewType | null;

function processFun<NewType>(input: MaybeNull<{ handler: () => {} }>) {
  input?.handler();
}

// MaybePromise

// MaybeArray
type MaybeArray<NewType> = NewType | NewType[];

function ensureAry<NewType>(input: MaybeArray<NewType>): NewType[] {
  return Array.isArray(input) ? input : [input];
}

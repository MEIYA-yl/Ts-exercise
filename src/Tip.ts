/**
 *  Any 类型的使用技巧：
 * 1. 如果是类型不兼容报错导致使用any，考虑使用类型断言代替；
 * 2. 如果是类型太过于复杂导致不想全部声明而使用了any，考虑将这一处的类型去断言成为需要的最简类型。例如将：`foo.bar.baz()` 就可以将foo断言为一个具有bar方法的类型；
 * 3. 未知类型合理的使用是unknown类型的变量；
 */

// Tip 如何获取枚举的所有值或者所有的键 ？
// 枚举也是对象，因此使用 Obejct.keys/values 就行，类型层面的话，可以type K = keyof typeof UserType 拿到枚举Key的联合类型，但是值类型的话就不行了，type V = UserType[keyof UserType] 会拿到枚举所有的属性与方法的类型（包括内置方法的）

// | 联合取并集，& 交叉取交集

// Tip declare 声明的结构不在运行时中，用来定义全局变量、全局函数、全局命名空间、js modules、class等。
// declare global 为全局对象window增加的新属性。
declare global {
  interface Window {
    mesage: string;
  }
}

// Tip override 关键字，用来确保在作为派生类中尝试覆盖的方法一定在基类中存在；
class Base {
  printWithLove() {}
  print() {}
}

class Derived extends Base {
  override print() {
    // 若 print 函数不存在 会因为基类中不存在改写的方法，TS 会进行错误提示
  }
}

// Tip abstract 声明抽象类。描述了一个类中应该有哪些成员（属性、方法），一个抽象方法描述了这一方法在实际实现中的结构。
abstract class AbsFun {
  // 抽象类使用 abstract 进行声明
  static t: string;
  constructor() {}
  abstract absProps: unknown[]; // 抽象类成员同样需要通过 abstract 进行声明
  abstract get absGetter(): string;
}

class Foo implements AbsFun {
  // 通过 implements 来实现抽象类，且必须完全实现这个抽象类中的所有成员。但无法声明静态的抽象成员。
  absProps: string[] = ["asdfasf"];

  get absGetter() {
    return "adsfasfs";
  }

  absMethod(name: string) {
    return name;
  }
}

// Tip 类型断言就是将变量的已有类型更改为新指定类型（指鹿为马）
function t(union: string | number) {
  if ((union as string).includes("asdf")) {
  }
  if ((union as number).toFixed() === "1321") {
  }
}
// 双重断言：防止在断言的过程中无法过渡导致报错，可以使用双重断言进行过渡。
const str: string = "asdfda";
`(str as { handler: () => {} }).hanlder()`; // TS-err: 从 n 到 m 类型的断言可能是错误的

// 通过 any | unknonwn 进行过渡
(str as unknown as { handler: () => {} }).handler();

// 非空断言，语法 ! （剔除 null 和 undefined 类型）
// Tip 非空断言和可选链：非空断言的运行仍然会保持调用链，因此在执行时可能会报错；可选链在某一部分收到了undefined 或 null 时会短路，不再发生后面的调用；
declare const Fn: {
  func?: () => {
    prop?: number | null;
  };
};

Fn.func!().prop?.toFixed();
// 非空段言是类型断言的简写，他等同于
(
  (
    Fn.func as () => {
      prop?: number;
    }
  )().prop as number
).toFixed();

// Tip 通过类型断言，可以在保留类型提示的前提下，不完整的实现类型结构。
interface IStruct {
  foo: string;
  bar: {
    barPropA: string;
    barPropB: number;
    barMethod: () => void;
    baz: {
      handler: () => Promise<void>;
    };
  };
}

const obj = <IStruct>{
  bar: {},
  // foo: 134, // 当程序中存在错误的实现时，依旧可以提供报错信息
};

// Tip 工具类型：类型别名接受泛型之后就成为了工具类型
type maybeNull<NewType> = NewType | null; // 联合类型中的 null 确保了处理可能为空值的属性和方法的调用

// 在使用工具类型来做类型标注 通常是再度声明一个新的类型别名
type FactoryWidthBool = maybeNull<boolean>;
const f: FactoryWidthBool = true;
// 处理方法调用
function method(input: maybeNull<{ handler: () => {} }>) {
  input?.handler();
}

// Tip 索引类型
// 索引类型包括三个部分：索引签名类型（声明）、索引类型查询（读取）、索引类型访问（读取）

interface AllStringTypes {
  [key: string]: string; // 导致只能声明字符串类型的键
} // 键值一致的类型结构

type propT1 = AllStringTypes["zhangsan"];
type propT2 = AllStringTypes[1234]; // js 中会将数字索引访问转换为字符串索引访问

const objTypes: AllStringTypes = {
  name: "zhangsan",
  22: "age",
  [Symbol("sym")]: "symbol",
  // 13: 145, // 具体类型和索引类型并存时，具体类型需要和索引类型保持一致
};

// Tip 索引类型重构js代码场景：为内部属性较多的对象声明一个any的索引类型签名
interface AnyTypeHere {
  [key: string]: any; // 通过any 以此来暂时支持对类型未明确属性的访问
}

// Tip 索引类型查询
type fooKeys = keyof any; // keyof 的产物必定是一个联合类型

// 模拟从 键名到联合类型 的过程
interface Foo {
  lisi: "lisi";
  22: 22;
}
// type Fookeys = Object.keys(Foo).join('|')

// Tip 索引类型访问
// 索引类型访问的本质：通过键的字面量类型访问这个键对应的键值类型
type PropTypeUnion = IStruct[keyof IStruct];

// Tip 映射类型 in：类型编程的第一步
type Stringify<T> = {
  [k in keyof T]: string;
}; // 基于键名映射到键值类型

// 小拓展：通过映射的方式拿到键对应的值类型
type Clone<T> = {
  [k in keyof T]: T[k]; // key in object 的方式来判断 key 是否存在于 object 或其原型链上
};

// Tip 类型的安全保障：类型查询操作符 - typeof
const func = (input: string): number => {
  return input.length;
};

type FuncReturnType = ReturnType<typeof func>; // 会返回一个函数类型中返回值的类型
// 类型查询操作符后不允许使用 ‘表达式’ ，不用担心与JS中的定义相冲突。
// let isValid: typeof func('asdf')

// Tip 类型守卫：类型的控值流分析
// Ts 的类型控制流不能做到跨函数上下文进行类型的信息收集。
function isString(input: unknown): input is string {
  // is + 预期类型
  // 如果函数返回值符合预期类型，那么 is 关键字前这个入参的类型，就会被这个类型守卫调用方后续的类型控制流分析收集到。
  return typeof input === "string";
} // isString 被称为类型守卫

function foo(input: string | number) {
  if (isString(input)) {
    // 类型守卫函数中 不会对判断逻辑和实际逻辑的关联进行检查
    input.replace("linbudu", "linbudu599");
  }
  if (typeof input === "number") {
  }
  // ...
}
// foo(1234);

// 常用的两个守卫
export type Falsy = false | "" | 0 | null | undefined;
const isFalsy = (val: unknown): val is Falsy => !val;

export type Primitive = string | number | boolean | undefined; // 不包括不常用的 symbol 和 bigint
const isPrimitive = (val: unknown): val is Primitive =>
  ["string", "number", "boolean", "undefined"].includes(typeof val);

// Tip 基于 in 与 instanceof 的类型保护
class FunBase {}

class BarBase {}

class Fun extends FunBase {
  funOnly() {}
}
class Bar extends BarBase {
  barOnly() {}
}

function handle(input: Fun | Bar) {
  if (input instanceof FunBase) {
    // 通过 instanceof 进行类型保护的理念，可以认为它在JS中的语法概念
    input.funOnly();
  } else {
    input.barOnly();
  }
}

const fun = new Fun();
handle(fun);

// 类似的 我们在使用 in 操作符时也是类似。
// in 它更多的是解决 typeof 不能在处理不同接口时遇到的同名属性的问题。

interface Foo {
  kind: "foo";
  fooOnly: number; // 可辨识属性
}

interface Far {
  kind: "bar";
  farOnly: number; // 可辨识属性
}

function handle1(input: Foo | Far) {
  if (input.kind === "foo") {
    input.fooOnly;
  } else if (input.farOnly in input) {
    input.farOnly;
  }
}

// Tip assert 类型断言守卫
// 通过断言的值类型不满足目标类型，那么在断言之后的代码就不会被执行。
// 相反，如果断言通过，不管最开始是何类型，断言后的代码中就一定都是符合断言类型的类型。

function assert(condition: any, msg?: string): asserts condition {
  if (!condition) {
    throw new Error("msg");
  }
} // assert 方法签名：将 condition 所对应的类型作为类型层面判断的依据。

// 通过 is 类型守卫的结合，使类型守卫的能力更加健全。
let name: any = "zhangsan";
// const a = typeof name
function assertIsNumber(val: any): asserts val is number {
  if (typeof val !== "number") {
    throw new Error("Not a number!");
  }
}

assertIsNumber(name);

// number 类型！
name.toFixed();

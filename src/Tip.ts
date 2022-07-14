/**
 *  Any 类型的使用技巧：
 * 1. 如果是类型不兼容报错导致使用any，考虑使用类型断言代替；
 * 2. 如果是类型太过于复杂导致不想全部声明而使用了any，考虑将这一处的类型去断言成为需要的最简类型。例如将：`foo.bar.baz()` 就可以将foo断言为一个具有bar方法的类型；
 * 3. 未知类型合理的使用是unknown类型的变量；
 */

// | 联合取并集，& 交叉取交集

// declare 声明的结构不在运行时中。

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
  [k in keyof T]: T[k];
};

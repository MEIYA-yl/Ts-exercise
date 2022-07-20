> ?.、??、!、!.、\_、\*\* 符号的含义

1. ?.可选链遇到 null 和 undefined 可以立即停止表达式的运行。
2. ??空值合并运算符当左侧操作数为 null 或 undefined 时，其返回右侧的操作数，否则返回左侧的操作数。
3. !非空断言运算符 x！将从 x 值域中排出 null 和 undefined。
4. !.在变量名后添加，可以断言排除 undefined 和 null
5. \_数字分隔符分隔符不会改变数字字面量的值，是人更容易读懂数字。例如 1_101_123。
6. \*\*求幂

> keyof 和 typeof 关键字的作用

1. keyof 索引类型查询操作符，获取索引类型的属性名，构成联合类型；
2. typeof 获取一个变量或对象的类型；

> 常见内置方法作用

1. Exclude<T, U>从 T 中排出可以分配给 U 的元素.
2. Omit<T, K>忽略 T 中的某些属性.
3. Merge<O1, O2>将两个对象的属性合并.
4. Compute<A & B>将交叉类型合并.
5. Intersection<T, U>取 T 的属性，此属性同样存在于 U.
6. Overwrite<T, U>用 U 的属性覆盖 T 的相同属性.

> 概念：抗变、双变、协变、和逆变

1. 协变（Covariant），ts 进行对象的兼容性转变是协变，子类->父类（√），父类->子类（×）
2. 逆变（Contravariant），禁用 strictFunctionTypes 编译，函数参数类型都是逆变的，父类 <= 子类（×）。子类 <= 父类（√）。
3. 双向协变（Bivariant），函数参数的类型默认是双向协变的。父类 <= 子类（√）。子类 <= 父类（√）。

> implements 与 extends 的区别

1. extends 子类会继承父类的所有属性和方法
2. implements 使用该关键字的类将需要实现的需要实现的类的所有属性和方法。

> 枚举和 object 的区别

1.  枚举可以通过枚举的名称，获取枚举的值，也可以通过枚举值获取枚举的名称
2.  object 只能通过 key 获取 value
3.  数字枚举在不置顶初始值的情况下，枚举值会从 0 开始递增
4.  虽然在运行时，枚举是一个真实存在的对象，但是使用 keyof 时的行为却和普通对象不一致，必须使用 keyof typeof 才可以获取枚举的所有属性名。

> never 和 void 的区别

1. never 表示永远不存在的类型，比如一个函数总是排出错误，而没有返回值。或者一个函数内部有死循环，永远不会有返回值。韩式的返回值就是 never 类型。
2. void 没有显式的返回值的函数的返回值类型为 void，如果一个变量为 void 类型，只能赋予 undefined 或 null。

> 如何在 window 扩展类型

```ts
declare global {
  interface Window {
    myCustomFn: () => void;
  }
}
```

> 实现类型内置高级用法

```ts
Record<K, V>
type Key = 'a' | 'b' | 'c';
const a: Record<Key, string> = {
a: 'a',
b: 'b',
c: 'c'
}

type Record<K extends number | string | symbol, V> {
[Key in K]: V
}
Eclude<T, K>
type Foo = 'a' | 'b' | 'c';
type A = Exclude<Foo, 'a'>; // 'b' | 'c'

type Exclude<T, K> = T extens K ? never : T;
Extract<T, U>
type Key = 'a' | 'b' | 'c';
type A = Extract<Key, 'a'>; // 'a'

type Extract<T, U> = T extends U ? T : never;
Omit<T, K>
type Keys = {
a: string;
b: number;
c: boolean;
}
type A = Keys<Keys, 'a' | 'b'>; // {c: boolean}

type Omit<T, K extends number | string | symbol> = {
[Key in Exclude<keyof T, K>]: T[Key]
}
NonNullable<T>
type Foo = 'a' | 'b' | null | undefined;
type A = NonNullable<Foo>; 'a' | 'b'

type NonNullable<T> = T extends null | undefined ? never : T;
Partial<T>;
```

> 将属性全部变为可选属性

```ts
type Foo = {
  a: string;
  b: number;
  c: boolean;
};
const a: Partial<Foo> = {};
const b: Partial<Foo> = { b: 12 };

type Patial<T> = {
  [K in keyof T]?: T[K];
};
Required < T > 把属性全部变为必须属性;

type Foo = {
  a?: string;
  b?: number;
  c: boolean;
};
const a: Required<Foo> = { a: "qwe" }; // Error

const b: Required<Foo> = { a: "23", b: 1, c: false }; // Ok

type Required<T> = {
  [K in keyof T]-?: T[K];
};
```

> ts 文件可以直接在浏览器中运行吗？

1. 没有使用 ts 语法的 ts 文件，可以直接在新版本的谷歌浏览器中运行了 使用 ts 语法，如变量变量类型声明等语法，必须编译成 js 文件后，使用 js 文件运行

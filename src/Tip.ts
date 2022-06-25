/**
 *  Any 类型的使用技巧：
 * 1. 如果是类型不兼容报错导致使用any，考虑使用类型断言代替；
 * 2. 如果是类型太过于复杂导致不想全部声明而使用了any，考虑将这一处的类型去断言成为需要的最简类型。例如将：`foo.bar.baz()` 就可以将foo断言为一个具有bar方法的类型；
 * 3. 未知类型合理的使用是unknown类型的变量；
 */

// Tip 类型断言就是将变量的已有类型更改为新指定类型（指鹿为马）
function t(union: string | number) {
  if ((union as string).includes("asdf")) {
  }
  if ((union as number).toFixed() === "1321") {
  }
}
// 双重断言
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

// Tip

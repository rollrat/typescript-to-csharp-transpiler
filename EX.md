# Example of TS

## Variable Numbering

```js
// @ts-ignore
var a;
a = 4;
a = "qwer";
```

this code will be transpiled below.

```cs
int a;
a = 4;
string a1 = "qwer";
```

### Variable Numbering on Callback

Assume that the variable is called in the closure of the callback as follows.

```js
var a;
a = 4;
setTimeout(() => {
  console.log(a);
});
a = "asdf";
```

The above example has an ambiguous syntax because of the lowest expression.

In the event loop of node or browser, setTimeout can be deferred because the callback queue is executed after the call stack is executed, that is, after one or more methods are executed.
Let's look at the following example.

```js
var a;
a = 4;
setTimeout(() => {
  console.log(a);
});
for (var i = 0; i < 10000; i++) console.log(a);
a = "asdf";
```

This example shows that `asdf` is printed after all `4` are printed.
Therefore, the division with callback can be done by hoisting the last allocated variable.

Let's check this example

```js
class A {
  private a;

  dog() { this.a = 4; }
  cat() { this.a = 'asdf'; }
}

const k = new A();

onClickA = () => { k.dog(); }
onClickB = () => { k.cat(); }

// ... If onClickA event received

setTimeout(() => { console.log(k.a); }, 10000);
```

In this example, there may be a number of cases as follows.

```
onClickA -> setTimeout -> onClickB
onClickA -> onClickB -> setTimeout
setTimeout -> onClicka -> onClickB
```

### Variable Numbering for Class

```js
class A {
  a = 5;
}
const b = new A();
b.a = "asdf";
```

---

## Etc

...

```cs
class foo_value {
  object boxedStorage;
  union { int i; float f; char c; long l; } unboxedStorage;
}
```

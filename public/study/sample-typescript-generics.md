# TypeScript ジェネリクスを深掘りする

> サンプル記事。学習・深掘りした内容を記録します（`public/study/<id>.md`）。

## 学んだこと

ジェネリクスは「型を引数として受け取る」仕組み。再利用性と型安全性を両立できる。

```ts
function identity<T>(value: T): T {
  return value;
}

const n = identity<number>(42);   // n: number
const s = identity("hello");      // 推論で s: string
```

## つまずいたポイント

- `extends` による制約: `<T extends { id: string }>` のように、型引数に最低限の形を要求できる
- デフォルト型引数: `<T = string>` で省略時の型を指定できる

## まとめ

| 概念 | 役割 |
|---|---|
| 型引数 `<T>` | 呼び出し側で型を決められる |
| 制約 `extends` | 型引数の形を限定する |
| 既定型 `= ...` | 省略時のフォールバック |

学びを記録に残すことで、後から検索・復習しやすくなる。

# 1日1題：XSS（クロスサイトスクリプティング）入門

> サンプル記事。1日1題形式でセキュリティの基礎を解説します。

## 今日の問題

次のコードにはどんな脆弱性があるでしょうか？

```js
document.getElementById("out").innerHTML = location.hash.slice(1);
```

## 解説

URL のフラグメント（`#` 以降）をそのまま `innerHTML` に挿入しているため、
`#<img src=x onerror=alert(1)>` のような入力で **DOM-based XSS** が成立します。

## 対策

- `innerHTML` ではなく `textContent` を使う
- どうしても HTML を挿入する場合は **サニタイズ**（DOMPurify など）を通す

```js
// ✅ 安全
document.getElementById("out").textContent = location.hash.slice(1);
```

## ポイント

| 観点 | 内容 |
|---|---|
| 分類 | DOM-based XSS |
| 原因 | 信頼できない入力を HTML として解釈 |
| 防御 | 出力エンコード / サニタイズ |

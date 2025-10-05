# 第4章：画像処理

## 画像処理タスクの種類

Transformers.jsは様々な画像処理タスクに対応しています：

- **画像分類**: 画像が何であるかを分類
- **物体検出**: 画像内の物体を検出し、位置を特定
- **セグメンテーション**: 画像をピクセル単位で分類
- **画像キャプション**: 画像の内容を文章で説明

## 物体検出（Object Detection）

このチュートリアルでは、物体検出を実装します。物体検出は：
1. 画像内の物体を識別
2. それぞれの物体の位置（バウンディングボックス）を特定
3. 信頼度スコアを提供

## このチュートリアルで学ぶこと

- 画像ファイルのアップロードと処理
- Object Detectionパイプラインの使用
- バウンディングボックスの描画
- 検出結果の視覚化

### デモ
[index.html](./index.html) - 画像をアップロードして物体を検出してみましょう

## コード解説

### 1. Object Detectionパイプラインの作成

```javascript
detector = await pipeline('object-detection', 'Xenova/detr-resnet-50');
```

**パラメータ:**
- **第1引数**: タスクタイプ（`'object-detection'`）
- **第2引数**: モデル名（DETR: DEtection TRansformer）

**DETRモデルとは？**
Transformerアーキテクチャを使った最新の物体検出モデルです。

### 2. 画像の読み込み

```javascript
const reader = new FileReader();
reader.onload = (e) => {
    const img = new Image();
    img.src = e.target.result;
};
reader.readAsDataURL(file);
```

ファイルをData URLとして読み込み、画像オブジェクトを作成します。

### 3. 物体検出の実行

```javascript
const result = await detector(image.src, {
    threshold: 0.3,      // 信頼度の閾値（0〜1）
    percentage: true     // 座標をパーセンテージで返す
});
```

**オプションパラメータ:**
- `threshold`: この値以下のスコアの検出結果を除外
- `percentage`: `true`の場合、座標が0〜100%で返される

### 4. 検出結果の構造

```javascript
[
  {
    label: "person",              // 検出された物体のラベル
    score: 0.9876,               // 信頼度スコア
    box: {
      xmin: 10.5,                // 左上X座標（%）
      ymin: 20.3,                // 左上Y座標（%）
      xmax: 45.2,                // 右下X座標（%）
      ymax: 80.1                 // 右下Y座標（%）
    }
  },
  // ... 他の検出結果
]
```

### 5. バウンディングボックスの描画

```javascript
// 座標の計算
const x = box.xmin * canvas.width / 100;
const y = box.ymin * canvas.height / 100;
const width = (box.xmax - box.xmin) * canvas.width / 100;
const height = (box.ymax - box.ymin) * canvas.height / 100;

// 矩形の描画
ctx.strokeStyle = color;
ctx.lineWidth = 3;
ctx.strokeRect(x, y, width, height);

// ラベルの描画
ctx.fillStyle = color;
ctx.fillRect(x, y - 20, textWidth + 10, 20);
ctx.fillStyle = 'white';
ctx.fillText(`${label} ${score}%`, x + 5, y - 5);
```

Canvas APIを使って、検出された物体の周りに矩形とラベルを描画します。

## 実用例

### 閾値の調整

```javascript
// 高精度のみ表示（厳しい閾値）
const highPrecision = await detector(image.src, { threshold: 0.7 });

// より多くの候補を表示（緩い閾値）
const moreResults = await detector(image.src, { threshold: 0.2 });
```

### 特定の物体のみフィルタリング

```javascript
const results = await detector(image.src, { threshold: 0.3 });

// 人物のみ抽出
const persons = results.filter(r => r.label === 'person');
console.log(`${persons.length}人検出しました`);
```

### 検出数のカウント

```javascript
const counts = {};
results.forEach(r => {
    counts[r.label] = (counts[r.label] || 0) + 1;
});
// 結果: { person: 3, car: 2, dog: 1 }
```

## ベストプラクティス

### ✅ 良い画像の条件
- 明るく、コントラストがはっきりしている
- 物体が画像の5%以上を占める
- 解像度: 640×480ピクセル以上

### ⚠️ 検出精度が下がる条件
- 極端に小さい物体（画像の1%未満）
- 重なりが多い物体
- ぼやけた画像や暗い画像

## よくある質問

**Q: どんな物体を検出できますか？**
A: COCO datasetの80クラス（人、車、動物、家具など）を検出できます。

**Q: 検出できる物体の数に制限はありますか？**
A: 理論上は無制限ですが、実用的には1枚の画像に20〜30個程度が最適です。

**Q: カスタムの物体を検出したい場合は？**
A: カスタムデータセットで学習したモデルが必要です。Hugging Faceで公開されているカスタムモデルを探すか、自分で学習させる必要があります。

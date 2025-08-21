# 📈 銘柄買収レジスター　〜 企業買収xレジの新感覚レジゲーム 〜

![key-visual](https://github.com/user-attachments/assets/9f87937a-a049-40eb-aad9-d9f09ca87e72)

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)  ![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)  ![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)  ![Tailwind_CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?logo=tailwind-css&logoColor=white)  ![Font_Awesome](https://img.shields.io/badge/Font_Awesome-339AF0?logo=font-awesome&logoColor=white)

「銘柄買収レジスター」は<u>日本株式市場プライム上場企業の銘柄コードを入力</u>し、その会社を「**買収**」するレジ型ゲームです。
30秒で多くの企業を買収し、買収した会社の**時価総額の合計とそのレシートの長さ**を競い合います。

## 特徴

- **実在する企業を買収できる**

  プライム上場株であればほとんどの企業を<u>自由に買収することができます</u>！！

  <img width="1710" alt="KADOKAWA" src="https://github.com/user-attachments/assets/30b46ace-bc2f-4c94-9917-726cecd96819" />

- **買収した企業のレシートがもらえる**

  買収した企業リストとして本物そっくりな**劇長レシート**がもらえちゃう！！

  <img width="1710" alt="レシート" src="https://github.com/user-attachments/assets/ba35f136-8b4e-4304-b75d-fb3ec4a0c3bc" />

- **本物さながらのレジ画面**

  以前製作した実際に動く自作POSレジ(Next.js+NestJS+PostgreSQL+TailWindCSS)を<u>今回のコンテストのために**HTML+JSに一部機能を移植**</u>。ほぼ本物のレジ画面を再現しました。

  もし、自作POSレジに興味があれば<u>[**こちら**](https://drive.google.com/file/d/11DMX3OIvgk1eL8UXGSLQv70MMDTGvI6k/view?usp=sharing)</u>の実際に動いている動画をご覧ください！！

  `↑ 興味がなくても是非最後まで見てみてください ↑`

  <img width="1710" alt="レジ画面" src="https://github.com/user-attachments/assets/00d31fca-da30-46bf-a586-037d9d7415e3" />

- **わかりやすいルール説明**

  初めてでも迷わないよう、情報量多めの超分かりやすいルール説明を実装！これで誰も困惑しません！！

  <img width="654" alt="説明画面" src="https://github.com/user-attachments/assets/1c6db096-7fd9-40b1-93be-f496a9cf9319" />

- **銘柄コードがわからなくても大丈夫！**

  銘柄コードを覚えたり調べたりしなくても遊べるゲームモードを実装！3つの企業名から高そうな企業を選んで銘柄コードを入力！

  <img width="654" alt="モード選択画面" src="https://github.com/user-attachments/assets/5554c903-df65-4dc4-a5ea-a03ce7b3bc28" /> <img width="654" alt="実際の画面" src="https://github.com/user-attachments/assets/9b121363-0637-4bff-a799-b86b62ad4984" />

- **AIが考えたユニークな称号**

  Claudeさんに考えてもらったユニークな称号を表示します！企業数や買収額に応じて20種類の称号が表示されます。

  <img width="654" alt="称号" src="https://github.com/user-attachments/assets/45eb48e0-7a7d-4561-851d-171d5927d2e0" />

- **簡単ツイートボタン**

  バックエンドが使用できないため、ランキングなどの機能が製作できませんでした。せっかくスコアと称号表示機能があるので、なんとか共有できるように、みんなで競い合えるようにしたく、実装しました！！

  <img width="654" alt="簡単ツイート" src="https://github.com/user-attachments/assets/0a41b9e1-76ee-4953-8a1b-2b8841ca4164" />

## 着想

~~PeyP◯y~~で~~ファ◯リーマート~~を買収するというネタから、企業買収してレシート垂れ流すゲーム作りたいな〜と思い、この度製作しました。

また、このゲームを通じて株式や企業買収に興味を持ってもらえたら嬉しいです。

`※ 私自身に株式などの知識はありません。`


## 使用技術

### フロントエンド

- **[Font Awesome](https://fontawesome.com/)**
- **[Tailwind CSS](https://tailwindcss.com/)**

### 動作確認済みのブラウザ

- Google Chrome
- Safari
- Firefox


## ディレクトリ構成
```
銘柄コードレジスター/
├── index.html              # メイン画面
├── main.js                 # メインのJavaScript
├── style.css               # メインのCSS
├── error.css               # エラー画面用CSS
├── 401.html, 403.html...   # エラーページ
├── assets/
│   ├── data/
│   │   └── ticker-symbol.json   # 銘柄データ
│   ├── js/
│   │   └── receipt.js           # レシート生成用JS
│   └── sounds/                  # 効果音・BGM
│       ├── 8888.mp3
│       ├── click.mp3
│       ├── ...
├── robots.txt
├── sitemap.xml
├── README.md
└── ...
```

## お借りした素材・技術

- BGM
  - DOVA-SYNDROME
    - https://dova-s.jp/
- SE
  - 効果音ラボ
    - https://soundeffect-lab.info/
  - oToLogic
    - https://otologic.jp/
  - On-Jin ～音人～
    - https://on-jin.com/
- タイトルロゴ
  - 5000choyen
  - https://github.com/yurafuca/5000choyen
- 株価・総発行株数取得
  - J-Quants API(日本取引所グループ公式API)
     - https://jpx-jquants.com/


## Copyright | コピーライト

```Copyright (C) 2025 YukiShima1010```
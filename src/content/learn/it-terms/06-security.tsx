import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, ComparisonTable, KeyPoints, Callout, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "it-security",
  title: "セキュリティ用語",
  description: "マルウェア・攻撃手法・詐欺・認証・暗号・防御製品・運用体制まで、セキュリティ用語を網羅的に収録した用語辞典。ウイルス/ランサムウェア/フィッシング/ゼロデイ/EDR/SIEM/ゼロトラストなど約270語。",
  domain: "it-terms",
  section: "security",
  order: 1,
  level: "intro",
  tags: ["セキュリティ", "マルウェア", "攻撃手法", "認証", "暗号"],
  updated: "2026-07-20",
  minutes: 20,
};

export default function Article() {
  return (
    <>
      <Lead>
        セキュリティ用語をまとめて引けるページです。「基本概念 → マルウェア → 攻撃手法 → 詐欺 → 認証 → 暗号 → 防御 → 診断 → 運用」の順に並べています。量が多いので、ブラウザの検索（<strong>Ctrl/⌘ + F</strong>）で探すのが便利です。
      </Lead>

      <Section>基本概念</Section>
      <ComparisonTable
        headers={["用語", "英語", "意味"]}
        rows={[
          ["サイバーセキュリティ", "Cyber Security", "情報システムを脅威から守る取り組み全般"],
          ["CIA トライアド", "Confidentiality / Integrity / Availability", "機密性・完全性・可用性。情報セキュリティの3本柱"],
          ["脅威 / 脆弱性 / リスク", "Threat / Vulnerability / Risk", "危険の原因 / 弱点 / 被害が起きる可能性の大きさ"],
          ["脆弱性", "Vulnerability", "攻撃に悪用されうるシステムの弱点・欠陥"],
          ["エクスプロイト", "Exploit", "脆弱性を突いて攻撃するコードや手法"],
          ["PoC", "Proof of Concept", "脆弱性が実際に悪用可能だと示す検証コード・実証"],
          ["アタックサーフェス", "Attack Surface", "攻撃を受けうる入口の総量。狭いほど安全"],
          ["ゼロトラスト", "Zero Trust", "内部も信用せず常に検証する前提の考え方"],
          ["ZTNA", "Zero Trust Network Access", "ゼロトラストに基づき、都度検証してアクセスを許可する仕組み"],
          ["多層防御", "Defense in Depth", "対策を何層も重ね、1つ破られても守る考え方"],
          ["最小権限の原則", "Least Privilege", "必要最小限の権限だけを与える設計方針"],
          ["セキュアコーディング", "Secure Coding", "脆弱性を作り込まない書き方を徹底する開発手法"],
          ["インシデント", "Incident", "セキュリティ上の事故・問題の発生"],
          ["不正アクセス", "Unauthorized Access", "権限がないのにシステムへ侵入・利用すること"],
          ["なりすまし", "Impersonation", "他人になりきってサービスを利用・操作すること"],
          ["ハッキング", "Hacking", "システムを解析・改変する行為。悪意あるものはクラッキングとも"],
          ["踏み台", "Stepping Stone", "攻撃者が身元を隠すために経由する第三者のコンピュータ"],
          ["サイバーテロ", "Cyber Terrorism", "社会基盤の混乱を狙ったサイバー攻撃"],
          ["アノニマス", "Anonymous", "政治的主張のもとに活動する国際的なハッカー集団"],
          ["ネットリテラシー", "Net Literacy", "インターネットを安全・適切に使いこなす知識と判断力"],
        ]}
      />

      <Section>マルウェアの種類</Section>
      <ComparisonTable
        headers={["用語", "英語", "意味"]}
        rows={[
          ["マルウェア", "Malware", "悪意を持って作られたソフトの総称"],
          ["ウイルス", "Virus", "他のファイルに寄生して感染・増殖するプログラム"],
          ["ワーム", "Worm", "単体で自己増殖し、ネットワーク越しに広がるプログラム"],
          ["トロイの木馬", "Trojan Horse", "無害なソフトを装って侵入し、内部で悪事を働くプログラム"],
          ["ランサムウェア", "Ransomware", "データを暗号化し、復旧と引き換えに身代金を要求する"],
          ["スパイウェア", "Spyware", "利用者に気づかれず情報を収集し外部に送信する"],
          ["アドウェア", "Adware", "望まない広告を表示するソフト。情報収集を伴うことも"],
          ["キーロガー", "Keylogger", "キー入力を記録し、パスワードなどを盗む"],
          ["バックドア", "Backdoor", "正規の認証を迂回して侵入できる裏口"],
          ["RAT", "Remote Access Trojan", "感染端末を遠隔操作するためのマルウェア"],
          ["Bot", "Bot", "外部からの指令で自動的に動作する感染端末・プログラム"],
          ["Botnet", "Botnet", "多数の Bot をまとめて操るネットワーク。DDoS 等に悪用される"],
          ["C&C サーバー", "Command and Control", "感染端末へ指令を出し、盗んだ情報を集める攻撃者のサーバー"],
          ["ドロッパー", "Dropper", "本体のマルウェアを内部に隠し持ち、感染先へ落とし込む"],
          ["ダウンローダー", "Downloader", "感染後に外部から本体マルウェアを取得して実行する"],
          ["パッカー", "Packer", "マルウェアを圧縮・難読化し、検知を逃れるツール"],
          ["バンキングトロージャン", "Banking Trojan", "ネットバンキングの認証情報や取引を狙うマルウェア"],
          ["スケアウェア", "Scareware", "偽の警告で不安を煽り、不要な購入や操作をさせる"],
          ["ストーカーウェア", "Stalkerware", "同意なく個人の位置や通信を監視するアプリ"],
          ["ブラウザ・ハイジャッカー", "Browser Hijacker", "ブラウザ設定を勝手に変え、特定サイトへ誘導する"],
          ["PUA", "Potentially Unwanted Application", "明確な悪意はないが望ましくない挙動をするアプリ"],
          ["ステルス", "Stealth", "検知や解析から逃れるためにマルウェアが自身を隠す技術"],
          ["オートラン", "Autorun", "メディア接続時に自動実行する仕組み。感染拡大に悪用された"],
          ["クリプトジャッキング", "Cryptojacking", "他人の端末を無断で暗号資産のマイニングに使う攻撃"],
          ["Exploit Kit", "Exploit Kit", "複数の脆弱性攻撃をまとめ、自動で感染させる攻撃ツール"],
          ["マニピュレーションサーバー", "Manipulation Server", "通信を改ざん・操作して不正な内容を送り込むサーバー"],
        ]}
      />

      <Section>代表的なマルウェアの名前</Section>
      <ComparisonTable
        headers={["名称", "分類", "概要"]}
        rows={[
          ["Emotet", "トロイの木馬", "メール添付から感染し、情報窃取と他マルウェア配布を行う。世界的に猛威"],
          ["Dridex", "バンキングトロージャン", "不正なマクロ付き文書で感染し、金融情報を狙う"],
          ["Zbot（ZeuS）", "バンキングトロージャン", "オンラインバンキングの認証情報を盗む代表的マルウェア"],
          ["コンフィッカー", "ワーム", "Windows の脆弱性を突いて大規模感染したワーム"],
          ["ガンブラー", "攻撃手法／一連の攻撃", "正規サイトを改ざんし、閲覧者を感染させた攻撃キャンペーン"],
          ["メリッサ", "ウイルス", "メール経由で爆発的に広がった初期の代表的マクロウイルス"],
          ["Rbot", "ボット型", "IRC 経由で遠隔操作されるボットの一種"],
          ["Delf", "トロイの木馬", "Delphi 製の多種多様な亜種を持つマルウェア群"],
          ["Dorkbot", "ワーム／ボット", "SNS やUSB経由で拡散し、認証情報を盗むボット"],
          ["Sirefef（ZeroAccess）", "ルートキット型", "深く潜伏し、クリック詐欺やマイニングを行う"],
        ]}
      />

      <Section>Web アプリケーションへの攻撃</Section>
      <ComparisonTable
        headers={["用語", "英語", "意味"]}
        rows={[
          ["SQL インジェクション", "SQL Injection", "入力に不正な SQL を混ぜ、DB を不正操作する攻撃"],
          ["クロスサイトスクリプティング", "XSS", "他人のブラウザ上で不正スクリプトを実行させる攻撃"],
          ["クロスサイトリクエストフォージェリ", "CSRF", "ログイン状態を悪用し、意図しない操作をさせる攻撃"],
          ["クリックジャッキング", "Clickjacking", "透明な要素を重ね、意図しないクリックをさせる攻撃"],
          ["ディレクトリトラバーサル", "Directory Traversal", "../ などで公開範囲外のファイルを読み出す攻撃"],
          ["バッファオーバーフロー", "Buffer Overflow", "想定以上のデータを送り込み、領域を溢れさせて任意コードを実行させる"],
          ["OS コマンドインジェクション", "OS Command Injection", "入力に OS コマンドを混ぜて実行させる攻撃"],
          ["SSRF", "Server-Side Request Forgery", "サーバーを踏み台にして内部ネットワークへアクセスさせる"],
          ["IDOR", "Insecure Direct Object Reference", "ID を書き換えるだけで他人のデータが見えてしまう不備"],
          ["OWASP Top 10", "OWASP Top 10", "Web の代表的な脆弱性をまとめた定番リスト"],
          ["ブラクラ", "Browser Crasher", "大量処理などでブラウザを強制終了させる悪質なページ"],
          ["ActiveX", "ActiveX", "旧 IE の拡張技術。強い権限ゆえ攻撃の温床になった"],
        ]}
      />

      <Section>ネットワークへの攻撃</Section>
      <ComparisonTable
        headers={["用語", "英語", "意味"]}
        rows={[
          ["DoS 攻撃", "Denial of Service", "過剰な負荷をかけてサービスを停止させる攻撃"],
          ["DDoS 攻撃", "Distributed DoS", "多数の端末から一斉に行う大規模な DoS 攻撃"],
          ["フラッディング攻撃", "Flooding", "大量のパケットを送りつけて回線や機器を溢れさせる"],
          ["ICMP 攻撃", "ICMP Attack", "ping などに使う ICMP を悪用した攻撃"],
          ["DNS キャッシュポイズニング", "DNS Cache Poisoning", "DNS に偽の対応情報を覚えさせ、偽サイトへ誘導する"],
          ["DNS リフレクター攻撃", "DNS Reflection", "DNS を反射役に使い、増幅した通信を標的へ送る DDoS"],
          ["オープンリゾルバ", "Open Resolver", "誰からの問い合わせにも応じる DNS。攻撃に悪用されやすい"],
          ["MITM 攻撃", "Man-in-the-Middle", "通信の間に割り込み、盗聴・改ざんする攻撃"],
          ["MITB 攻撃", "Man-in-the-Browser", "ブラウザ内部に潜み、送信内容を書き換える攻撃"],
          ["スプーフィング", "Spoofing", "送信元 IP やメールアドレスを偽装する行為"],
          ["ドメイン名ハイジャック", "Domain Hijacking", "ドメインの管理権を奪い、別のサーバーへ誘導する"],
        ]}
      />

      <Section>侵入・標的型の手口</Section>
      <ComparisonTable
        headers={["用語", "英語", "意味"]}
        rows={[
          ["標的型攻撃", "Targeted Attack", "特定の組織を狙い、綿密に準備して行う攻撃"],
          ["APT", "Advanced Persistent Threat", "長期間潜伏して執拗に狙い続ける高度な攻撃"],
          ["ゼロデイ攻撃", "Zero-Day Attack", "修正が公開される前の未知の脆弱性を突く攻撃"],
          ["ドライブ・バイ・ダウンロード", "Drive-by Download", "サイトを閲覧しただけで自動的に感染させる攻撃"],
          ["水飲み場型攻撃", "Watering Hole", "標的がよく訪れるサイトを改ざんして待ち伏せする攻撃"],
          ["サプライチェーン攻撃", "Supply Chain Attack", "取引先や利用ライブラリを経由して侵入する攻撃"],
          ["イニシャルアクセスブローカー", "Initial Access Broker", "侵入経路を確保し、他の攻撃者に売る仲介者"],
          ["サイバーキルチェーン", "Cyber Kill Chain", "偵察から目的達成までの攻撃段階を整理したモデル"],
          ["ラテラルムーブメント", "Lateral Movement", "侵入後、内部の別の機器へ横展開して被害を広げる"],
          ["特権の昇格", "Privilege Escalation", "より高い権限を不正に取得すること"],
          ["Shellshock", "Shellshock", "bash の脆弱性。遠隔から任意コマンドを実行できた重大事案"],
          ["Heartbleed", "Heartbleed", "OpenSSL の脆弱性。メモリ内容が漏洩した重大事案"],
          ["root 化 / Jailbreak", "Rooting / Jailbreak", "端末の制限を解除して管理者権限を得る行為。安全性が低下する"],
        ]}
      />

      <Section>認証・パスワードへの攻撃</Section>
      <ComparisonTable
        headers={["用語", "英語", "意味"]}
        rows={[
          ["ブルートフォース攻撃", "Brute Force", "総当たりでパスワードを試す攻撃"],
          ["リバースブルートフォース", "Reverse Brute Force", "パスワードを固定し、ID 側を次々に変えて試す攻撃"],
          ["パスワードリスト攻撃", "Password List Attack", "他所で漏洩した ID/パスワードの組で不正ログインを試みる"],
          ["アカウントリスト攻撃", "Account List Attack", "パスワードリスト攻撃と同義。使い回しが被害を広げる"],
        ]}
      />

      <Section>詐欺・ソーシャルエンジニアリング</Section>
      <ComparisonTable
        headers={["用語", "英語", "意味"]}
        rows={[
          ["ソーシャル・エンジニアリング", "Social Engineering", "技術ではなく人の心理や隙を突いて情報を得る手口"],
          ["フィッシング詐欺", "Phishing", "正規を装ったメール等で認証情報をだまし取る詐欺"],
          ["フィッシングサイト", "Phishing Site", "本物そっくりに作られた情報詐取用の偽サイト"],
          ["スピアフィッシング", "Spear Phishing", "特定個人・組織向けに内容を作り込んだフィッシング"],
          ["スミッシング", "Smishing", "SMS を使ったフィッシング詐欺"],
          ["ビッシング", "Vishing", "音声通話を使ったフィッシング詐欺"],
          ["ファーミング", "Pharming", "DNS 等を改ざんし、正規 URL でも偽サイトへ誘導する"],
          ["サポート詐欺", "Tech Support Scam", "偽の警告画面でサポートを装い、金銭や遠隔操作を要求する"],
          ["スパム", "Spam", "受信者の同意なく大量送信される迷惑メッセージ"],
          ["Malspam", "Malspam", "マルウェアを添付・誘導する悪意あるスパムメール"],
          ["チェーンメール", "Chain Mail", "転送を促し連鎖的に広がるメール。デマ拡散の温床"],
          ["ドキシング", "Doxing", "個人情報を暴き、ネット上で晒す嫌がらせ行為"],
          ["ネットストーカー", "Cyberstalking", "ネットを通じて執拗につきまとう行為"],
          ["ダークウェブ", "Dark Web", "通常の検索では届かない匿名性の高い領域"],
          ["ダークマーケット", "Dark Market", "ダークウェブ上で違法な物品・情報が売買される闇市場"],
          ["CaaS", "Crime-as-a-Service", "サイバー犯罪の道具や手口をサービスとして売買する形態"],
          ["RaaS", "Ransomware-as-a-Service", "ランサムウェアをサービスとして提供する犯罪ビジネス"],
          ["PhaaS", "Phishing-as-a-Service", "フィッシングの仕組みを一式提供する犯罪サービス"],
        ]}
      />

      <Section>認証・アクセス管理</Section>
      <ComparisonTable
        headers={["用語", "英語", "意味"]}
        rows={[
          ["認証 / 認可", "Authentication / Authorization", "誰かを確かめること / 何を許すかを決めること"],
          ["多要素認証（MFA）", "Multi-Factor Authentication", "知識・所持・生体など複数要素を組み合わせる認証"],
          ["二要素認証", "Two-Factor Authentication", "異なる2種類の要素で認証する方式"],
          ["二段階認証", "Two-Step Verification", "2回に分けて確認する方式。要素は同種のこともある"],
          ["ワンタイムパスワード", "One-Time Password", "一度きり・短時間だけ有効な使い捨てパスワード"],
          ["生体認証", "Biometrics", "指紋・顔・虹彩など身体的特徴による認証"],
          ["パスキー", "Passkey", "パスワードを使わず端末の鍵と生体認証でログインする方式"],
          ["パスフレーズ", "Passphrase", "複数語をつないだ長く覚えやすいパスワード"],
          ["シングルサインオン", "Single Sign-On", "一度の認証で複数サービスを利用できる仕組み"],
          ["OAuth", "OAuth", "パスワードを渡さず、権限だけを外部サービスに委譲する仕組み"],
          ["OpenID", "OpenID", "外部の ID を使って本人確認を行う認証の規格"],
          ["SAML", "Security Assertion Markup Language", "企業向け SSO で認証情報を安全に受け渡す規格"],
          ["IDaaS", "Identity as a Service", "ID 管理・認証をクラウドで提供するサービス"],
          ["特権 ID", "Privileged ID", "管理者など強い権限を持つアカウント。厳重管理が必要"],
          ["BYOD", "Bring Your Own Device", "私物端末を業務利用すること。管理と情報漏洩に注意"],
          ["シャドー IT", "Shadow IT", "会社が把握しないまま従業員が使うIT機器・サービス"],
          ["MDM", "Mobile Device Management", "モバイル端末を一元管理し、紛失時に遠隔ロック等を行う"],
        ]}
      />

      <Section>暗号・通信の保護</Section>
      <ComparisonTable
        headers={["用語", "英語", "意味"]}
        rows={[
          ["暗号化 / 復号", "Encryption / Decryption", "読めない形に変換する / 元に戻す"],
          ["共通鍵暗号方式", "Common Key Cryptography", "暗号化と復号に同じ鍵を使う方式。高速"],
          ["公開鍵暗号方式", "Public Key Cryptography", "公開鍵で暗号化し秘密鍵で復号。鍵配布が安全"],
          ["AES", "Advanced Encryption Standard", "現在標準的に使われる強力な共通鍵暗号方式"],
          ["ハッシュ値", "Hash", "データから求まる固定長の値。改ざん検知や保存に使う"],
          ["ソルト / ストレッチング", "Salt / Stretching", "ハッシュに加える乱数 / 計算を遅くし総当たりを防ぐ"],
          ["デジタル署名 / 電子署名", "Digital Signature", "作成者の正当性と改ざんの有無を保証する仕組み"],
          ["デジタル証明書", "Digital Certificate", "公開鍵の持ち主を第三者が保証する電子的な証明書"],
          ["SSL / TLS", "SSL / TLS", "通信を暗号化する技術。現在の標準は TLS"],
          ["IPsec", "IPsec", "IP 層で通信を暗号化・認証する仕組み。VPN で使われる"],
          ["VPN", "Virtual Private Network", "公衆回線上に仮想の専用線を作り安全に通信する"],
          ["SSH", "Secure Shell", "サーバーへ安全に接続・操作するためのプロトコル"],
          ["Tor", "The Onion Router", "通信を多段中継し匿名性を高める仕組み"],
          ["ステガノグラフィ", "Steganography", "画像などにデータを埋め込み、存在自体を隠す技術"],
          ["量子暗号", "Quantum Cryptography", "量子力学の性質を利用し、盗聴を検知できる暗号技術"],
          ["WEP / WPA / WPA2 / WPA3", "Wi-Fi Security", "無線LANの暗号化規格。WEP は脆弱で WPA3 が最新"],
          ["TKIP", "Temporal Key Integrity Protocol", "WEP の弱点を補うために作られた暗号化方式（現在は非推奨）"],
          ["SSID", "Service Set Identifier", "無線 LAN のアクセスポイントを識別する名前"],
        ]}
      />

      <Section>防御の仕組み・製品</Section>
      <ComparisonTable
        headers={["用語", "英語", "意味"]}
        rows={[
          ["ファイアウォール", "Firewall", "通信を許可/拒否して不正アクセスを防ぐ仕組み"],
          ["パーソナルファイアウォール", "Personal Firewall", "個々の端末上で動作するファイアウォール"],
          ["WAF", "Web Application Firewall", "Web アプリを狙う攻撃に特化した防御機構"],
          ["IDS", "Intrusion Detection System", "不正侵入を検知して知らせるシステム"],
          ["IPS", "Intrusion Prevention System", "不正侵入を検知し、通信の遮断まで行うシステム"],
          ["UTM", "Unified Threat Management", "複数のセキュリティ機能を1台に統合した機器"],
          ["非武装ネットワーク（DMZ）", "DeMilitarized Zone", "社内と外部の中間に置く、公開サーバー用の領域"],
          ["プロキシサーバー", "Proxy Server", "通信を代理で中継し、制御・記録を行うサーバー"],
          ["SWG", "Secure Web Gateway", "Web アクセスを検査し、危険な通信を遮断する仕組み"],
          ["CASB", "Cloud Access Security Broker", "クラウド利用を可視化・制御する仕組み"],
          ["SASE", "Secure Access Service Edge", "ネットワークとセキュリティをクラウドで統合提供する考え方"],
          ["DLP", "Data Loss Prevention", "機密情報を特定し、外部持ち出しを検知・ブロックする"],
          ["EDR", "Endpoint Detection and Response", "端末の挙動を記録・監視し、脅威の検知と対応を行う"],
          ["XDR", "Extended Detection and Response", "端末に加えネットワークやクラウドまで横断的に検知・対応"],
          ["MDR", "Managed Detection and Response", "検知と対応を専門事業者が代行するサービス"],
          ["MSS", "Managed Security Service", "セキュリティ運用を外部の専門事業者に委託するサービス"],
          ["サンドボックス", "Sandbox", "隔離環境で実行し、安全性を確かめる仕組み"],
          ["ハニーポット", "Honeypot", "わざと攻撃させて手口を観察するための囮システム"],
          ["ターピット", "Tarpit", "接続をわざと遅延させ、攻撃や大量送信を妨害する仕組み"],
          ["ヒューリスティック", "Heuristic", "既知パターンに頼らず、振る舞いから未知の脅威を推定する検知"],
          ["プロアクティブ検知", "Proactive Detection", "被害が出る前に、予兆や未知の脅威を先回りして検知すること"],
          ["Web フィルタリング", "Web Filtering", "有害・業務外のサイトへのアクセスを制限する仕組み"],
          ["メールフィルタリング", "Mail Filtering", "迷惑メールや不正な添付を検知・遮断する仕組み"],
          ["ネットワーク検疫", "Network Quarantine", "社内接続前に端末の安全性を検査し、問題があれば隔離する"],
          ["SPF / DKIM / DMARC", "SPF / DKIM / DMARC", "メール送信元の正当性を検証し、なりすましを防ぐ仕組み"],
          ["EMET", "Enhanced Mitigation Experience Toolkit", "脆弱性攻撃を緩和する Microsoft の旧ツール"],
          ["CSP / セキュリティヘッダ", "Content Security Policy", "ブラウザに安全策を指示する HTTP ヘッダ"],
          ["サニタイズ / エスケープ", "Sanitize / Escape", "危険な入力を無害化する / 特殊文字の意味を打ち消す"],
          ["パッチ", "Patch", "脆弱性や不具合を修正するための更新プログラム"],
          ["アプライアンス", "Appliance", "特定用途に特化した専用機器。導入が容易で高性能"],
        ]}
      />

      <Section>診断・テスト</Section>
      <ComparisonTable
        headers={["用語", "英語", "意味"]}
        rows={[
          ["脆弱性診断", "Vulnerability Assessment", "既知の弱点が無いかを網羅的に調べる検査"],
          ["ペネトレーションテスト", "Penetration Test", "実際に攻撃を試み、侵入できるかを検証する診断"],
          ["ファジング", "Fuzzing", "大量のランダム入力を与えて不具合や脆弱性を発見する手法"],
          ["SAST / DAST / SCA", "Static / Dynamic / Composition Analysis", "静的解析 / 動的解析 / 依存ライブラリの解析"],
          ["DevSecOps / シフトレフト", "DevSecOps / Shift Left", "開発の早い段階からセキュリティを組み込む考え方"],
          ["脅威モデリング / STRIDE", "Threat Modeling / STRIDE", "設計段階で脅威を洗い出す手法 / その代表的な分類"],
        ]}
      />

      <Section>運用・組織・標準</Section>
      <ComparisonTable
        headers={["用語", "英語", "意味"]}
        rows={[
          ["CSIRT（CERT）", "Computer Security Incident Response Team", "インシデント対応を担う専門チーム"],
          ["SOC", "Security Operation Center", "監視と初動対応を継続的に行う専門組織"],
          ["SIEM", "Security Information and Event Management", "各種ログを集約・相関分析して脅威を検知する仕組み"],
          ["ログ", "Log", "システムの動作や操作を記録したもの。追跡の基礎"],
          ["フォレンジック", "Forensics", "証拠を保全し、侵害の経緯を科学的に調査すること"],
          ["インシデント対応", "Incident Response", "準備・検知・封じ込め・根絶・復旧・教訓の一連の対応"],
          ["脅威インテリジェンス", "Threat Intelligence", "攻撃者や手口の情報を収集・分析し、防御に活かす知見"],
          ["IoC", "Indicator of Compromise", "侵害を示す痕跡（不審な IP・ハッシュ値など）"],
          ["OSINT", "Open Source Intelligence", "公開情報を収集・分析して調査に活用する手法"],
          ["MITRE ATT&CK", "MITRE ATT&CK", "攻撃者の戦術・技術を体系化した知識ベース"],
          ["脆弱性管理", "Vulnerability Management", "棚卸し→検出→トリアージ→修正→検証を回す運用"],
          ["CVE / CVSS / CWE", "CVE / CVSS / CWE", "脆弱性の識別番号 / 深刻度スコア / 種類の分類"],
          ["KEV / EPSS", "KEV / EPSS", "悪用が確認済みの一覧 / 悪用されやすさの予測スコア"],
          ["責任ある開示", "Responsible Disclosure", "修正の猶予を与えたうえで脆弱性を報告する作法"],
          ["ISMS", "Information Security Management System", "情報セキュリティを組織的に管理する仕組み（ISO 27001）"],
          ["コンプライアンス", "Compliance", "法令や社内規程を遵守すること"],
          ["個人情報保護法", "APPI", "個人情報の取り扱いを定めた日本の法律"],
          ["PCI DSS", "PCI DSS", "クレジットカード情報を扱う事業者向けのセキュリティ基準"],
        ]}
      />

      <Section>関連する IT・基盤用語</Section>
      <ComparisonTable
        headers={["用語", "英語", "意味"]}
        rows={[
          ["IaaS / PaaS / SaaS", "IaaS / PaaS / SaaS", "インフラ / 開発基盤 / 完成ソフトを借りるクラウド形態"],
          ["DaaS / iPaaS", "Desktop / Integration as a Service", "デスクトップ環境の提供 / システム連携基盤の提供"],
          ["CDN", "Content Delivery Network", "コンテンツを分散配置し高速配信する仕組み。DDoS 緩和にも"],
          ["DNS", "Domain Name System", "ドメイン名と IP アドレスを対応づける仕組み"],
          ["Cookie", "Cookie", "ブラウザに保存される小さなデータ。ログイン状態の保持等"],
          ["パケット", "Packet", "通信データを分割した単位"],
          ["グローバル IP アドレス", "Global IP Address", "インターネット上で一意な IP アドレス"],
          ["NAS", "Network Attached Storage", "ネットワークに接続して共有する記憶装置"],
          ["SNMP", "Simple Network Management Protocol", "ネットワーク機器を監視・制御するプロトコル"],
          ["RDP", "Remote Desktop Protocol", "遠隔から端末の画面を操作するプロトコル。攻撃対象になりやすい"],
          ["IRC", "Internet Relay Chat", "古くからあるチャット規格。ボットの指令に悪用された歴史がある"],
          ["テザリング", "Tethering", "スマホ経由で他端末をインターネット接続させる機能"],
          ["シンクライアント", "Thin Client", "端末側は最小限にし、処理をサーバー側で行う仕組み"],
          ["ファイル共有ソフト", "P2P File Sharing", "利用者同士でファイルを共有するソフト。情報漏洩の原因にも"],
          ["IoT", "Internet of Things", "あらゆるモノがネットにつながる仕組み。脆弱な機器が狙われる"],
          ["人工知能", "Artificial Intelligence", "学習・推論を行う技術。攻撃にも防御にも使われる"],
          ["ブロックチェーン", "Blockchain", "改ざんが困難な分散型の取引記録技術"],
          ["暗号資産（仮想通貨）", "Cryptocurrency", "ブロックチェーン上で流通する電子的な資産"],
          ["NFT", "Non-Fungible Token", "唯一性を証明できるデジタル資産の規格"],
          ["Web3.0", "Web3", "ブロックチェーンを基盤とする分散型のインターネット構想"],
          ["エコシステム", "Ecosystem", "製品やサービスが連携し合って成り立つ全体の仕組み"],
          ["ブラウザーフィンガープリント", "Browser Fingerprint", "ブラウザの設定情報から個人を識別・追跡する技術"],
        ]}
      />

      <Callout variant="info" title="仕組みから学ぶなら">
        認証・認可・暗号・Web の攻撃と対策、CVE/CVSS や DevSecOps・SIEM・ペネトレーションテストまで、「セキュリティ基礎」コースで体系的に扱っています。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "マルウェアは感染の仕方で分類: ウイルス（寄生）/ ワーム（自己増殖）/ トロイの木馬（偽装）",
          "攻撃は Web（SQLi・XSS・CSRF）/ ネットワーク（DoS・DNS 偽装）/ 人（フィッシング）に大別できる",
          "認証は多要素化が基本。パスキー・生体認証・ワンタイムパスワードで使い回しの被害を防ぐ",
          "暗号は共通鍵（速い）と公開鍵（配布が安全）。通信は TLS、無線は WPA3 が現行の標準",
          "防御は多層で: 入口（FW/WAF/IPS）→ 端末（EDR/XDR）→ 監視（SIEM/SOC）→ 対応（CSIRT）",
          "運用は脆弱性管理（CVE/CVSS→パッチ）とインシデント対応の2系統で回す",
        ]}
      />
    </>
  );
}

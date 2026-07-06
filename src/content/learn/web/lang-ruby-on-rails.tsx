import type { LearnMeta } from "../../../lib/learnCategories";
import { Lead, Section, SubSection, Callout, Code, Cmd, KeyPoints, ComparisonTable, KVList, Bridge, Divider } from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "lang-ruby-on-rails",
  title: "Ruby on Rails とは",
  description: "「設定より規約」で高速に Web アプリを作れるフルスタックフレームワーク Rails の特徴・MVC・エコシステムをまとめる。",
  domain: "web",
  section: "backend",
  order: 3,
  level: "basic",
  tags: ["Ruby", "Rails", "フレームワーク"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>
        Ruby on Rails は、Ruby 製の<strong>フルスタック Web フレームワーク</strong>です。2004 年に DHH（David Heinemeier Hansson）が開発を始め、<strong>「設定より規約（Convention over Configuration）」</strong>という思想で「決められた置き場所・命名に従えば、設定を書かずに動く」開発体験を広めました。DB 接続・セキュリティ対策・テストまで標準で揃い、少人数でも高速に Web アプリを立ち上げられます。
      </Lead>

      <Section>設計思想 — CoC と DRY</Section>
      <p>
        Rails の核は 2 つの原則です。<strong>CoC（設定より規約）</strong>は「規約に従えば設定は最小限で済む」という考え方で、モデル名 <Cmd>Post</Cmd> なら自動的に <Cmd>posts</Cmd> テーブルに対応する、といった対応付けが暗黙で成立します。<strong>DRY（Don't Repeat Yourself）</strong>は同じ記述を繰り返さない原則です。この 2 つが「速く書ける」体験を支えています。
      </p>

      <Callout variant="tip" title="Scaffold / Generator で骨組みを自動生成">
        <Cmd>rails generate scaffold Post title:string body:text</Cmd> のようなコマンドで、モデル・ビュー・コントローラ・マイグレーションを一気に生成できます。CRUD の雛形が数秒で立ち上がります。
      </Callout>

      <p>
        なぜ「設定を書かなくても動く」のか。Rails は<strong>命名規約から関係を推論</strong>しているからです。クラス名 <Cmd>Post</Cmd>（単数・キャメルケース）を見れば、対応テーブルは <Cmd>posts</Cmd>（複数・スネークケース）だと機械的に導けます。この規約を実装で担っているのが Ruby の<strong>メタプログラミング</strong>——実行時にクラスやメソッドを動的に定義・呼び出しする仕組みです。<Cmd>find_by_title</Cmd> のようなメソッドは事前定義されておらず、呼ばれた瞬間にカラム名から生成されています。
      </p>

      <Bridge course="ソフトウェア工学 / 言語処理系">
        「規約に従えば設定が消える」は、ソフトウェア工学でいう<strong>設定より規約（CoC）</strong>と<strong>DRY 原則</strong>の実践例です。そしてそれを支える<strong>メタプログラミング</strong>（<Cmd>method_missing</Cmd> による動的メソッド解決、実行時のクラス再オープン）は、講義で扱う「言語のリフレクション／自己記述性」に対応します。「フレームワークの魔法」に見える部分が、実は言語の動的性という理論的土台の上に立っていると分かると、Rails の裏側が読めるようになります。
      </Bridge>

      <Section>MVC アーキテクチャ</Section>
      <p>
        Rails は <strong>MVC（Model / View / Controller）</strong>で構成されます。Model が DB とドメインロジックを、Controller がリクエストの交通整理を、View が HTML の描画を担当します。1 本のリクエストは次のように各層を通過します。
      </p>

      <KVList
        items={[
          { key: "1. Router", val: "URL とHTTP メソッドから、どの Controller#action へ回すか決める" },
          { key: "2. Controller", val: "パラメータを受け取り、Model に処理を依頼して結果をまとめる" },
          { key: "3. Model", val: "Active Record が DB を読み書きし、ドメインロジックを担う" },
          { key: "4. View", val: "受け取ったデータを HTML（ERB）に流し込んで描画" },
        ]}
      />

      <Bridge course="ソフトウェア工学 / 関心の分離">
        MVC は講義で習う<strong>関心の分離（Separation of Concerns）</strong>の代表的な適用例です。「表示（View）」「入力処理（Controller）」「データとルール（Model）」を分けることで、片方を変えても他方に波及しにくくなり、テストもしやすくなります。設計原則が抽象論で終わらず、フレームワークのディレクトリ構造として強制されているのが Rails の面白いところです。
      </Bridge>

      <SubSection>Model — Active Record と O/R マッピング</SubSection>
      <p>
        テーブルとクラスを対応させる ORM が <strong>Active Record</strong> です。SQL を書かずにレコードを操作でき、テーブルの 1 行が 1 オブジェクト、カラムが属性、外部キーが関連（<Cmd>has_many</Cmd> / <Cmd>belongs_to</Cmd>）に対応します。これが<strong>O/R マッピング</strong>——リレーショナルな「表」の世界と、オブジェクト指向の「オブジェクトの網」の世界を橋渡しする仕組みです。
      </p>
      <Code lang="ruby" filename="app/models/post.rb">{`class Post < ApplicationRecord
  # posts テーブルと自動で対応。カラムはそのまま属性になる
  belongs_to :user          # posts.user_id --> users.id（外部キー）
  has_many :comments        # 1 対多の関連を宣言的に表す
  validates :title, presence: true
end`}</Code>
      <Code lang="ruby" filename="呼び出し側（SQL を書かずに問い合わせ）">{`# 裏で SELECT が発行される。メソッドチェーンがクエリになる
Post.where(published: true).order(created_at: :desc).limit(10)

user.posts.count          # JOIN 相当の関連もオブジェクト経由でたどれる`}</Code>

      <Bridge course="データベース">
        Active Record は、<strong>データベース</strong>の講義で習う<strong>リレーショナルモデル</strong>（表・主キー・外部キー・正規化）と、オブジェクト指向の間の<strong>インピーダンスミスマッチ</strong>を吸収する層です。<Cmd>has_many</Cmd> は外部キーによる 1 対多を、<Cmd>where.order.limit</Cmd> は関係代数の選択・整列・射影をメソッドで表しています。SQL を隠してくれる一方、発行される SQL を意識しないと N+1 問題（後述）を踏むので、「裏で何の SQL が出ているか」を読める力は結局 DB の知識に帰ってきます。
      </Bridge>

      <SubSection>Controller とルーティング</SubSection>
      <Code lang="ruby" filename="config/routes.rb & posts_controller.rb">{`# config/routes.rb
resources :posts   # 一行で CRUD 用の 7 ルートを生成

# app/controllers/posts_controller.rb
def index
  @posts = Post.all
end`}</Code>

      <SubSection>View（ERB テンプレート）</SubSection>
      <Code lang="erb" filename="app/views/posts/index.html.erb">{`<% @posts.each do |post| %>
  <h2><%= post.title %></h2>
<% end %>`}</Code>

      <Section>強みとエコシステム</Section>
      <ul>
        <li>開発スピードが速い（Scaffold / Generator / Active Record）</li>
        <li>CSRF / XSS / SQL インジェクション対策が<strong>標準搭載</strong></li>
        <li>Minitest / RSpec でテスト文化が根付いている</li>
        <li>フロントは Hotwire（Turbo / Stimulus）で JS を最小化できる</li>
        <li>認証は Devise、非同期処理は Active Job（Sidekiq）、デプロイは Kamal / Render / Fly.io</li>
      </ul>

      <Callout variant="info" title="採用事例と最新版">
        GitHub・Cookpad・BASE・CrowdWorks・食べログなど大規模サービスで採用されています。最新安定版は Rails 7.1.x 系です。
      </Callout>

      <Callout variant="warn" title="よくある落とし穴 — N+1 問題">
        ORM が SQL を隠すため、一覧表示で「投稿 100 件それぞれの著者を取りに行く」と、<strong>1 + 100 回</strong>のクエリが飛ぶことがあります（N+1 問題）。<Cmd>Post.includes(:user)</Cmd> のように<strong>事前読み込み（eager loading）</strong>すれば数本の JOIN にまとめられます。ORM の便利さの裏で「実際に発行される SQL」を読める必要がある、という DB 知識が効く典型例です。
      </Callout>

      <SubSection>他フレームワークとの位置づけ</SubSection>
      <ComparisonTable
        headers={["観点", "Rails", "Laravel(PHP)", "Django(Python)"]}
        rows={[
          ["設計思想", "設定より規約・DRY", "エレガントな DX 重視", "batteries included"],
          ["ORM", "Active Record", "Eloquent", "Django ORM"],
          ["特徴", "メタプロで規約を強制", "Facade・豊富なヘルパ", "管理画面が標準"],
          ["向き", "素早い CRUD 立ち上げ", "中小〜中規模 Web", "堅めの業務 Web"],
        ]}
      />

      <Divider />

      <KeyPoints
        items={[
          "Rails は Ruby 製のフルスタック Web フレームワーク。DHH が 2004 年に開発",
          "CoC（設定より規約）と DRY を、Ruby のメタプログラミングが裏で支えている",
          "MVC は関心の分離の実践。層ごとの責務がディレクトリ構造として強制される",
          "Active Record は O/R マッピング。DB のリレーショナルモデルとオブジェクトを橋渡し",
          "ORM の便利さの裏で N+1 問題など「発行される SQL」を読む DB 力が要る",
        ]}
      />
    </>
  );
}

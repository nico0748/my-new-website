import type { LearnMeta } from "../../../lib/learnCategories";
import {
  Lead,
  Section,
  SubSection,
  Callout,
  Code,
  Cmd,
  KeyPoints,
  ComparisonTable,
  KVList,
  TipBox,
  Bridge,
  Divider,
} from "../../../components/learn/kit";

export const meta: LearnMeta = {
  id: "python-web-frameworks",
  title: "Python の Web フレームワーク — Django / FastAPI / Flask",
  description:
    "Python の代表的な 3 つの Web フレームワークの違いと使い分け。Flask の軽量さ、Django のフルスタック、FastAPI の型安全と自動ドキュメントを比較する。",
  domain: "web",
  section: "backend",
  order: 11,
  level: "basic",
  tags: ["Python", "Django", "FastAPI"],
  updated: "2026-07-07",
};

export default function Article() {
  return (
    <>
      <Lead>
        Python で Web バックエンドを作るとき、まず選ぶのがフレームワークです。定番は
        <strong> Flask</strong>（軽量・自由）、<strong>Django</strong>（フルスタック・全部入り）、<strong>FastAPI</strong>（型安全・高速・自動ドキュメント）の 3
        つ。それぞれの思想と最小コードを比べ、使い分けの指針まで掴みましょう。
      </Lead>

      <Section>3 つの比較</Section>
      <p>
        同じ「Web サーバを立てる」目的でも、思想がまったく違います。まず全体像を表で押さえます。
      </p>

      <ComparisonTable
        headers={["観点", "Flask", "Django", "FastAPI"]}
        rows={[
          ["立ち位置", "マイクロ（最小限）", "フルスタック（全部入り）", "モダン API 特化"],
          ["ORM", "なし（別途 SQLAlchemy 等）", "組み込み ORM", "なし（SQLAlchemy / SQLModel）"],
          ["管理画面", "なし", "自動生成の admin あり", "なし"],
          ["型 / 自動ドキュメント", "手動", "限定的", "型ヒントから自動生成"],
          ["非同期 async", "対応（後付け寄り）", "対応（ASGI）", "ネイティブに async"],
          ["向くケース", "小規模・自由設計", "大規模・DB 中心の Web アプリ", "型安全な API・高スループット"],
        ]}
      />

      <Callout variant="info" title="どれも「正解」ではなく「相性」">
        優劣ではなく用途の違いです。小さく始めたいなら Flask、DB 中心の大きなアプリなら
        Django、型安全な API を高速に作りたいなら FastAPI、というのが大まかな相場観です。
      </Callout>

      <Divider />

      <Section>Flask — 最小で自由</Section>
      <p>
        Flask は<strong>マイクロフレームワーク</strong>。ルーティングとリクエスト処理という最小限だけを提供し、DB や認証などは必要に応じて自分で組み合わせます。「必要なものだけ」を好む人向けです。
      </p>

      <Code lang="bash">{`pip install flask`}</Code>

      <Code lang="python" filename="app.py">{`from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/")
def home():
    return "Hello, Flask!"

@app.route("/users/<int:user_id>")
def get_user(user_id):
    return jsonify({"id": user_id, "name": "Yuma"})

if __name__ == "__main__":
    app.run(debug=True)`}</Code>

      <Code lang="bash">{`python app.py     # http://127.0.0.1:5000 で起動`}</Code>

      <KVList
        items={[
          { key: "強み", val: "軽い・学習が速い・構成が自由" },
          { key: "弱み", val: "大規模化すると自前で決める設計判断が増える" },
          { key: "相棒", val: "SQLAlchemy（ORM）・Jinja2（テンプレート）" },
        ]}
      />

      <Divider />

      <Section>Django — フルスタックで全部入り</Section>
      <p>
        Django は<strong>「バッテリー同梱」を地で行くフルスタック</strong>フレームワークです。ORM・認証・管理画面（admin）・フォーム・テンプレートまで最初から揃っており、DB を中心とした Web アプリを素早く堅牢に作れます。
      </p>

      <Code lang="bash">{`pip install django
django-admin startproject mysite
cd mysite
python manage.py startapp blog`}</Code>

      <Bridge course="ソフトウェア工学 / 設計">
        Django の構造は<strong> MVT（Model-View-Template）</strong>と呼ばれますが、中身は古典的な<strong> MVC パターン</strong>とほぼ同じです。Model＝データとビジネスルール、Template＝表示（MVC の View に相当）、View＝入力を受けてどの Model・Template を使うか決める調停役（MVC の Controller に相当）。呼び名の割り当てがずれているだけで、「データ・表示・制御を分離する」という関心の分離の思想は講義の MVC そのものです。
      </Bridge>

      <SubSection>モデル（ORM）</SubSection>
      <p>
        テーブルを Python のクラスで定義します。SQL を直接書かずに DB を操作できます。クラス＝テーブル、インスタンス＝行、属性＝カラムという<strong>オブジェクトと関係（リレーション）の対応づけ</strong>を Django ORM が自動で面倒みます。
      </p>

      <Code lang="python" filename="blog/models.py">{`from django.db import models

class Post(models.Model):
    title = models.CharField(max_length=120)
    body = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title`}</Code>

      <Code lang="bash">{`python manage.py makemigrations   # マイグレーション作成
python manage.py migrate          # DB に反映`}</Code>

      <p>
        ORM の狙いは<strong>「オブジェクト指向の世界」と「リレーショナルの世界」の食い違い（インピーダンスミスマッチ）を吸収する</strong>ことです。下のようなメソッド呼び出しが、内部で <Cmd>SELECT ... WHERE ...</Cmd> という SQL に翻訳されて実行されます。
      </p>

      <Code lang="python" filename="blog/queries.py">{`# ORM のクエリ → 裏で SQL に翻訳される
Post.objects.filter(title__icontains="python")  # WHERE title ILIKE '%python%'
Post.objects.order_by("-created_at")[:10]        # ORDER BY created_at DESC LIMIT 10
Post.objects.get(id=1)                            # WHERE id = 1（1 件）`}</Code>

      <Bridge course="データベース">
        ORM は、講義で書いてきた<strong> SQL（SELECT / JOIN / WHERE）</strong>を、オブジェクト操作の裏に隠すレイヤーです。<Cmd>filter()</Cmd> は関係代数の<strong>選択（σ）</strong>、<Cmd>.values(&quot;id&quot;,&quot;title&quot;)</Cmd> は<strong>射影（π）</strong>、<Cmd>ForeignKey</Cmd> をたどる操作は<strong>結合（⋈）</strong>に対応します。マイグレーションは <Cmd>CREATE TABLE</Cmd>/<Cmd>ALTER TABLE</Cmd> という DDL の管理そのもの。ただし SQL を隠すぶん、下で何本のクエリが飛ぶかを意識しないと性能問題（次の N+1）を招くため、正規化やインデックスの知識は依然として必要です。
      </Bridge>

      <Callout variant="warn" title="N+1 問題という落とし穴">
        一覧を取得したあとにループで各行の関連データを都度取りにいくと、<strong>1（一覧）+ N（各行）回</strong>のクエリが飛んで激遅になります。Django なら <Cmd>select_related</Cmd> / <Cmd>prefetch_related</Cmd> で JOIN / まとめ取得に変えて防ぎます。ORM で SQL が見えないからこそ、発行クエリ数を確認する癖が実務では重要です。
      </Callout>

      <SubSection>ビュー（ルーティング）</SubSection>
      <Code lang="python" filename="blog/views.py">{`from django.http import JsonResponse
from .models import Post

def post_list(request):
    posts = Post.objects.all().values("id", "title")
    return JsonResponse(list(posts), safe=False)`}</Code>

      <Callout variant="tip" title="admin が強力">
        <Cmd>python manage.py createsuperuser</Cmd> で管理者を作り、モデルを
        <Cmd> admin.site.register(Post)</Cmd> するだけで、データの追加・編集・削除ができる管理画面が自動で手に入ります。運用面での時短が大きい特徴です。
      </Callout>

      <TipBox>
        API を作るなら <Cmd>Django REST Framework（DRF）</Cmd> を組み合わせるのが定番。シリアライザとビューセットで REST API を素早く構築できます。
      </TipBox>

      <Divider />

      <Section>FastAPI — 型安全と自動ドキュメント</Section>
      <p>
        FastAPI は Python の<strong>型ヒントを最大限に活かす</strong>モダンな API フレームワークです。型から入力の検証と OpenAPI ドキュメントを自動生成し、<Cmd>async</Cmd> をネイティブに扱えるため高スループットにも強いのが特徴です。
      </p>

      <Code lang="bash">{`pip install "fastapi[standard]"`}</Code>

      <Code lang="python" filename="main.py">{`from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class User(BaseModel):
    id: int
    name: str

@app.get("/")
async def home():
    return {"message": "Hello, FastAPI!"}

@app.post("/users")
async def create_user(user: User):
    # user は型に沿って自動で検証される
    return {"created": user.name, "id": user.id}`}</Code>

      <Code lang="bash">{`fastapi dev main.py   # http://127.0.0.1:8000 で起動`}</Code>

      <SubSection>型ヒントが効く 3 つの恩恵</SubSection>
      <KVList
        items={[
          { key: "自動バリデーション", val: "Pydantic が型に合わない入力を 422 で自動的に弾く" },
          { key: "自動ドキュメント", val: "/docs（Swagger UI）と /redoc が自動生成される" },
          { key: "エディタ補完", val: "型情報で入力補完と静的チェックが効く" },
        ]}
      />

      <Callout variant="info" title="/docs を開くだけ">
        起動後に <Cmd>http://127.0.0.1:8000/docs</Cmd> にアクセスすると、そのまま試せる対話的な API ドキュメント（Swagger UI）が表示されます。手で書かなくてもエンドポイント一覧・入出力スキーマが揃うのが FastAPI 最大の魅力です。
      </Callout>

      <Bridge course="プログラミング言語論 / 型理論">
        FastAPI は「型は<strong>実行時の値を保証しない</strong>ヒント」という Python の建前を逆手に取り、型ヒントを<strong>ランタイム検証・スキーマ生成の仕様</strong>として使います。<Cmd>user: User</Cmd> と書くと、Pydantic がその型を<strong>述語（この形に合致するか）</strong>として受信データを検証し、外部からの入力を型が保証された値に絞り込みます。これは型理論でいう「<strong>パースして検証する（parse, don&apos;t validate）</strong>」——信頼できない <Cmd>dict</Cmd> を、型が付いた安全なオブジェクトへ一度で変換する考え方の実践例です。境界で型を作り込めば、内側のコードは常に正しい形のデータだけを扱えます。
      </Bridge>

      <Divider />

      <Section>使い分けの指針</Section>
      <p>迷ったら、次の観点で選ぶと外しにくいです。</p>

      <KVList
        items={[
          {
            key: "Flask を選ぶ",
            val: "小さく始めたい・構成を自分でコントロールしたい・学習用や軽い内部ツール",
          },
          {
            key: "Django を選ぶ",
            val: "管理画面や認証が要る DB 中心の Web アプリ・チーム開発・堅牢さと標準化を重視",
          },
          {
            key: "FastAPI を選ぶ",
            val: "型安全な REST / JSON API・自動ドキュメントが欲しい・非同期で高スループットが必要",
          },
        ]}
      />

      <Callout variant="warn" title="最初は 1 つに絞る">
        3 つを同時に学ぶ必要はありません。まず 1 つを選んで小さなアプリを完成させると、ルーティング・DB・リクエスト処理といった共通概念が身につき、他へ移るのも容易になります。
      </Callout>

      <Divider />

      <KeyPoints
        items={[
          "Flask はマイクロ。最小限で自由、必要な部品は自分で足す",
          "Django はフルスタック。ORM・admin・認証まで全部入りで DB 中心アプリに強い",
          "FastAPI は型ヒント駆動。自動検証・自動 OpenAPI ドキュメント・async が魅力",
          "優劣ではなく用途の相性で選ぶ。まずは 1 つを完成させるのが近道",
        ]}
      />
    </>
  );
}
